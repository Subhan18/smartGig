const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: "string", require: true },
  email: { type: "string", unique: true, require: true },
  password: { type: "string", require: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
