const express = require("express");
const router = express.Router();
const responseUtil = require("../utils/responseUtils");
const auth = require("../config/auth");
const { HTTPErrorMessage } = require("../config");
const userController = require("../controllers/user.controller");
const passport = require("passport");

router.post("/auth/login", userController.loginController);

router.post("/auth/register", userController.registerController);

router.get(
  "/conversations",
  auth.jwtAuth(),
  userController.conversationController
);

router.get("/profile", auth.jwtAuth(), userController.getUserProfile);

router.put("/password", auth.jwtAuth(), userController.updatePassword);

router.get("/validate", auth.jwtAuth(), userController.validateToken);

module.exports = router;
