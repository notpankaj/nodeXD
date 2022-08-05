"use strict";
const mongoose = require("mongoose");

const redeem = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    amount: {
        type: String,
        default: "",
    },
    senderBatchId: {
        type: String,
        default: "",
    },
    diamond: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        default: "",
    },
    receiptUrl: {
        type: String,
        default: "",
    },
    payoutId: {
        type: String,
        default: ''
    }

}, { timestamps: true });

mongoose.model("redeem", redeem);
module.exports = redeem;
