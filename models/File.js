const Model = require("objection").Model;
const knex = require("../databases/knex");

Model.knex(knex);

class File extends Model {
  static get tableName() {
    return "file";
  }
}

module.exports = File;
