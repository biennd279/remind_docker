exports.up = function (knex) {
  return knex.schema.table("user", function (t) {
    t.string("avatar_url", 1000)
      .defaultTo("https://www.gravatar.com/avatar?d=mp&s=200")
      .after("password");
  });
};

exports.down = function (knex) {
  return knex.schema.table("user", function (t) {
    t.dropColumn("avatar_url");
  });
};
