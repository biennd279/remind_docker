const Model = require("objection").Model;
const knex = require("../databases/knex");

Model.knex(knex);

class Conversation extends Model {
  static get tableName() {
    return "conversation";
  }

  static modifiers = {
    getMemberIds(builder) {
      return builder
        .select("user_id")
        .innerJoin("participant", "id", "conversation_id");
    },
  };

  static get jsonSchema() {
    return {
      type: "object",
      required: ["creator_id", "classroom_id"],
      properties: {
        name: {
          type: "string",
          maxlength: 255,
        },
        type: {
          type: "string",
          enum: ["single", "group"],
        },
        creator_id: {
          type: "integer",
        },
        classroom_id: {
          type: "integer",
        },
      },
    };
  }

  static get relationMappings() {
    return {
      member: {
        relation: Model.ManyToManyRelation,
        modelClass: require("./User"),
        join: {
          from: "conversation.id",
          through: {
            from: "participant.conversation_id",
            to: "participant.user_id",
          },
          to: "user.id",
        },
      },
    };
  }
}

module.exports = Conversation;
