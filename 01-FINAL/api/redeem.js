"use strict";
const service = require("../services/redeem");
const response = require("../exchange/response");

const create = async (req, res) => {
    const log = req.context.logger.start(`api:users:create`);
    try {
        const user = await service.create(req.body, req.context);
        log.end();
        return response.data(res, user);
    } catch (err) {
        log.error(err);
        log.end();
        return response.payPalfailure(res, err.response.message || err.message, err.httpStatusCode || 400);
    }
};
const updateStatus = async (req, res) => {
    const log = req.context.logger.start(`api:redeem:updateStatus`);
    try {
        const user = await service.create(req.body, req.context);
        log.end();
        return response.data(res, user);
    } catch (err) {
        log.error(err);
        log.end();
        return response.payPalfailure(res, err.response.message || err.message, err.httpStatusCode || 400);
    }
};


exports.create = create;
exports.updateStatus = updateStatus;

