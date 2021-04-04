const event = require("../config").SocketIOEvent.message;
const errorMsg = require("../config").SocketErrorMessage;
const Message = require("../models/Message");
const { messageService, userService, fileService } = require("../services");
const scheduleUtil = require("../utils/scheduleUtils");
const debug = require("debug")("remind-clone:socket:message");

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
   * @param {Object} message
   * @param {Object} message.sender
   * @param {Object} message.conversation
   * @param {Object} message.message
   * @param {Boolean} [message.canReply]
   * @param {Object} [message.attachment]
   * @param {Date | String} message.createdAt
   * @param {Date | String} [message.scheduledAt]
   * @param {NewMessageHandlerCallback} fn - Notify sender that the message has been received
   * @private
   */
  async _newMessageHandler(message, fn = function (err, msg) {}) {
    let broadcastMessage = {
      sender: message.sender,
      message: message.message || message.messageText,
      messageText: message.messageText,
      createdAt: message.createdAt,
      conversationId: message.conversationId,
      canReply: message.canReply || true,
      attachment: message.attachment,
    };
    //TODO: Implement scheduled message
    if (fn) fn(null, broadcastMessage);
    console.log(message);
    try {
      if (message.attachment != null) {
        let newFile = await fileService.insertFile(message.attachment);
        message.attachment.id = newFile.id;
      }
      let newMessage = await messageService.insertMessage({
        sender_id: message.sender.id,
        conversation_id: message.conversationId, //TODO: check if the user is in that conversation
        message: message.message || message.messageText,
        message_text: message.messageText,
        attachment_id: message.attachment ? message.attachment.id : undefined,
      });
      broadcastMessage.id = newMessage.id;
      let convoChannel = `convo#${broadcastMessage.conversationId}`;
      this.nsp.in(convoChannel).emit(event.NEW_MESSAGE, broadcastMessage);
    } catch (err) {
      debug(err);
      if (fn) fn(new Error(errorMsg.DEFAULT));
    }
  }

  /**
   * Handle NEW_GROUP_CONVERSATION event
   * @param {Object} data
   * @param {Object} data.sender
   * @param {Object} data.message
   * @param {Boolean} [data.canReply]
   * @param {Object} [data.attachment]
   * @param {Number} data.classroomId
   * @param {Array<Number>} data.receiverIds
   * @param {Date | String} data.createdAt
   * @param {Date | String} [data.scheduledAt]
   * @param {Function} fn
   */
  async _newGroupConversationHandler(data, fn) {
    const {
      sender,
      message,
      createdAt,
      receiverIds,
      canReply,
      attachment,
      classroomId,
    } = data;

    let allUserIds = [sender.id, ...receiverIds];
    try {
      // Create new conversation in db
      let newConvoId = await messageService.createNewConversation(
        {
          type: "group",
          creator_id: sender.id,
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
      // Add new message in db
      let broadcastMessage = {
        sender: sender,
        message: message.richText || message.text,
        createdAt: createdAt,
        conversationId: newConvoId,
        canReply: canReply || true,
        attachment: attachment,
      };

      let newMessage = await messageService.insertMessage({
        sender_id: sender.id,
        conversation_id: newConvoId, //TODO: check if the user is in that conversation
        message: message.richText || message.text,
        message_text: message.text,
        attachment_id: attachment ? attachment.id : undefined,
      });
      broadcastMessage.id = newMessage.id;

      // Emit the new message to socket subscribing to this conversation
      this.nsp.in(newConvoChannel).emit(event.NEW_MESSAGE, broadcastMessage);
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
