const Model = require("objection").Model;
const knex = require("../databases/knex");

Model.knex(knex);

class Message extends Model {
  static get tableName() {
    return "message";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["sender_id", "conversation_id"],
      properties: {
        sender_id: {
          type: "integer",
        },
        conversation_id: {
          type: "integer",
        },
        message: {
          type: "string",
          maxlength: 1000,
        },
        message_text: {
          type: "string",
          maxlength: 1000,
        },
        attachment_id: {
          type: "integer",
        },
        parent_message_id: {
          type: "integer",
        },
      },
    };
  }

  static get relationMappings() {
    return {
      sender: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./User"),
        join: {
          from: "message.sender_id",
          to: "user.id",
        },
      },
      attachment: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./File"),
        join: {
          from: "message.attachment_id",
          to: "file.id",
        },
      },
      conversation: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("./Conversation"),
        join: {
          from: "message.conversation_id",
          to: "conversation.id",
        },
      },
    };
  }
}

module.exports = Message;
