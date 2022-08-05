"use strict";
const response = require("../exchange/response");

const sendCallNotification = (req, res, next) => {
    const log = req.context.logger.start("validators:notifications:sendCallNotification");
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        log.end();
        return response.failure(res, "body is required");
    }
    if (!req.body.username) {
        log.end();
        return response.failure(res, "username is required");
    }
    if (!req.body.receiverId) {
        log.end();
        return response.failure(res, "receiverId is required");
    }
    if (!req.body.channelName) {
        log.end();
        return response.failure(res, "channelName is required");
    }

    log.end();
    return next();
};


exports.sendCallNotification = sendCallNotification;
