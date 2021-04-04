const Classroom = require("../models/Classroom");
const User = require("../models/User");

/**
 *
 * @param {User} user
 * @param query
 */
function getClassroomOwner(user, query) {
  return user
    .$relatedQuery("classroom_owner")
    .where(query)
    .modify("withoutSetting");
}

/**
 *
 * @param {User} user
 * @param query
 */
function getClassroomJoined(user, query) {
  return user.$relatedQuery("classroom_joined").where(query);
}

function getAllClassrooms(query) {
  return Classroom.query().where(query);
}

function getUserClassrooms(userId) {
  const knex = Classroom.knex();
  return knex({ c: "classroom" })
    .select("c.*", "msc.type")
    .innerJoin({ msc: "m_user_classroom" }, "c.id", "msc.classroom_id")
    .where("msc.user_id", userId);
}

/**
 *
 * @param {int} classroomId
 */
function getClassroom(classroomId) {
  return Classroom.query().findById(classroomId);
}

function getClassroomViaCode(classroomCode) {
  return Classroom.query().where("code", classroomCode).first();
}

/**
 *
 * @param {Classroom} classroom
 */
function getOwners(classroom) {
  return classroom.$relatedQuery("owner");
}

/**
 *
 * @param {Classroom}classroom
 */
function getStudents(classroom) {
  return classroom.$relatedQuery("students");
}

/**
 * Get ALL MEMBERS of a classroom, including pending and declined members.
 * @param {Classroom} classroom
 */
function getAllMembers(classroom) {
  return classroom.$relatedQuery("all_members");
}

/**
 *
 * @param {User|Model} user
 * @param {Classroom} classroom
 */
function joinClassroom(user, classroom) {
  return classroom.$relatedQuery("students").relate(user);
}

/**
 *
 * @param {User|Model} user
 * @param {Classroom} classroom
 */
function leaveClassroom(user, classroom) {
  return classroom.$relatedQuery("students").unrelate().where(user);
}

/**
 * Create new classroom
 * @param {Classroom} classroom
 */
async function createClassroom(classroom) {
  return Classroom.query().insertAndFetch(classroom);
}

/**
 *
 * @param {Classroom} classroom
 * @param {User} owner
 */
function addOwnerClassroom(classroom, owner) {
  return classroom.$relatedQuery("owner").relate({ ...owner, type: "Owner" });
}

/**
 *
 * @param {Classroom} classroom
 */
function deleteClassroom(classroom) {
  return classroom.$query().delete();
}

/**
 *
 * @param {Classroom} classroom
 * @param {{code: *, school: *, name: *}} newClassroom
 */
function updateClassroom(classroom, newClassroom) {
  return classroom.$query().patchAndFetch(newClassroom);
}

/**
 *
 * @param {Classroom} classroom
 * @param {Classroom|Model} newClassroom
 */
function patchClassroom(classroom, newClassroom) {
  return classroom.$query().patchAndFetch(newClassroom);
}

function updateClassroomAvatar(classroom, avatarUrl) {}

module.exports = {
  getAllClassrooms,
  getClassroom,
  getClassroomViaCode,
  createClassroom,
  addOwnerClassroom,
  deleteClassroom,
  updateClassroom,
  patchClassroom,
  getOwners,
  getStudents,
  joinClassroom,
  leaveClassroom,
  getClassroomOwner,
  getClassroomJoined,
  getAllMembers,
  getUserClassrooms,
};
