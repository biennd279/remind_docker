const responseUtil = require("../utils/responseUtils");
const roleService = require("../services/role.service");

const getRoles = async (req, res, next) => {
  try {
    const query = req.query;
    const roles = await roleService.getRoles(query);
    return responseUtil.success(res, 200, roles);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  getRoles,
};
