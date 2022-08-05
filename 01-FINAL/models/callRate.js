"use strict";
const mongoose = require("mongoose");

const callRate = mongoose.Schema({
    rate: { type: Number, default: 0 },
    status: {
        type: String,
        default: "inactive",
        enum: ["active", "inactive"],
    },

}, { timestamps: true });

mongoose.model("callRate", callRate);

module.exports = callRate;
