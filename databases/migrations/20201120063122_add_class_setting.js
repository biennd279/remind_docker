
exports.up = function(knex) {
  return knex.schema
      .table("classroom", function(t) {
        t.boolean("require_approval").defaultTo(false);
        t.enu("participant_messaging", ["role-based", "on", "off"])
            .defaultTo("role-based");
        t.boolean("message_with_children").defaultTo(true);
      })
};

exports.down = function(knex) {
  return knex.schema
      .table("classroom", function(t) {
        t.dropColumns("require_approval", "participant_messaging", "message_with_children");
      })
};
