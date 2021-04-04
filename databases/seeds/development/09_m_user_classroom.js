function buildRows(knex) {
  let rows = [];
  let type;
  for (let i of [1, 2, 3]) {
    for (let j of [1, 2, 3]) {
      type = i === j ? "Owner" : "Member";
      rows.push({
        user_id: i,
        classroom_id: j,
        joined_date: knex.fn.now(),
        type,
      });
    }
  }
  return rows;
}

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("m_user_classroom")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("m_user_classroom").insert(buildRows(knex));
    });
};
