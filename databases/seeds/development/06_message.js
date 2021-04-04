exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("message")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("message").insert([
        {
          sender_id: 1,
          conversation_id: 1,
          message: "One small step for man...",
          message_text: "One small step for man...",
        },
        {
          sender_id: 2,
          conversation_id: 1,
          message: "One giant leap for mankind.",
          message_text: "One giant leap for mankind.",
        },
        {
          sender_id: 2,
          conversation_id: 2,
          message: "Oi oi... =.=",
          message_text: "Oi oi... =.=",
        },
        {
          sender_id: 3,
          conversation_id: 3,
          message: "Chời ơi O^O",
          message_text: "Chời ơi O^O",
        },
      ]);
    });
};
