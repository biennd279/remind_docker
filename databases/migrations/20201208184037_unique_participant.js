exports.up = function (knex) {
  return knex.schema.alterTable("m_user_classroom", function (t) {
    t.unique(["user_id", "classroom_id"]);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("m_user_classroom", function (t) {
    t.dropUnique(["user_id", "classroom_id"]);
  });
};
