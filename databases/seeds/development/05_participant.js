exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("participant")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("participant").insert([
        {
          user_id: 1,
          conversation_id: 1,
        },
        {
          user_id: 2,
          conversation_id: 1,
        },
        {
          user_id: 1,
          conversation_id: 3,
        },
        {
          user_id: 2,
          conversation_id: 3,
        },
        {
          user_id: 3,
          conversation_id: 3,
        },
        {
          user_id: 2,
          conversation_id: 2,
        },
        {
          user_id: 3,
          conversation_id: 2,
        },
      ]);
    });
};
