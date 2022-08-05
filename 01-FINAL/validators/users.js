"use strict";
const response = require("../exchange/response");

const create = (req, res, next) => {
    const log = req.context.logger.start("validators:users:create");
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        log.end();
        return response.failure(res, "body is required");
    }
    if (!req.body.email) {
        log.end();
        return response.failure(res, "email is required");
    }
    if (!req.body.phoneNo) {
        log.end();
        return response.failure(res, "phoneNo is required");
    }
    if (!req.body.password) {
        log.end();
        return response.failure(res, "password is required");
    }
    if (!req.body.username) {
        log.end();
        return response.failure(res, "username is required");
    }
    if (!req.body.deviceToken) {
        log.end();
        return response.failure(res, "deviceToken is required");
    }
    log.end();
    return next();
};

const socialLogin = (req, res, next) => {
    const log = req.context.logger.start("validators:users:socialLogin");
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        log.end();
        return response.failure(res, "body is required");
    }
    if (!req.body.socialLoginId) {
        log.end();
        return response.failure(res, "socialLoginId is required");
    }
    if (!req.body.platform) {
        log.end();
        return response.failure(res, "platform is required");
    }
    if (!req.body.firstName) {
        log.end();
        return response.failure(res, "firstName is required");
    }
    if (!req.body.lastName) {
        log.end();
        return response.failure(res, "lastName is required");
    }
    log.end();
    return next();
};

const login = (req, res, next) => {
    const log = req.context.logger.start("validators:users:login");
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        log.end();
        return response.failure(res, "body is required");
    }
    if (!req.body.username) {
        log.end();
        return response.failure(res, "username is required");
    }
    if (!req.body.password) {
        log.end();
        return response.failure(res, "password is required");
    }
    log.end();
    return next();
};

const resetPassword = (req, res, next) => {
    const log = req.context.logger.start("validators:users:resetPassword");

    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        log.end();
        return response.failure(res, "body is required");
    }
    if (!req.body.oldPassword) {
        log.end();
        return response.failure(res, "old Password is required");
    }
    if (!req.body.newPassword) {
        log.end();
        return response.failure(res, "new Password is required");
    }
    log.end();
    return next();
};

const follow = (req, res, next) => {
    const log = req.context.logger.start("validators:users:follow");

    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        log.end();
        return response.failure(res, "body is required");
    }
    if (!req.body.userId) {
        log.end();
        return response.failure(res, "userId is required");
    }
    if (!req.body.toFollowUserId) {
        log.end();
        return response.failure(res, "Follow id is required");
    }

    log.end();
    return next();
};

const unfollow = (req, res, next) => {
    const log = req.context.logger.start("validators:users:unfollow");
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        log.end();
        return response.failure(res, "body is required");
    }
    if (!req.body.userId) {
        log.end();
        return response.failure(res, "userId is required");
    }
    if (!req.body.toUnfollowUserId) {
        log.end();
        return response.failure(res, "UnFollow id is required");
    }
    log.end();
    return next();

};

exports.create = create;
exports.resetPassword = resetPassword;
exports.login = login;
exports.follow = follow;
exports.unfollow = unfollow;
exports.socialLogin = socialLogin;