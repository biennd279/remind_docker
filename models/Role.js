const Model = require("objection").Model;
const knex = require("../databases/knex");
const path = require("path");

Model.knex(knex);

class Role extends Model {
  static get tableName() {
    return "role";
  }
}

module.exports = Role;
