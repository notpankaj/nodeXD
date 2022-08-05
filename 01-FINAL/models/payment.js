"use strict";
const mongoose = require("mongoose");

const payment = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    coin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "coin",
    },
    pi: { type: String, default: "", },
    amount: {
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
    receiptNumber: {
        type: String,
        default: "",
    },
    customerId: {
        type: String,
        default: "",
    },
}, { timestamps: true });

mongoose.model("payment", payment);
module.exports = payment;
