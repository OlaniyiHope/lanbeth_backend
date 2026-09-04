import Course from "../models/elearningModel.js";
import Enrollment from "../models/Enrollment.js";
import Lecture from "../models/Lecture.js";

const getUserId = (req) => req.user?._id || req.user?.id;

// ─────────────────────────────────────────────────────────────────────────
// Courses
// ─────────────────────────────────────────────────────────────────────────

// POST /api/elearning/courses (multipart/form-data, optional "thumbnail" file)
// Teachers/admins create a course.
export const createCourse = async (req, res) => {
  try {
    const role = req.user?.role;
    if (role !== "teacher" && role !== "admin") {
      return res.status(403).json({ message: "Only teachers can create courses." });
    }

    const teacherId = getUserId(req);
    const { title, code, description, department, session } = req.body;

    if (!title || !session) {
      return res.status(400).json({ message: "Course title and session are required." });
    }

    const course = await Course.create({
      title,
      code,
      description,
      department,
      teacher: teacherId,
      session,
      thumbnailUrl: req.file ? req.file.location : undefined,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("createCourse error:", error);
    res.status(500).json({ message: "Failed to create course." });
  }
};

// GET /api/elearning/courses?sessionId=...&mine=true
// Intentionally NOT behind authenticateUser — browsing the course catalog is public,
// so a visitor who isn't logged in yet can still see what's on offer.
// - Teachers/admins: pass mine=true (requires being logged in) to see only their own courses.
// - Students: each course comes back tagged with isEnrolled (only meaningful if logged in).
export const listCourses = async (req, res) => {
  try {
    const userId = getUserId(req);
    const role = req.user?.role;
    const { sessionId, mine } = req.query;

    const filter = {};
    if (sessionId) filter.session = sessionId;
    if (mine === "true" && (role === "teacher" || role === "admin")) {
      filter.teacher = userId;
    }

    const courses = await Course.find(filter)
      .populate("teacher", "username studentName subjectTaught")
      .sort({ createdAt: -1 });

    let enrolledCourseIds = new Set();
    if (role === "student") {
      const enrollments = await Enrollment.find({ student: userId }).select("course");
      enrolledCourseIds = new Set(enrollments.map((e) => e.course.toString()));
    }

    const shaped = courses.map((course) => {
      const obj = course.toObject();
      obj.teacherName = course.teacher?.username || course.teacher?.studentName || "Unknown";
      obj.isEnrolled = enrolledCourseIds.has(course._id.toString());
      return obj;
    });

    res.json(shaped);
  } catch (error) {
    console.error("listCourses error:", error);
    res.status(500).json({ message: "Failed to load courses." });
  }
};

// GET /api/elearning/courses/:id
// Single course detail — also public, same reasoning as listCourses.
export const getCourse = async (req, res) => {
  try {
    const userId = getUserId(req);
    const role = req.user?.role;
    const { id } = req.params;

    const course = await Course.findById(id).populate(
      "teacher",
      "username studentName subjectTaught"
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    let isEnrolled = false;
    if (role === "student") {
      isEnrolled = Boolean(await Enrollment.exists({ student: userId, course: id }));
    }

    const obj = course.toObject();
    obj.teacherName = course.teacher?.username || course.teacher?.studentName || "Unknown";
    obj.isEnrolled = isEnrolled;

    res.json(obj);
  } catch (error) {
    console.error("getCourse error:", error);
    res.status(500).json({ message: "Failed to load course." });
  }
};

// ─────────────────────────────────────────────────────────────────────────
// Enrollment
// ─────────────────────────────────────────────────────────────────────────

// POST /api/elearning/courses/:id/enroll
// Students register themselves for a course.
export const enrollInCourse = async (req, res) => {
  try {
    const role = req.user?.role;
    if (role !== "student") {
      return res.status(403).json({ message: "Only students can register for courses." });
    }

    const studentId = getUserId(req);
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: id,
      session: course.session,
    });

    res.status(201).json(enrollment);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You're already registered for this course." });
    }
    console.error("enrollInCourse error:", error);
    res.status(500).json({ message: "Failed to register for course." });
  }
};

// GET /api/elearning/enrollments
// A student's own registered courses.
export const listMyEnrollments = async (req, res) => {
  try {
    const studentId = getUserId(req);

    const enrollments = await Enrollment.find({ student: studentId }).populate({
      path: "course",
      populate: { path: "teacher", select: "username studentName" },
    });

    const shaped = enrollments
      .filter((enrollment) => enrollment.course) // guard against a deleted course
      .map((enrollment) => {
        const course = enrollment.course.toObject();
        course.teacherName =
          enrollment.course.teacher?.username || enrollment.course.teacher?.studentName || "Unknown";
        return course;
      });

    res.json(shaped);
  } catch (error) {
    console.error("listMyEnrollments error:", error);
    res.status(500).json({ message: "Failed to load your registered courses." });
  }
};

// ─────────────────────────────────────────────────────────────────────────
// Lectures / materials
// ─────────────────────────────────────────────────────────────────────────

// POST /api/elearning/courses/:id/lectures (multipart/form-data, optional file)
// Course owner (or admin) adds a lecture: either an uploaded file or an external link.
export const addLecture = async (req, res) => {
  try {
    const role = req.user?.role;
    const userId = getUserId(req);
    const { id } = req.params;
    const { title, description, externalUrl } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    const isOwner = course.teacher.toString() === String(userId);
    if (role !== "admin" && !isOwner) {
      return res.status(403).json({ message: "You can only add lectures to your own courses." });
    }

    if (!title) {
      return res.status(400).json({ message: "Lecture title is required." });
    }

    let resourceType;
    let url;
    let fileName;

    if (req.file) {
      resourceType = "file";
      url = req.file.location; // public S3 URL, provided by multer-s3
      fileName = req.file.originalname;
    } else if (externalUrl && externalUrl.trim()) {
      resourceType = "link";
      url = externalUrl.trim();
    } else {
      return res.status(400).json({ message: "Attach a file or provide a lecture link." });
    }

    const lecture = await Lecture.create({
      course: id,
      title,
      description,
      resourceType,
      url,
      fileName,
      session: course.session,
    });

    res.status(201).json(lecture);
  } catch (error) {
    console.error("addLecture error:", error);
    res.status(500).json({ message: "Failed to add lecture." });
  }
};

// GET /api/elearning/courses/:id/lectures
// Visible to: the course's own teacher, admins, and students registered for it.
export const listLectures = async (req, res) => {
  try {
    const role = req.user?.role;
    const userId = getUserId(req);
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    if (role === "student") {
      const isEnrolled = await Enrollment.exists({ student: userId, course: id });
      if (!isEnrolled) {
        return res.status(403).json({ message: "Register for this course to view its lectures." });
      }
    } else if (role === "teacher") {
      const isOwner = course.teacher.toString() === String(userId);
      if (!isOwner) {
        return res.status(403).json({ message: "You can only view lectures for your own courses." });
      }
    }
    // admins: no extra restriction

    const lectures = await Lecture.find({ course: id }).sort({ createdAt: 1 });
    res.json(lectures);
  } catch (error) {
    console.error("listLectures error:", error);
    res.status(500).json({ message: "Failed to load lectures." });
  }
};
