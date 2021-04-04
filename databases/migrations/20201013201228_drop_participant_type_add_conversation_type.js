exports.up = function (knex) {
  return knex.schema
    .table("participant", function (t) {
      t.dropColumn("type");
    })
    .table("conversation", function (t) {
      t.enu("type", ["single", "group"]).after("name");
    });
};

exports.down = function (knex) {
  return knex.schema
    .table("conversation", function (t) {
      t.dropColumn("type");
    })
    .table("participant", function (t) {
      t.enu("type", ["private", "group"]);
    });
};
