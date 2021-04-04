exports.up = function (knex) {
  return knex.schema.createTable("classroom_file", function (t) {
    t.charset("utf8mb4");
    t.integer("file_id").unsigned();
    t.integer("classroom_id").unsigned();
    t.string("message", 2000);
    t.foreign("classroom_id").references("classroom.id");
    t.foreign("file_id").references("file.id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("classroom_files");
};
