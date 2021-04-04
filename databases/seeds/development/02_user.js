const bcrypt = require("bcrypt");
const config = require("../../../config");

exports.seed = function (knex) {
  const userPass = bcrypt.hashSync("password", config.BCRYPT_SALT_ROUND);
  // Deletes ALL existing entries
  return knex("user")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user").insert([
        {
          name: "Koro",
          email: "koross@gmail.com",
          password: userPass,
          role_id: 1,
        },
        {
          name: "Nagisa Shiota",
          email: "nagisa@gmail.com",
          password: userPass,
          role_id: 3,
        },
        {
          name: "Hiromi Shiota",
          email: "hiromi@gmail.com",
          password: userPass,
          role_id: 2,
        },
      ]);
    });
};
