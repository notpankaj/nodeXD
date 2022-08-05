"use strict";
const mongoose = require("mongoose");

const coinBalance = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    totalCoin: { type: Number, default: 0 },
    activeCoin: { type: Number, default: 0 },
    earnedCoins: [
        {
            _id: false,
            fromUser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
            gift: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "gift",
            },
            type: {
                type: String,
                default: "gifted",
                enum: ["call", "gifted"],
            },
            durations: { type: String, },
            coins: { type: Number, default: 0 },
            createdAt: { type: Date, default: Date.now() },
        }
    ],

    spendCoins: [
        {
            _id: false,
            onUser: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
            gift: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "gift",
            },
            type: {
                type: String,
                default: "",
                enum: ["", "call", "gifted"],
            },
            coins: { type: Number, default: 0 },
            createdAt: { type: Date, default: Date.now() },
        }
    ],

    purchasedCoins: [
        {
            _id: false,
            coinId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "coin",
                required: true,
            },
            coins: { type: Number, default: 0 },
            createdAt: { type: Date, default: Date.now() },
        }],

}, { timestamps: true });

mongoose.model("coinBalance", coinBalance);

module.exports = coinBalance;
