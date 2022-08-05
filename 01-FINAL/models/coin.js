"use strict";
const mongoose = require("mongoose");

const coin = mongoose.Schema({
    coins: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    isFree: { type: Boolean, default: false },
    category: { type: String, default: "" },
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive"],
    },

}, { timestamps: true });

mongoose.model("coin", coin);

module.exports = coin;
