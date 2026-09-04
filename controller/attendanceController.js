import User from "../models/userModel.js";
import Attendance from "../models/attendanceModel.js";
import { sendSms } from "../services/twilioService.js";

const todayString = () => new Date().toISOString().split("T")[0];

// Your schema only has a single `phone` field — normalize it to E.164 for Twilio
const resolveGuardianPhone = (student) => {
  const raw = student?.phone ? String(student.phone).trim() : "";
  if (!raw) return "";
  if (raw.startsWith("+")) return raw;
  const digitsOnly = raw.replace(/^0+/, ""); // strip leading 0 if stored locally (e.g. "08012345678")
  return `+234${digitsOnly}`; // ⚠️ change 234 if you need a different country code
};

const resolveGuardianName = (student) => student?.parentsName || "Parent/Guardian";

// POST /attendance/check-in — called by the barcode scan page
export const checkIn = async (req, res) => {
  try {
    const { admNo, sessionId, className } = req.body;
    if (!admNo) return res.status(400).json({ message: "admNo is required" });

    const student = await User.findOne({ AdmNo: admNo, role: "student" });
    if (!student) {
      return res.status(404).json({ message: `No student found with Admission No. ${admNo}` });
    }

    const date = todayString();

    let record = await Attendance.findOne({
      student: student._id,
      date,
      ...(sessionId ? { session: sessionId } : {}),
    });

    if (record) {
      return res.status(200).json({
        alreadyCheckedIn: true,
        message: `${student.studentName || student.username} was already checked in today.`,
        student: {
          _id: student._id,
          name: student.studentName || student.username,
          AdmNo: student.AdmNo,
          className: student.classname || className,
        },
        attendance: record,
      });
    }

    record = await Attendance.create({
      student: student._id,
      session: sessionId,
      className: className || student.classname || "—",
      date,
      status: "present",
      checkInTime: new Date(),
      notificationStatus: "pending",
    });

    const guardianPhone = resolveGuardianPhone(student);
    const guardianName = resolveGuardianName(student);
    const studentName = student.studentName || student.username || "Your child";

    console.log(`🔔 [checkIn] Notifying guardian for ${studentName} — phone: "${guardianPhone || "MISSING"}"`);

    let notified = false;
    let notificationError = null;

    if (guardianPhone) {
      try {
     await sendSms(guardianPhone, { "1": guardianName, "2": studentName });
        notified = true;
        record.notified = true;
        record.notificationStatus = "sent";
      } catch (err) {
        notificationError = err.message;
        record.notificationStatus = "failed";
        record.notificationError = err.message;
      }
    } else {
      notificationError = "No guardian phone number on file";
      record.notificationStatus = "skipped";
      record.notificationError = notificationError;
    }

    await record.save();

    return res.status(201).json({
      alreadyCheckedIn: false,
      message: notified
        ? `${studentName} checked in — parent notified.`
        : `${studentName} checked in, but notification failed (${notificationError}).`,
      student: {
        _id: student._id,
        name: studentName,
        AdmNo: student.AdmNo,
        className: student.classname || className,
      },
      attendance: record,
      notified,
      notificationError,
    });
  } catch (err) {
    console.error("❌ [checkIn] Attendance check-in error:", err);
    return res.status(500).json({ message: "Server error during check-in", error: err.message });
  }
};

// POST /attendance — bulk save from the manual DailyAttendance page (NOW sends WhatsApp notifications)
export const markBulkAttendance = async (req, res) => {
  try {
    const { sessionId, className, date, students } = req.body;
    if (!sessionId || !className || !Array.isArray(students)) {
      return res.status(400).json({ message: "sessionId, className, and students[] are required" });
    }
    const day = date || todayString();
    console.log(`📋 [markBulkAttendance] Saving ${students.length} student(s) for ${className} on ${day}`);

    const results = [];

    for (const s of students) {
      console.log(`— Processing studentId=${s.studentId} status=${s.status}`);

      const existing = await Attendance.findOne({ student: s.studentId, session: sessionId, date: day });
      const shouldNotify = s.status === "present" && (!existing || existing.status !== "present");

      let notified = false;
      let notificationStatus = existing?.notificationStatus || "skipped";
      let notificationError = existing?.notificationError || null;

      if (shouldNotify) {
        const student = await User.findById(s.studentId);
        if (!student) {
          console.warn(`⚠️ [markBulkAttendance] No user found for studentId=${s.studentId}`);
        }
        const guardianPhone = student ? resolveGuardianPhone(student) : "";
        const guardianName = student ? resolveGuardianName(student) : "Parent/Guardian";
        const studentName = student?.studentName || student?.username || "Your child";

        console.log(`🔔 [markBulkAttendance] ${studentName} marked present — phone: "${guardianPhone || "MISSING"}"`);

        if (guardianPhone) {
          try {
        await sendSms(guardianPhone, { "1": guardianName, "2": studentName });
            notified = true;
            notificationStatus = "sent";
            notificationError = null;
          } catch (err) {
            notificationStatus = "failed";
            notificationError = err.message;
            console.error(`❌ [markBulkAttendance] Failed to notify for ${studentName}:`, err.message);
          }
        } else {
          notificationStatus = "skipped";
          notificationError = "No guardian phone number on file";
          console.warn(`⚠️ [markBulkAttendance] Skipped — no phone on file for ${studentName}`);
        }
      } else {
        console.log(`— Skipping notification (status=${s.status}, shouldNotify=${shouldNotify})`);
      }

      const record = await Attendance.findOneAndUpdate(
        { student: s.studentId, session: sessionId, date: day },
        {
          $set: {
            className,
            status: s.status || "present",
            notified,
            notificationStatus,
            notificationError,
            ...(shouldNotify ? { checkInTime: new Date() } : {}),
          },
        },
        { upsert: true, new: true }
      );

      results.push(record);
    }

    console.log(`✅ [markBulkAttendance] Done — ${results.length} record(s) saved`);
    return res.status(200).json({ message: "Attendance saved", count: results.length, results });
  } catch (err) {
    console.error("❌ [markBulkAttendance] Bulk attendance save error:", err);
    return res.status(500).json({ message: "Server error saving attendance", error: err.message });
  }
};

// GET /attendance/:sessionId/:className/:date
export const getAttendanceByDate = async (req, res) => {
  try {
    const { sessionId, className, date } = req.params;
    const records = await Attendance.find({ session: sessionId, className, date }).populate(
      "student",
      "studentName username AdmNo classname"
    );
    return res.status(200).json(records);
  } catch (err) {
    return res.status(500).json({ message: "Server error fetching attendance", error: err.message });
  }
};

// GET /attendance/recent/:sessionId
export const getRecentCheckIns = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const date = todayString();
    const records = await Attendance.find({ session: sessionId, date })
      .sort({ checkInTime: -1 })
      .limit(50)
      .populate("student", "studentName username AdmNo classname");
    return res.status(200).json(records);
  } catch (err) {
    return res.status(500).json({ message: "Server error fetching check-ins", error: err.message });
  }
};