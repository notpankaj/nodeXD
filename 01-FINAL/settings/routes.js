"use strict";

const fs = require("fs");
const api = require("../api");
const specs = require("../specs");
const permit = require("../permit")
const validator = require("../validators");
const express = require('express');
const configure = (app, logger) => {
    const log = logger.start("settings:routes:configure");
    app.get("/specs", function (req, res) {
        fs.readFile("./public/specs.html", function (err, data) {
            if (err) {
                return res.json({
                    isSuccess: false,
                    error: err.toString()
                });
            }
            res.contentType("text/html");
            res.send(data);
        });
    });

    app.get("/api/specs", function (req, res) {
        res.contentType("application/json");
        res.send(specs.get());
    });

    //user api's routes //
    app.post("/api/users/create",
        permit.context.builder,
        validator.users.create,
        api.users.create
    );

    app.post(
        "/api/users/login",
        permit.context.builder,
        validator.users.login,
        api.users.login
    );

    app.post(
        "/api/users/socialLogin",
        permit.context.builder,
        validator.users.socialLogin,
        api.users.socialLogin
    );

    app.put(
        "/api/users/resetPassword/:id",
        permit.context.validateToken,
        validator.users.resetPassword,
        api.users.resetPassword
    );

    app.put(
        "/api/users/update/:id",
        permit.context.validateToken,
        api.users.update
    );
    app.put(
        "/api/users/removePicOrVideo/:id",
        permit.context.validateToken,
        api.users.removePicOrVideo
    );

    app.get(
        "/api/users/profile/:id",
        permit.context.validateToken,
        api.users.profile
    );

    app.put(
        "/api/users/profileImageUpload/:id",
        permit.context.builder,
        api.users.uploadProfileImage
    );

    app.put(
        "/api/users/removeProfilePic/:id",
        permit.context.validateToken,
        api.users.removeProfilePic
    );

    app.put(
        "/api/users/uploadStory/:id",
        permit.context.validateToken,
        api.users.uploadStory
    );

    // app.put(
    //     "/api/users/removeStory/:id",
    //     permit.context.builder,
    //     api.users.removeStory
    // );

    app.post("/api/users/follow",
        permit.context.validateToken,
        validator.users.follow,
        api.users.follow
    );

    app.post("/api/users/unfollow",
        permit.context.validateToken,
        validator.users.unfollow,
        api.users.unfollow
    );

    app.get("/api/users/following/:id",
        permit.context.validateToken,
        api.users.following
    );

    app.get("/api/users/followers/:id",
        permit.context.validateToken,
        api.users.followers
    );

    app.get("/api/users/random",
        permit.context.builder,
        api.users.random
    );
    app.delete("/api/users/deleteAccount/:id",
        permit.context.validateToken,
        api.users.remove
    );

    app.get("/api/users/getUsers",
        permit.context.validateToken,
        api.users.getUsers
    );

    app.get("/api/users/countries",
        permit.context.builder,
        api.users.getCountries
    );

    app.post("/api/users/generateRtcToken",
        permit.context.validateToken,
        permit.context.nocache,
        api.users.getRtcToken
    );

    app.post("/api/users/logout",
        permit.context.validateToken,
        api.users.logout
    );
    app.get("/api/users/usersByFilter",
        permit.context.validateToken,
        api.users.usersByFilter
    );

    app.post("/api/blocks/block",
        permit.context.validateToken,
        validator.blocks.block,
        api.blocks.block
    );

    app.post("/api/blocks/unblock",
        permit.context.validateToken,
        validator.blocks.block,
        api.blocks.unblock
    );

    app.get("/api/blocks/list/:id",
        permit.context.validateToken,
        api.blocks.blockList
    );

    app.post("/api/history/make",
        permit.context.validateToken,
        validator.history.create,
        api.history.create
    );

    app.get("/api/history/getByUserId/:id",
        permit.context.validateToken,
        api.history.getByUserId
    );

    app.put(
        "/api/history/update/:id",
        permit.context.validateToken,
        api.history.update
    );

    app.post("/api/club/join",
        permit.context.validateToken,
        validator.club.joinOrLeave,
        api.club.join
    );

    app.post("/api/club/leave",
        permit.context.validateToken,
        validator.club.joinOrLeave,
        api.club.leave
    );

    app.get("/api/club/membersByClubName/:name",
        permit.context.validateToken,
        api.club.getMembersByClubName
    );

    // app.get("/api/club/membersByFilter",
    //     permit.context.validateToken,
    //     api.club.getMembersByFilter
    // );

    app.get('/api/conversations/getOldConversations',
        permit.context.builder,
        api.conversations.getOldChat
    );

    app.get('/api/conversations/conversationList/:id',
        permit.context.builder,
        api.conversations.getConversationList
    );

    app.post("/api/notifications/sendCallNotification",
        permit.context.validateToken,
        validator.notifications.sendCallNotification,
        api.notifications.sendCallNotification
    );

    app.post("/api/notifications/random",
        permit.context.validateToken,
        api.notifications.random
    );

    app.post("/api/gifts/add",
        permit.context.builder,
        api.gifts.add
    );

    app.post("/api/gifts/send",
        permit.context.validateToken,
        api.gifts.send
    );

    app.post("/api/gifts/buy",
        permit.context.validateToken,
        api.gifts.buy
    );
    app.post("/api/gifts/credit",
        express.raw({ type: '*/*' }),
        permit.context.builder,
        api.gifts.credit
    );

    app.get("/api/gifts/list",
        permit.context.validateToken,
        api.gifts.getGifts
    );
    app.put('/api/gifts/update/:id',
        permit.context.validateToken,
        api.gifts.update
    );
    app.get('/api/gifts/myGifts/:id',
        permit.context.validateToken,
        api.gifts.myGifts
    );
    app.put('/api/gifts/uploadIcon/:id',
        permit.context.validateToken,
        api.gifts.uploadIcon
    );
    app.post("/api/coins/add",
        permit.context.builder,
        validator.coins.create,
        api.coins.add
    );
    app.post("/api/coins/buy",
        permit.context.validateToken,
        api.coins.buy
    );

    app.get("/api/coins/list",
        permit.context.validateToken,
        api.coins.getCoinList
    );
    app.get('/api/coins/myCoins/:id',
        permit.context.validateToken,
        api.coins.myCoins
    );

    app.post('/api/coins/deduct',
        permit.context.validateToken,
        api.coins.deduct
    );


    app.post("/api/coins/checkPaymentStatus",
        express.raw({ type: '*/*' }),
        permit.context.builder,
        api.coins.checkPaymentStatus
    );

    app.post("/api/redeem/create",
        permit.context.builder,
        api.redeem.create
    );

    app.post("/api/redeem/updateStatus",
        permit.context.builder,
        api.redeem.updateStatus
    );

    app.post("/api/callRates/add",
        permit.context.validateToken,
        api.callRates.add
    );
    app.get("/api/callRates/list",
        permit.context.validateToken,
        api.callRates.getCallRates
    );

    app.put(
        "/api/callRates/set/:id",
        permit.context.validateToken,
        api.callRates.set
    );
    log.end();
};

exports.configure = configure;