const event = require("../config").SocketIOEvent.message;
const error_event = require("../config").SocketIOEvent.error
const errorMsg = require("../config").SocketErrorMessage;
const Message = require("../models/Message");
const { messageService, userService, fileService } = require("../services");
const scheduleUtil = require("../utils/scheduleUtils");
const debug = require("debug")("remind-clone:socket:message");
const util = require('util');

class MessageNamespace {
  /**
   *
   * @param {import("socket.io").Socket} socket
   * @param {import("socket.io").Namespace} nsp
   */
  constructor(socket, nsp) {
    this.socket = socket;
    this.nsp = nsp;
  }

  init() {
    this.joinUserChannel();
    this.joinConvoChannels();
    this.socket.on(event.NEW_MESSAGE, this._newMessageHandler.bind(this));
    this.socket.on(
      event.NEW_GROUP_CONVERSATION,
      this._newGroupConversationHandler.bind(this)
    );
  }

  joinUserChannel() {
    let userId = this.socket.user.id;
    this.socket.join(`user#${userId}`);
  }

  joinConvoChannels() {
    let userId = this.socket.user.id;
    userService.getUserConversationIds(userId).then((arr) => {
      arr.forEach((id) => {
        this.socket.join(`convo#${id}`);
      });
    });
  }

  /**
   * @alias NewMessageHandlerCallback
   * @function
   * @param {Object} ackMessage
   */

  /**
   * Handle NEW_MESSAGE event. This handler will first
   * create a new return message, then invoke the callback
   * to let the sender know that the message was sent successfully.
   * Then, it will insert the new message to the database, getting
   * its ID and emit the new message to all participant in
   * that conversation.
   * @param {String} messageData
   * @param {Function} fn
   * @param {NewMessageHandlerCallback} fn - Notify sender that the message has been received
   * @private
   */
  async _newMessageHandler(messageData, fn = function (err, msg) {}) {

    try {
      const message = JSON.parse(messageData)

      if (message.attachment != null) {
        let newFile = await fileService.insertFile(message.attachment);
        message.attachment.id = newFile.id;
      }

      let newMessage = await messageService.insertMessage({
        sender_id: message.sender_id,
        conversation_id: message.conversation_id, //TODO: check if the user is in that conversation
        message: message.message || message.message_text,
        message_text: message.message_text,
        attachment_id: message.attachment ? message.attachment.id : undefined,
      })

      let convoChannel = `convo#${newMessage.conversation_id}`;
      this.nsp.in(convoChannel).emit(event.NEW_MESSAGE, newMessage);

      if (fn) fn(null, newMessage)
    } catch (err) {
      debug(err);
      if (fn) fn(new Error(errorMsg.DEFAULT));
    }
  }

  /**
   * Handle NEW_GROUP_CONVERSATION event
   * @param {String} jsonData
   * @param {Function} fn
   */
  async _newGroupConversationHandler(jsonData, fn) {
    let data = JSON.parse(jsonData)

    const {
      sender_id,
      message,
      receiverIds,
      attachment,
      classroomId,
    } = data;

    let allUserIds = [sender_id, ...receiverIds];
    try {
      // Create new conversation in db
      let newConvoId = await messageService.createNewConversation(
        {
          type: "group",
          creator_id: sender_id,
          classroom_id: classroomId,
        },
        allUserIds
      );
      // Subscribe all user involved to this conversation (socket.io)
      let newConvoChannel = `convo#${newConvoId}`;

      // Get all clients of users inside this conversation and join
      // them all.
      let allUserChannels = allUserIds.map((id) => `user#${id}`);
      allUserChannels.forEach((channel) => {
        let sockets = Object.values(this.nsp.in(channel).sockets);
        sockets.forEach((s) => {
          s.join(newConvoChannel);
        });
      });

      let newMessage = await messageService.insertMessage({
        sender_id: sender_id,
        conversation_id: newConvoId, //TODO: check if the user is in that conversation
        message: message.richText || message.text,
        message_text: message.text,
        attachment_id: attachment ? attachment.id : undefined,
      });

      this.nsp.in(newConvoChannel).emit(event.NEW_MESSAGE, newMessage);
    } catch (err) {
      debug(err);
      if (fn) fn(new Error(errorMsg.DEFAULT));
    }
  }
}

/**
 * Handle all events coming to this namespace.
 * socket will have an extra properties called `user`
 * because we implemented socket authentication earlier.
 * @param {import("socket.io").Socket} socket
 * @param {import("socket.io").Namespace} nsp
 */
exports.handleEvents = (socket, nsp) => {
  const messageNsp = new MessageNamespace(socket, nsp);
  messageNsp.init();
};
