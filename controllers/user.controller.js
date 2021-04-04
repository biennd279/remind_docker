const responseUtil = require("../utils/responseUtils");
const { userService } = require("../services");
const auth = require("../config/auth");
const { BCRYPT_SALT_ROUND, PASSWORD_REGEX } = require("../config");
const bcrypt = require("bcrypt");
const { UniqueViolationError, ValidationError } = require("objection");
const { HTTPErrorMessage } = require("../config");

exports.loginController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await userService.authenticate(email, password);
    let token = auth.createUserToken(user);
    return responseUtil.success(res, 200, { user, token });
  } catch (err) {
    next(err);
  }
};

exports.registerController = async (req, res, next) => {
  const { name, email, password, role_id } = req.body;

  let hashedPassword = bcrypt.hashSync(password, BCRYPT_SALT_ROUND);
  let newUser = {
    name,
    email,
    password: hashedPassword,
    role_id,
  };

  try {
    let user = await userService.createUser(newUser);
    delete user.password;
    return responseUtil.success(res, 201, user);
  } catch (err) {
    if (err instanceof UniqueViolationError) {
      err.status = 409;
      err.httpMessage = HTTPErrorMessage.EMAIL_ALREADY_EXISTED;
    } else if (err instanceof ValidationError) {
      err.status = 400;
      err.httpMessage = HTTPErrorMessage.REQUIRED_FIELDS_MISSING;
    }
    next(err);
  }
};

exports.conversationController = async (req, res, next) => {
  const { classroomId } = req.query;
  const currentUser = req.user;
  try {
    let conversations = await userService.getUserConversations(
      currentUser.id,
      classroomId
    );
    return responseUtil.success(res, 200, conversations);
  } catch (err) {
    next(err);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    let loggedInUser = req.user;
    let data = await loggedInUser.$query().modify("includeRole");
    delete data.password;
    return responseUtil.success(res, 200, data);
  } catch (err) {
    return next(err);
  }
};

/**
 * Validate and refresh user token
 * @route /user/validate
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Express.NextFunction} next 
 */
exports.validateToken = async (req, res, next) => {
  try {
    let loggedInUser = req.user;
    let user = await loggedInUser.$query().modify("includeRole");
    delete user.password;
    let token = auth.createUserToken(user);
    return responseUtil.success(res, 200, { user, token });
  } catch (err) {
    return next(err);
  }
};

/**
 * Update user password
 * @param {String} req.body.currentPass
 * @param {String} req.body.updatePass
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPass, updatePass } = req.body;
    let loggedInUser = req.user;

    if (!PASSWORD_REGEX.test(updatePass)) {
      return responseUtil.error(res, 400, "WEAK_PASSWORD");
    }

    let userPassword = (await loggedInUser.$query()).password;
    let passwordMatched = bcrypt.compareSync(currentPass, userPassword);
    if (!passwordMatched) {
      return responseUtil.error(res, 401, "WRONG_PASSWORD");
    }

    let hashedPassword = bcrypt.hashSync(updatePass, BCRYPT_SALT_ROUND);

    await loggedInUser.$query().patch({
      password: hashedPassword,
    });

    return responseUtil.success(res, 200);
  } catch (err) {
    return next(err);
  }
};
