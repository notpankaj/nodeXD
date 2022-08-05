"use strict";
const mongoose = require("mongoose");
const block = mongoose.Schema({
    byUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
    },

    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
    },
},
    { timestamps: true }
);

mongoose.model("block", block);
module.exports = block;
