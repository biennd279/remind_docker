const express = require("express");
const router = express.Router();
const classroomController = require("../controllers/classroom.controller");
const auth = require("../config/auth");

router.use("/", auth.jwtAuth());

router.route("/")
  .get(classroomController.getClassrooms)
  .post(classroomController.postClassroom)

router.get("/my-class", classroomController.getUserClassrooms);

router.post("/join/:classroomCode", classroomController.joinClassroomViaCode);

router.use('/:classroomId', classroomController.middleware)

router
  .route("/:classroomId")
  .get(classroomController.getClassroom)
  .put(classroomController.putClassroom)
  .patch(classroomController.patchClassroom)
  .delete(classroomController.deleteClassroom);

router.get("/:classroomId/owners", classroomController.getOwners)

router.get("/:classroomId/students", classroomController.getStudents)

router.post("/:classroomId/students/join", classroomController.joinClassroom)

router.post("/:classroomId/students/leave", classroomController.leaveClassroom)

router.get("/:classroomId/members", classroomController.getAllMembers);

router.patch("/:classroomId/setting", classroomController.patchSetting);

module.exports = router;