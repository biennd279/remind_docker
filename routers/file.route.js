const express = require("express");
const router = express.Router();
const auth = require("../config/auth");
const fileService = require("../services/file.service");
const responseUtil = require("../utils/responseUtils");

router.get("/:classroomId", (req, res, next) => {
  const { classroomId } = req.params;

  fileService
    .getClassroomFiles(classroomId)
    .then((data) => {
      return responseUtil.success(res, 200, data);
    })
    .catch(next);
});

router.post("/:classroomId", (req, res, next) => {
  const { classroomId } = req.params;
  const { name, url, type, size, message } = req.body;

  fileService
    .addFile({ name, url, type, size }, classroomId, message)
    .then((data) => {
      return responseUtil.success(res, 200, data);
    })
    .catch(next);
});

module.exports = router;
