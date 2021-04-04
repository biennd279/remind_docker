exports.up = function (knex) {
  return knex.schema
    .createTable("role", function (t) {
      t.increments("id").primary();
      t.string("name", 50).notNullable();
    })
    .createTable("user", function (t) {
      t.charset("utf8mb4");
      t.increments("id").primary();
      t.string("name", 200).notNullable();
      t.string("email", 200).notNullable().unique();
      t.string("password", 100).notNullable();
      t.integer("role_id").unsigned().notNullable();
      t.foreign("role_id").references("role.id");
      t.timestamps(true, true);
    })
    .createTable("classroom", function (t) {
      t.charset("utf8mb4");
      t.increments("id").primary();
      t.string("code", 6)
        .unique()
        .notNullable()
        .comment("Unique class code that students use to join classes");
      t.string("name", 100).notNullable();
      t.string("school", 100);
      t.timestamps(true, true);
    })
    .createTable("file", function (t) {
      t.increments("id").primary();
      t.string("name", 200).notNullable();
      t.string("url", 500).notNullable();
      t.string("type", 20);
      t.integer("size").unsigned();
      t.timestamps(true, true);
    })
    .createTable("conversation", function (t) {
      t.increments("id").primary();
      t.string("name");
      t.integer("creator_id").unsigned().notNullable();
      t.integer("classroom_id").unsigned().notNullable();
      t.timestamp("created_at").defaultTo(knex.fn.now());
      t.foreign("classroom_id").references("classroom.id");
      t.foreign("creator_id").references("user.id");
    })
    .createTable("participant", function (t) {
      t.integer("user_id").unsigned();
      t.integer("conversation_id").unsigned();
      t.enu("type", ["private", "group"]);
      t.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("message", function (t) {
      t.charset("utf8mb4");
      t.increments("id").primary();
      t.integer("sender_id").unsigned().notNullable();
      t.integer("conversation_id").unsigned().notNullable();
      t.string("message", 1000).comment("Formatted version of message content");
      t.string("message_text", 1000).comment(
        "Plain text version of message content, used for full-text searching"
      );
      t.integer("attachment_id").unsigned();
      t.integer("parent_message_id").unsigned();
      t.foreign("sender_id").references("user.id");
      t.foreign("conversation_id").references("conversation.id");
      t.foreign("parent_message_id").references("message.id");
      t.foreign("attachment_id").references("file.id");
      t.timestamps(true, true);
    })
    .raw("ALTER TABLE message ADD FULLTEXT(message_text)")
    .createTable("m_student_classroom", function (t) {
      t.integer("student_id").unsigned();
      t.integer("classroom_id").unsigned();
      t.date("joined_date");
      t.foreign("student_id").references("user.id");
      t.foreign("classroom_id").references("classroom.id");
      t.unique(["student_id", "classroom_id"]);
    })
    .createTable("class_owner", function (t) {
      t.integer("teacher_id").unsigned();
      t.integer("classroom_id").unsigned();
      t.foreign("teacher_id").references("user.id");
      t.foreign("classroom_id").references("classroom.id");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("m_student_classroom")
    .dropTableIfExists("class_owner")
    .dropTableIfExists("message")
    .dropTableIfExists("participant")
    .dropTableIfExists("conversation")
    .dropTableIfExists("file")
    .dropTableIfExists("user")
    .dropTableIfExists("role")
    .dropTableIfExists("classroom");
};

// select c.id, coalesce(c.name, group_concat(u.name separator ', ')) as conversation_name , p.`type` from participant p inner join conversation c on c.id = p.conversation_id inner join user u on u.id = p.user_id where p.conversation_id in (select p2.conversation_id from participant p2 where p2.user_id = 2) and user_id != 2 group by c.id;