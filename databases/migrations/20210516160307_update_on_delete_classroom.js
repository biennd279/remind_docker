
exports.up = function(knex) {
  return knex.schema
      .alterTable("m_user_classroom", function (t) {
        t.dropForeign("classroom_id");
        t.foreign("classroom_id").references("classroom.id").onDelete("CASCADE");
      })
      .alterTable("conversation", function (t) {
        t.dropForeign("classroom_id");
        t.foreign("classroom_id").references("classroom.id").onDelete("CASCADE");
      })
};

exports.down = function(knex) {
  return knex.schema
      .alterTable("m_user_classroom", function (t) {
        t.dropForeign("classroom_id");
        t.foreign("classroom_id").references("classroom.id");
      })
      .alterTable("conversation", function (t) {
        t.dropForeign("classroom_id");
        t.foreign("classroom_id").references("classroom.id");
      })
};
