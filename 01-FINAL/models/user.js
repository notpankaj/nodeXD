

"use strict";
const mongoose = require("mongoose");
const user = mongoose.Schema({
  username: { type: String, required: false, trim: true, lowercase: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: false, trim: true },
  phoneNo: { type: String, required: false, trim: true },
  dob: { type: Date, required: false, trim: true },
  socialLoginId: { type: String, required: false, },
  gender: {
    type: String,
    required: true,
    enum: {
      values: ["male", "female"],
      messages: "Please enter value Male or female",
    },
  },
  password: { type: String, required: false },
  country: { type: String, required: false },
  socialLinkId: { type: String, required: false, default: "" },
  platform: { type: String, required: false, default: "" },
  otp: { type: Number, required: false, trim: true, default: "" },
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive"],
  },
  avatar: { type: String, default: "" },
  images: [{
    name: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now() }
  }],
  story: { type: String, default: "" },
  videos: [{
    name: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now() }
  }],
  bio: { type: String, default: "" },
  website: { type: String, default: "" },
  isAdmin: { type: String, default: false },
  callStatus: {
    type: String, default: "active",
    enum: ["active", "inactive"],
  },
  following: [{
    _id: false,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },

  },
  ],

  followers: [{
    _id: false,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
  },],

  location: {
    type: {
      type: String,
    },
    coordinates: [Number],
  },
  deviceToken: { type: String, default: "" }
}, { timestamps: true });

user.index({ location: "2dsphere" });
mongoose.model("user", user);
module.exports = user;
