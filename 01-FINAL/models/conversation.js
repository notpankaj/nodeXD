"use strict";
const mongoose = require("mongoose");
const conversation = mongoose.Schema({
    user1: { type: mongoose.Schema.ObjectId, ref: 'user' },
    user2: { type: mongoose.Schema.ObjectId, ref: 'user' },
    members: [],
    lastActive: { type: Date, default: Date.now },
    createdOn: { type: Date, default: Date.now }
}, { timestamps: true });

mongoose.model("conversation", conversation);
module.exports = conversation;



