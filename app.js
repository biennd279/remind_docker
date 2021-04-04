require("dotenv").config({ path: "./.env" });
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const api = require("./routers");
const helmet = require("helmet");
const app = express();
const COOKIE_SECRET = require("./config").COOKIE_SECRET;
const cors = require("cors");

app.use(helmet());
//TODO: REMOVE ALL-ORIGIN CORS POLICY BEFORE RELEASE
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", api);

module.exports = app;
