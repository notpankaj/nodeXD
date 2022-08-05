
"use strict";
const auth = require("../permit/auth");
const socketEvents = require('../socket/socketEvents')

const configure = async (io, logger) => {
    const log = logger.start(`settings:socket:configure`);
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.query.token;
            const details = auth.extractToken(token, { logger });
            if (details.name === "TokenExpiredError") {
                throw new Error("token expired");
            }

            if (details.name === "JsonWebTokenError") {
                throw new Error("token is invalid");
            }
            const user = await db.user.findById(details._id)
            socket.userId = user.id;
            // await socketEvents.connect(io, logger)
            return next();
        } catch (err) {
            log.error(err)
            log.end()
            throw new Error(err.message)
        }
    });

};

exports.configure = configure;
