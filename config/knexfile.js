// Database connection configuration
const path = require("path");
require("dotenv").config({ path: "../.env" });

module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: process.env.DATABASE_HOST || "localhost",
      user: process.env.DATABASE_USERNAME || "remind_clone",
      password: process.env.DATABASE_PASSWORD || "Password1@",
      database: process.env.DATABASE_NAME || "remind_clone",
      charset: "utf8mb4",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, "../databases/migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "../databases/seeds/development"),
    },
  },
  staging: {},
  production: {
    client: "mysql",
    connection: {
      host: process.env.PROD_DATABASE_HOST || "localhost",
      user: process.env.PROD_DATABASE_USERNAME || "root",
      password: process.env.PROD_DATABASE_PASSWORD || "password",
      database: process.env.PROD_DATABASE_NAME || "remind_clone",
      charset: "utf8mb4",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, "../databases/migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "../databases/seeds/development"),
    },
  },
  test: {
    client: "mysql",
    connection: {
      host: process.env.DATABASE_HOST || "localhost",
      user: process.env.DATABASE_USERNAME || "root",
      password: process.env.DATABASE_PASSWORD || "password",
      database: process.env.DATABASE_NAME || "test_remind_clone",
      charset: "utf8mb4",
    },
    migrations: {
      directory: path.join(__dirname, "../databases/migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "../databases/seeds/development"),
    },
  },
};
