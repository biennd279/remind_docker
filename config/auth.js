"use strict";
//TODO: Implement role-based authorization

const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const secretOrKey = process.env.PASSPORT_SECRET || "secretOrKey";
const { userService } = require("../services");

const options = {
  secretOrKey,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

const verify = async (payload, done) => {
  const userId = payload.id;
  if (!userId) {
    return done(null, false);
  }

  try {
    let user = await userService.getUserById(userId).modify("excludePassword");
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

passport.use(new JWTStrategy(options, verify));

exports.createToken = (payload) => {
  return jwt.sign(payload, secretOrKey, {
    expiresIn: 86400,
  });
};

exports.createUserToken = (user) => {
  return exports.createToken({
    id: user.id,
    role: user.role,
  });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, secretOrKey);
};

exports.jwtAuth = () => {
  return passport.authenticate("jwt", { session: false });
};

/**
 * Authenticate socket connection by checking for
 * jwt token during handshake.
 */
exports.socketAuth = (socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) return next(new Error("Authentication Error"));
  jwt.verify(token, secretOrKey, async (err, payload) => {
    if (err) {
      next(err);
    }
    let user = await userService
      .getUserById(payload.id)
      .modify("excludePassword");
    socket.user = user;
    next();
  });
};
