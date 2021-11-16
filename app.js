const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require("./routes/user");
const jwt = require("jsonwebtoken");

require("dotenv").config();

mongoose.connect(`${process.env.MongodbServer}`, (err, then) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to mongoDB");
  }
});

app.use(bodyParser());

app.use("/", userRoutes);

app.listen("5000", () => console.log("listening at port 5000"));
