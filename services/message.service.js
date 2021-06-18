const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

/**
 * Insert a new message.
 * @param {Message} message
 */
exports.insertMessage = (message) => {
  let newMessage = Message.fromJson(message);
  return Message.query().insert(newMessage);
};

/**
 * @param {Object} messageWithAttachment
 * @param {Object} messageWithAttachment.attachment
 */
exports.insertMessageWithAttachment = async (messageWithAttachment) => {
  return Message.query().insertGraph(messageWithAttachment);
};

exports.getConversationMessages = (conversationId) => {
  //TODO: Use pagination
  return Message.query()
    .select()
    .where("conversation_id", conversationId)
};

/**
 * Create new conversation with the following members in it
 * @param {Conversation} conversation
 * @param {Array<Number>} memberIds
 * @return Conversation
 */
exports.createNewConversation = async (conversation, memberIds) => {
  const knex = Conversation.knex();
  try {
    const newConversation = await Conversation.query().insert(conversation);

    return knex("participant").insert(
      memberIds.map((memberId) => {
        return {
          conversation_id: newConversation.id,
          user_id: memberId,
        };
      })
    ).then(() => newConversation);
  } catch (err) {
    throw err;
  }
};

/**
 *
 * @param {Number} convoId
 * @returns {*}
 */
exports.getConversationDetail = (convoId) => {
  return Conversation.query().findById(convoId).withGraphFetched("members")
};

/**
 *
 * @param {Number} convoId
 */
exports.getConversationMember = async (convoId) => {
  let convo = await Conversation.query().findById(convoId).first()
  return convo.$relatedQuery("members")
}
