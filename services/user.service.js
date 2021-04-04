const User = require("../models/User");
const bcrypt = require("bcrypt");
const { HTTPErrorMessage } = require("../config");

exports.getUserById = (id) => {
  return User.query().findById(id);
};

exports.authenticate = (email, password) => {
  return User.query()
    .findOne({ email })
    .modify("includeRole")
    .then((user) => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        let authErr = new Error(HTTPErrorMessage.WRONG_EMAIL_OR_PASSWORD);
        authErr.status = 401;
        authErr.httpMessage = HTTPErrorMessage.WRONG_EMAIL_OR_PASSWORD;
        throw authErr;
      }
      delete user.password;
      return user;
    });
};

exports.createUser = (user) => {
  const newUser = User.fromJson(user);
  return User.query().insert(newUser);
};

/**
 * Returns ids of the conversation this user is in.
 * @param {Number} userId
 * @returns {Promise<Array>} conversationIds
 */
exports.getUserConversationIds = (userId) => {
  const knex = User.knex();
  return knex("participant")
    .select("conversation_id")
    .where("user_id", userId)
    .then((res) => res.map((item) => item["conversation_id"]));
};

exports.getUserConversations = (userId, classroomId) => {
  const knex = User.knex();
  const subquery = knex({ p2: "participant" })
    .select("p2.conversation_id")
    .where("p2.user_id", userId);

  let query = knex({ p: "participant" })
    .select(
      "c.id",
      knex.raw(
        "coalesce(c.name, group_concat(u.name separator ', ')) as conversation_name"
      ),
      "c.type",
      "c.classroom_id"
    )
    .innerJoin({ c: "conversation" }, "c.id", "p.conversation_id")
    .innerJoin({ u: "user" }, "u.id", "p.user_id")
    .whereIn("p.conversation_id", subquery)
    .whereNot("user_id", userId);

  if (classroomId) {
    query = query.where("c.classroom_id", classroomId);
  }
  query = query.groupBy("c.id");
  return query;
};

/**
 * 
 * @param {Number} user1Id 
 * @param {Number} user2Id 
 */
exports.getTwoUsersConvo = (user1Id, user2Id) => {

}