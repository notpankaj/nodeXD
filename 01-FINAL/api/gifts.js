"use strict";
const service = require("../services/gifts");
const response = require("../exchange/response");
const mapper = require("../mappers/gift");

const add = async (req, res) => {
    const log = req.context.logger.start(`api:gifts:add`);
    try {
        const gift = await service.create(req.body, req.context);
        const message = "Gift added Successfully";
        log.end();
        return response.success(res, message, gift);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const update = async (req, res) => {
    const log = req.context.logger.start(`api:gifts:update`);
    try {
        const gift = await service.update(req.params.id, req.body, req.context);
        log.end();
        return response.data(res, mapper.toModel(gift));
        // return response.data(res, gift);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const myGifts = async (req, res) => {
    const log = req.context.logger.start(`api:gifts:myGift`);
    try {
        const myGifts = await service.myGifts(req.params.id, req.context);
        log.end();
        return response.data(res, myGifts);
        // return response.data(res, gift);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const send = async (req, res) => {
    const log = req.context.logger.start(`api:gifts:send`);
    try {
        const gift = await service.send(req.body, req.context);
        log.end();
        return response.data(res, mapper.toModel(gift));
        // return response.data(res, gift);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const getGifts = async (req, res) => {
    const log = req.context.logger.start(`api:gifts:currentUser`);
    try {
        const gifts = await service.getGifts(req.query, req.context);
        const message = "gift  list fetched successfully";
        log.end();
        return response.page(res, mapper.toSearchModel(gifts), Number(req.query.pageNo), Number(req.query.pageSize), gifts.count);
        // return response.success(res, message, gift);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};


const uploadIcon = async (req, res) => {
    const log = req.context.logger.start(`api:gifts:uploadIcon`);
    try {
        const image = await service.uploadIcon(req.params.id, req.files, req.context);
        log.end();
        return response.data(res, image);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const buy = async (req, res) => {
    const log = req.context.logger.start(`api:gifts:buy`);
    try {
        const buy = await service.buy(req.body, req.context);
        log.end();
        return response.data(res, buy);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const credit = async (req, res) => {
    const log = req.context.logger.start(`api:gifts:credit`);
    try {
        const buy = await service.credit(req.body, req.context);
        log.end();
        return response.data(res, buy);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};



exports.add = add;
exports.update = update;
exports.getGifts = getGifts;
exports.send = send;
exports.uploadIcon = uploadIcon;
exports.myGifts = myGifts;
exports.buy = buy;
exports.credit = credit;
