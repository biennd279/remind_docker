exports.up = function (knex) {
  return knex.schema.table("participant", function (t) {
    t.foreign("user_id").references("user.id");
    t.foreign("conversation_id").references("conversation.id");
  });
};

exports.down = function (knex) {
  return knex.schema.table("participant", function (t) {
    t.dropForeign("user_id");
    t.dropForeign("conversation_id");
  });
};
