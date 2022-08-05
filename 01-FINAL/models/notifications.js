"use strict";
const mongoose = require("mongoose");
const notifications = mongoose.Schema({
    type: { type: String },
    from: { type: mongoose.Schema.ObjectId, ref: 'user' },
    to: { type: mongoose.Schema.ObjectId, ref: 'user' },
    status: {
        type: String,
        default: "un-seen",
        enum: ["un-seen", "seen"],
    },
},
    { timestamps: true }
);

mongoose.model("notifications", notifications);
module.exports = notifications;



