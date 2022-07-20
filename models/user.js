const mongoose = require("mongoose");

const user = mongoose.Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true},
  email: { type: String, required: false, trim: true },
  token: { type: String, required: false, trim: true },
  gender: {
    type: String,
    required: true,
    trim: true,
    enum: {
      values: ["male", "female"],
      messages: `Please enter value "male" or "female"`,
    },
  },
  status: { type: String, default: "active", enum: ["active", "inactive"] },
});

const User = mongoose.model("user", user);
module.exports = User;


