"use strict";
const response = require("../exchange/response");
const { isPositiveInteger } = require("../utility");

const create = (req, res, next) => {
    const log = req.context.logger.start("validators:coins:create");
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        log.end();
        return response.failure(res, "body is required");
    }
    if (!req.body.coins) {
        log.end();
        return response.failure(res, "coins is required");
    }
    if (!isPositiveInteger(req.body.coins)) {
        log.end();
        return response.failure(res, "coins data type is not valid");
    }
    if (!req.body.price) {
        log.end();
        return response.failure(res, "price is required");
    }
    if (!isPositiveInteger(req.body.price)) {

        console.log(isPositiveInteger(req.body.price))
        log.end();
        return response.failure(res, "price data type is not valid");
    }
    if (!req.body.status) {
        log.end();
        return response.failure(res, "status is required ");
    }
    log.end();
    return next();
};

exports.create = create;
