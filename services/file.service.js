const File = require("../models/File");

/**
 *
 * @param {File} file
 * @param {Number} classroomId
 * @param {String} message
 */
exports.addFile = async (file, classroomId, message) => {
  let newFile = File.fromJson(file);
  const knex = File.knex();

  let res = await File.query().insert(newFile);
  const { id: newFileId } = res;
  return knex("classroom_file")
    .insert({
      file_id: newFileId,
      classroom_id: classroomId,
      message,
    })
    .then(() => {
      res.classroom_id = classroomId;
      res.message = message;
      return res;
    });
};

exports.insertFile = (file) => {
  const newFile = File.fromJson(file);
  return File.query().insert(newFile);
};

exports.getClassroomFiles = (classroomId) => {
  const knex = File.knex();
  return knex({ c: "classroom" })
    .select("f.*", "cf.message", "cf.classroom_id")
    .innerJoin({ cf: "classroom_file" }, "c.id", "cf.classroom_id")
    .innerJoin({ f: "file" }, "cf.file_id", "f.id")
    .where("c.id", classroomId);
};
