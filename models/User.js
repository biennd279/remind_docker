const Model = require("objection").Model;
const knex = require("../databases/knex");
const path = require("path");

Model.knex(knex);

class User extends Model {
  static get tableName() {
    return "user";
  }

  static modifiers = {
    excludePassword(builder) {
      return builder.select(
        "user.id",
        "user.name",
        "user.email",
        "user.role_id",
        "user.avatar_url"
      );
    },

    includeRole(builder) {
      return builder
        .select(
          "user.id",
          "user.name",
          "user.email",
          "user.password",
          "user.avatar_url",
          "role.name as role"
        )
        .innerJoin("role", "user.role_id", "role.id");
    },

    idAndName(builder) {
      return builder.select("id", "name", "avatar_url");
    },
  };

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "email", "password", "role_id"],
      properties: {
        name: { type: "string", maxlength: 200 },
        email: { type: "email", maxlength: 200 },
        password: { type: "string", maxlength: 100, minlength: 8 },
        role_id: { type: "number" },
      },
    };
  }

  static relationMappings = {
    classroom_owner: {
      relation: Model.ManyToManyRelation,
      modelClass: path.join(__dirname, "Classroom"),
      filter: query => query.select("id", "code", "name", "school").where("type", "Owner"),
      join: {
        from: "user.id",
        through: {
          from: "m_user_classroom.user_id",
          to: "m_user_classroom.classroom_id"
        },
        to: "classroom.id"
      }
    },
    classroom_joined: {
      relation: Model.ManyToManyRelation,
      modelClass: path.join(__dirname, "Classroom"),
      filter: query => query.select("id", "code", "name", "school").where("type", "Member"),
      join: {
        from: "user.id",
        through: {
          from: "m_user_classroom.user_id",
          to: "m_user_classroom.classroom_id"
        },
        to: "classroom.id"
      }
    }
  }
}

module.exports = User;
