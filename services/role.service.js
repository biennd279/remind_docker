const Role = require("../models/Role");

/**
 *
 * @param query
 */
function getRoles(query) {
  return Role.query().where(query);
}

module.exports = {
  getRoles,
};
