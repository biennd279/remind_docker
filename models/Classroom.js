const {Model} = require("objection");
const knex = require("../databases/knex");
const User = require("./User");
const _ = require("lodash");

Model.knex(knex);

class Classroom extends Model {
  static get tableName() {
    return "classroom";
  }

  static get virtualAttributes() {
    return ["setting"];
  }

  setting() {
    return {
      require_approval: this.require_approval,
      participant_messaging: this.participant_messaging,
      message_with_children: this.message_with_children,
    };
  }

  static modifiers = {
    withoutSetting(builder) {
      return builder.select(
        "classroom.id",
        "classroom.code",
        "classroom.name",
        "classroom.school"
      );
    },

    setting(builder) {
      return builder.select("classroom.id", "classroom.setting");
    },
  };

  $formatJson(json) {
    let _json = super.$formatJson(json);
    return _.pick(_json, ["id", "code", "name", "school", "setting"]);
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["code", "name", "school"],
      properties: {
        code: { type: "string", maxlength: 6 },
        name: { type: "string", maxlength: 200 },
        school: { type: "string", maxlength: 200 },
        setting: {
          type: "object",
          properties: {
            require_approval: { type: "boolean" },
            participant_messaging: {
              type: "string",
              enum: ["on", "off", "role-based"],
            },
            message_with_children: { type: "boolean" },
          },
        },
      },
    };
  }

  static relationMappings = {
    owner: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      filter: (query) =>
        query.select("id", "name", "email").where("type", "Owner"),
      join: {
        from: "classroom.id",
        through: {
          from: "m_user_classroom.classroom_id",
          to: "m_user_classroom.user_id",
          extra: {
            type: "type",
          },
        },
        to: "user.id",
      },
    },
    students: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      filter: (query) =>
        query.select("id", "name", "email").where("type", "Member"),
      join: {
        from: "classroom.id",
        through: {
          from: "m_user_classroom.classroom_id",
          to: "m_user_classroom.user_id",
        },
        to: "user.id",
      },
    },
    all_members: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      filter: (query) =>
        query.select(
          "id",
          "name",
          "email",
          "type",
          "avatar_url",
          "joined_date"
        ),
      join: {
        from: "classroom.id",
        through: {
          from: "m_user_classroom.classroom_id",
          to: "m_user_classroom.user_id",
        },
        to: "user.id",
      },
    },
  };
}

module.exports = Classroom;