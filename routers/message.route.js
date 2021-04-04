const express = require("express");
const router = express.Router();
const auth = require("../config/auth");
const messageService = require("../services/message.service");
const responseUtil = require("../utils/responseUtils");

router.get("/:convoId", async (req, res, next) => {
  const convoId = req.params.convoId;

  try {
    let messages = await messageService.getConversationMessages(convoId);

    return responseUtil.success(res, 200, messages);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
