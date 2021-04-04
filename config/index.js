exports.Regex = {
  CONTROLLER_REGEXP: /\w+\.controller\.js/,
  ROUTER_REGEXP: /\w+\.route\.js/,
  SERVICE_REGEXP: /\w+\.service\.js/,
};

exports.HTTPErrorMessage = {
  DEFAULT: "Something went wrong",
  WRONG_EMAIL_OR_PASSWORD: "WRONG_EMAIL_OR_PASSWORD",
  EMAIL_ALREADY_EXISTED: "EMAIL_ALREADY_EXISTED",
  REQUIRED_FIELDS_MISSING: "REQUIRED_FIELDS_MISSING",
};

exports.SocketIOEvent = {
  common: {
    JOIN_CHANNEL: "JOIN_CHANNEL",
  },
  message: {
    NEW_MESSAGE: "NEW_MESSAGE",
    NEW_GROUP_CONVERSATION: "NEW_GROUP_CONVERSATION",
  },
};

exports.SocketErrorMessage = {
  DEFAULT: "Something went wrong",
};

exports.COOKIE_SECRET = process.env.COOKIE_SECRET || "abcxyz";

exports.BCRYPT_SALT_ROUND = 2;

exports.PASSWORD_REGEX = /^[\w@$!%*#?&]{8,}$/;