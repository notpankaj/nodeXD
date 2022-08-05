"use strict";
const mongoose = require("mongoose");

const gift = mongoose.Schema({
    title: {
        type: String,
        default: "",
    },
    coin: {
        type: Number,
        default: 0,
    },
    icon: {
        type: String,
        default: ""
    },
    description: { type: String, default: "" }
}, { timestamps: true });

mongoose.model("gift", gift);
module.exports = gift;
