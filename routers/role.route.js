const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role.controller");

router.route("/").get(roleController.getRoles);

module.exports = router;
