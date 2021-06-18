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

router.get("/convo/:convoId/detail", (req, res, next) => {
  const convoId = req.params.convoId;

  messageService
      .getConversationDetail(convoId)
      .then((data) => {
        return responseUtil.success(res, 200, data);
      })
      .catch(next);
});

/**
 * @param {Number} convoId
 */
router.get("/convo/:convoId/members", (req, res, next) => {
  const convoId = req.params.convoId;

  messageService
      .getConversationMember(convoId)
      .then((data) => {
        return responseUtil.success(res, 200, data);
      })
      .catch(next);
});

module.exports = router;
