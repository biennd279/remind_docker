/**
 * Import all routers which match <filename>.route.js in current directory
 * and bind them to a path named /<kebabcase-filename>/*
 */

const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const ROUTER_REGEXP = require("../config").Regex.ROUTER_REGEXP;
const debug = require("debug")("remind-clone:server");
const responseUtil = require("../utils/responseUtils");

try {
  let routeName;
  fs.readdirSync(__dirname).map((fileName) => {
    if (ROUTER_REGEXP.test(fileName)) {
      routeName = "/" + _.kebabCase(fileName.split(".")[0]);
      router.use(routeName, require(path.join(__dirname, fileName)));
    }
  });

  // TODO: Find a better way to format error object to client
  router.use((err, req, res, next) => {
    debug(err);
    return responseUtil.error(res, err.status, err.httpMessage);
  });
} catch (err) {
  console.error(err);
}

module.exports = router;
