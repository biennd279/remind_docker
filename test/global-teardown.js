const knex = require("../databases/knex");

module.exports = () => {
  return knex.migrate.rollback({}, true);
};
