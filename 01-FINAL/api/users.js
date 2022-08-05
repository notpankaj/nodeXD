"use strict";
const service = require("../services/users");
const response = require("../exchange/response");
const mapper = require("../mappers/user");

//register api
const create = async (req, res) => {
    const log = req.context.logger.start(`api:users:create`);
    try {
        const user = await service.create(req.body, req.context);
        const message = "User Register Successfully";
        log.end();
        return response.success(res, message, user);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

//login api
const login = async (req, res) => {
    const log = req.context.logger.start("api:users:login");
    try {
        const user = await service.login(req.body, req.context);
        log.end();
        let message = "login successfully"
        return response.authorized(res, message, mapper.toModel(user), user.token);
        // return response.authorized(res, message, user, user.token);
    }
    catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

// profile user
const profile = async (req, res) => {
    const log = req.context.logger.start(`api:users:currentUser`);
    try {
        const user = await service.profile(req.params.id, req.context);
        const message = "user Profile";
        log.end();
        return response.success(res, message, mapper.toModel(user));
        // return response.success(res, message, user);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

// reset password
const resetPassword = async (req, res) => {
    const log = req.context.logger.start("api:users:resetPassword");
    try {
        const message = await service.resetPassword(req.params.id, req.body, req.context);
        log.end();
        return response.success(res, message);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

//update user
const update = async (req, res) => {
    const log = req.context.logger.start(`api:users:update`);
    try {
        const user = await service.update(req.params.id, req.body, req.context);
        log.end();
        return response.data(res, mapper.toModel(user));
        // return response.data(res, user);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};


const uploadProfileImage = async (req, res) => {
    const log = req.context.logger.start(`api:users:uploadProfileImage`);
    try {
        const image = await service.uploadProfilePic(req.params.id, req.files, req.context);
        log.end();
        return response.data(res, image);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const uploadStory = async (req, res) => {
    const log = req.context.logger.start(`api:users:uploadStory`);
    try {
        const story = await service.uploadStory(req.params.id, req.files, req.context);
        log.end();
        return response.data(res, story);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const getUsers = async (req, res) => {
    const log = req.context.logger.start(`api:users:currentUser`);
    try {
        const user = await service.getUsers(req.query, req.context);
        const message = "user  list fetched successfully";
        log.end();
        return response.page(res, user, Number(req.query.pageNo), Number(req.query.pageSize), user.count);
        // return response.success(res, message, user);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

//follow api
const follow = async (req, res) => {
    const log = req.context.logger.start(`api:users:follow`);
    try {
        const resMsg = await service.follow(req.body, req.context);
        log.end();
        return response.success(res, resMsg, '');
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

//unFollow api
const unfollow = async (req, res) => {
    const log = req.context.logger.start(`api:users:unfollow`);
    try {
        const resMsg = await service.unfollow(req.body, req.context);
        log.end();
        return response.success(res, resMsg, '');
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

//following api                 
const following = async (req, res) => {
    const log = req.context.logger.start(`api:users:following`);
    try {
        const users = await service.following(req.params.id, req.context);
        const msg = 'list fetched successfully'
        log.end();
        return response.success(res, msg, mapper.toSearchModel(users));
        // return response.page(res, mapper.toSearchModel(users), Number(req.query.pageNo) || 1, Number(req.query.pageSize) || 10, users.count);
        // return response.success(res, msg, users);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

//followers api
const followers = async (req, res) => {
    const log = req.context.logger.start(`api:users:followers`);
    try {
        const users = await service.followers(req.params.id, req.context);
        const msg = 'list fetched successfully'
        log.end();
        return response.success(res, msg, mapper.toSearchModel(users));
        // return response.page(res, mapper.toSearchModel(users), Number(req.query.pageNo) || 1, Number(req.query.pageSize) || 10, users.count);
        // return response.success(res, msg, users);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const socialLogin = async (req, res) => {
    const log = req.context.logger.start(`api:users:socialLogin`);
    try {
        const user = await service.socialLogin(req.body, req.context);
        let message = "login successfully"
        log.end();
        return response.authorized(res, message, mapper.toModel(user), user.token);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const random = async (req, res) => {
    const log = req.context.logger.start(`api:users:random:${req.query}`);
    try {
        const users = await service.random(req.query, req.context);
        log.end();
        return response.page(res, mapper.toSearchModel(users), Number(req.query.pageNo) || 1, Number(req.query.pageSize) || 10, users.count);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }

};

const myStatistics = async (req, res) => {

    const log = req.context.logger.start(`api:users:myStatistics:${req.params.id}`);
    try {
        const myStatistics = await service.myStatistics(req.params.id, req.context);
        log.end();
        return response.data(res, myStatistics);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }

};

const removeProfilePic = async (req, res) => {
    const log = req.context.logger.start(`api:users:removeProfilePic`);
    try {
        const product = await service.removeProfilePic(req.params.id, req.context);
        log.end();
        return response.data(res, product);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};
const removePicOrVideo = async (req, res) => {
    const log = req.context.logger.start(`api:users:removePicOrVideo`);
    try {
        const product = await service.removePicOrVideo(req.params.id, req.body, req.context);
        log.end();
        return response.data(res, product);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const getRtcToken = async (req, resp) => {
    const log = req.context.logger.start(`api:users:getRtcToken`);
    resp.header('Acess-Control-Allow-Origin', '*');
    try {
        const token = await service.generateRtcToken(req.body, req.context);
        log.end();
        return response.data(resp, token);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(resp, err.message);
    }
};

const getCountries = async (req, res) => {
    const log = req.context.logger.start(`api:users:getCountries`);
    try {
        const token = await service.getCountries(req.body, req.context);
        log.end();
        return response.data(res, token);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const logout = async (req, res) => {
    const log = req.context.logger.start(`api:users:logout`);
    try {
        const message = await service.logout(req.context);
        log.end();
        return response.data(res, message);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const usersByFilter = async (req, res) => {
    const log = req.context.logger.start(`api:users:random:${req.query}`);
    try {
        const users = await service.usersByFilter(req.query, req.context);
        log.end();
        return response.page(res, mapper.toSearchModel(users), Number(req.query.pageNo) || 1, Number(req.query.pageSize) || 10, users.length);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }

};

const remove = async (req, res) => {
    const log = req.context.logger.start(`api:users:remove:${req.params.id}`);
    try {
        const user = await service.remove(req.params.id, req.context);
        log.end();
        return response.data(res, user);
        // return response.page(res, mapper.toSearchModel(users), Number(req.query.pageNo) || 1, Number(req.query.pageSize) || 10, users.length);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }

};

exports.create = create;
exports.login = login;
exports.resetPassword = resetPassword;
exports.update = update;
exports.profile = profile;
exports.uploadProfileImage = uploadProfileImage;
exports.uploadStory = uploadStory;
exports.getUsers = getUsers;
exports.getCountries = getCountries;
exports.follow = follow;
exports.unfollow = unfollow;
exports.following = following;
exports.followers = followers;
exports.socialLogin = socialLogin;
exports.random = random;
exports.myStatistics = myStatistics;
exports.removeProfilePic = removeProfilePic;
exports.getRtcToken = getRtcToken;
exports.logout = logout;
exports.usersByFilter = usersByFilter;
exports.remove = remove;
exports.removePicOrVideo = removePicOrVideo;

