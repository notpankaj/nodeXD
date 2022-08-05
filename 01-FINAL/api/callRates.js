"use strict";
const service = require("../services/callRates");
const response = require("../exchange/response");
// const mapper = require("../mappers/callRate");

const add = async (req, res) => {
    const log = req.context.logger.start(`api:callRates:add`);
    try {
        const callRate = await service.create(req.body, req.context);
        const message = "CallRate added Successfully";
        log.end();
        return response.success(res, message, callRate);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};
const set = async (req, res) => {
    const log = req.context.logger.start(`api:callRates:add`);
    try {
        const callRate = await service.set(req.params.id, req.context);
        const message = "Call Rate Set Successfully";
        log.end();
        return response.success(res, message, callRate);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};

const getCallRates = async (req, res) => {
    const log = req.context.logger.start(`api:callRates:currentUser`);
    try {
        const callRates = await service.getCallRates(req.query, req.context);
        const message = "callRate  list fetched successfully";
        log.end();
        return response.page(res, callRates, Number(req.query.pageNo), Number(req.query.pageSize), callRates.count);
        // return response.success(res, message, callRate);
    } catch (err) {
        log.error(err);
        log.end();
        return response.failure(res, err.message);
    }
};



exports.add = add;
exports.getCallRates = getCallRates;
exports.set = set;
