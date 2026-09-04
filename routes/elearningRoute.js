// import express from "express";
// import multer from "multer";
// import multerS3 from "multer-s3";
// import authenticateUser from "../middleware/authMiddleware.js";
// import {
//   createCourse,
//   listCourses,
//   enrollInCourse,
//   listMyEnrollments,
//   addLecture,
//   listLectures,
// } from "../controller/elearningController.js";

// // Call this with your shared s3 client from index.js, e.g.:
// //   app.use("/api/elearning", elearningRoute(s3));
// export default function elearningRoute(s3) {
//   const router = express.Router();

//   const upload = multer({
//     storage: multerS3({
//       s3: s3,
//       bucket: "edupros", // same bucket used for homework attachments
//       acl: "public-read",
//       contentType: multerS3.AUTO_CONTENT_TYPE,
//       key: function (req, file, cb) {
//         const fileKey = `elearning/${Date.now()}-${file.originalname}`;
//         cb(null, fileKey);
//       },
//     }),
//     limits: {
//       fileSize: 500 * 1024 * 1024, // 500MB, matches the homework upload limit
//     },
//   });

//   router.post("/courses", authenticateUser, createCourse);
//   router.get("/courses", authenticateUser, listCourses);

//   router.post("/courses/:id/enroll", authenticateUser, enrollInCourse);
//   router.get("/enrollments", authenticateUser, listMyEnrollments);

//   router.post(
//     "/courses/:id/lectures",
//     authenticateUser,
//     upload.single("attachment"),
//     addLecture
//   );
//   router.get("/courses/:id/lectures", authenticateUser, listLectures);

//   return router;
// }


import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import authenticateUser from "../middleware/authMiddleware.js";
import {
  createCourse,
  listCourses,
  getCourse,
  enrollInCourse,
  listMyEnrollments,
  addLecture,
  listLectures,
} from "../controller/elearningController.js";

// Call this with your shared s3 client from index.js, e.g.:
//   app.use("/api/elearning", elearningRoute(s3));
export default function elearningRoute(s3) {
  const router = express.Router();

  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "edupros", // same bucket used for homework attachments
      acl: "public-read",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        const fileKey = `elearning/${Date.now()}-${file.originalname}`;
        cb(null, fileKey);
      },
    }),
    limits: {
      fileSize: 500 * 1024 * 1024, // 500MB, matches the homework upload limit
    },
  });

  // Public: browsing the catalog doesn't require login, only enrolling/managing does.
  router.get("/courses", listCourses);
  router.get("/courses/:id", getCourse);

  // Still requires login: only teachers/admins can create courses.
  router.post("/courses", authenticateUser, upload.single("thumbnail"), createCourse);

  router.post("/courses/:id/enroll", authenticateUser, enrollInCourse);
  router.get("/enrollments", authenticateUser, listMyEnrollments);

  router.post(
    "/courses/:id/lectures",
    authenticateUser,
    upload.single("attachment"),
    addLecture
  );
  router.get("/courses/:id/lectures", authenticateUser, listLectures);

  return router;
}
