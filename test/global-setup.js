const knex = require("../databases/knex");

module.exports = async () => {
  await knex.raw("select 1+1").catch((err) => {
    console.error("Database `test_remind_clone` not found.");
    process.exit(1);
  });
  await knex.migrate.latest();
  return knex.seed.run();
};
