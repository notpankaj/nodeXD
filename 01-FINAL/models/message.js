"use strict";
const mongoose = require("mongoose");
const message = mongoose.Schema({
    sender: { type: mongoose.Schema.ObjectId, ref: 'user' },
    receiver: { type: mongoose.Schema.ObjectId, ref: 'user' },
    content: { type: String, default: "" },
    read: { type: Boolean, default: false },
    gift: { type: mongoose.Schema.ObjectId, ref: 'gift' },
    conversation: { type: mongoose.Schema.ObjectId, ref: 'conversation' },
    attachment: { type: String, default: "" },
}, { timestamps: true });
mongoose.model("message", message);
module.exports = message;



