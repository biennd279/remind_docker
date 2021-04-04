/**
 * Import all modules inside 'services' directory that matches <filename>.service.js
 * and export them as <filename-camelcase>Service.
 */

const fs = require("fs");
const path = require("path");
const SERVICE_REGEXP = require("../config").Regex.SERVICE_REGEXP;
const _ = require("lodash");

let services = {};
try {
  let serviceName, camelCaseFileName;
  fs.readdirSync(__dirname).map((fileName) => {
    if (SERVICE_REGEXP.test(fileName)) {
      camelCaseFileName = _.camelCase(fileName.split(".")[0]);
      serviceName = camelCaseFileName.concat("Service");
      services[serviceName] = require(path.join(__dirname, fileName));
    }
  });
} catch (err) {
  console.error(err);
}

module.exports = services;
