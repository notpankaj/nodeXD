"use strict";
const mongoose = require("mongoose");
const history = mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    duration: {
        type: String,
        default: "0",
    },
    time: {
        type: String,
        default: ""
    },
}, { timestamps: true });

mongoose.model("history", history);
module.exports = history;
