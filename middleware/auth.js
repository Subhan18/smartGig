require("dotenv").config();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("../models/user");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "unauthorized" });
  }
  const token = authorization.replace("Bearer ", "");
  await jwt.verify(token, `${process.env.JWT_SECRET}`, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "forbiden" });
    }
    const { _id } = payload;
    User.find({ _id }).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
};
