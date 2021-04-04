exports.seed = function (knex) {
  return knex("classroom")
    .del()
    .then(function () {
      return knex("classroom").insert([
        {
          code: "AFU28E",
          name: "Web Development",
          school: "University of Engineering and Technology",
        },
        {
          code: "ABCDEF",
          name: "Tán gái đại cương",
          school: "UET",
        },
        {
          code: "STUP1D",
          name: "オタクカルチャー",
          school: "東京大学",
        },
      ]);
    });
};
