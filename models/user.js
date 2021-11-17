const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: "string", require: true },
  email: { type: "string", unique: true, require: true },
  password: { type: "string", require: true },
  image: {
    data: Buffer,
    contentType: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
