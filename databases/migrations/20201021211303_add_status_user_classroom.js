exports.up = function (knex) {
  return knex.schema.table("m_student_classroom", function (t) {
    t.enu("status", ["Pending", "Accepted", "Declined"]).defaultTo("Accepted");
  });
};

exports.down = function (knex) {
  return knex.schema.table("m_student_classroom", function (t) {
    t.dropColumn("status");
  });
};
