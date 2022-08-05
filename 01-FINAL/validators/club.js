const joinOrLeave = (req, res, next) => {
    const log = req.context.logger.start("validators:club:joinOrLeave");

    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        log.end();
        return response.failure(res, "body is required");
    }
    if (!req.body.userId) {
        log.end();
        return response.failure(res, "userId is required");
    }
    if (!req.body.clubName) {
        log.end();
        return response.failure(res, "club Name  is required");
    }

    log.end();
    return next();
};

exports.joinOrLeave = joinOrLeave