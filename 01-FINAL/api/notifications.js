"use strict";
const service = require("../services/notifications");
const response = require("../exchange/response");


const sendCallNotification = async (req, res) => {
    const log = req.context.logger.start("api:notifications:sendCallNotification");
    try {
        const notification = await service.sendCallNotification(req.body, req.context);
        log.end();
        return response.data(res, notification);
        // return response.authorized(res, message, user, user.token);
    }
    catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }

};

const random = async (req, res) => {
    const log = req.context.logger.start("api:notifications:random");
    try {
        const notification = await service.random(req.body, req.context);
        log.end();
        return response.data(res, notification);
        // return response.authorized(res, message, user, user.token);
    }
    catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }

};


exports.sendCallNotification = sendCallNotification;
exports.random = random;


