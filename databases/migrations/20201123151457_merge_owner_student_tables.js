exports.up = function (knex) {
  return knex.schema
    .dropTableIfExists("class_owner")
    .dropTableIfExists("m_student_classroom")
    .createTable("m_user_classroom", function (t) {
      t.integer("user_id").unsigned();
      t.integer("classroom_id").unsigned();
      t.date("joined_date");
      t.enu("type", [
        "Owner",
        "Member",
        "PendingMember",
        "DeclinedMember",
      ]).defaultTo("Member");
      t.foreign("user_id").references("user.id");
      t.foreign("classroom_id").references("classroom.id");
    });
};

exports.down = function (knex) {
  return knex.schema
    .createTable("m_student_classroom", function (t) {
      t.integer("student_id").unsigned();
      t.integer("classroom_id").unsigned();
      t.date("joined_date");
      t.enu("status", ["Pending", "Accepted", "Declined"]).defaultTo(
        "Accepted"
      );
      t.foreign("student_id").references("user.id");
      t.foreign("classroom_id").references("classroom.id");
      t.unique(["student_id", "classroom_id"]);
    })
    .createTable("class_owner", function (t) {
      t.integer("teacher_id").unsigned();
      t.integer("classroom_id").unsigned();
      t.foreign("teacher_id").references("user.id");
      t.foreign("classroom_id").references("classroom.id");
    })
    .dropTableIfExists("m_user_classroom");
};
