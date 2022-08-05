
const { deduct } = require('../services/coin')
const create = async (model, context) => {
    const log = context.logger.start(`services:history:create`);
    const history = await new db.history({
        toUser: model.toUser,
        fromUser: model.fromUser,
        type: model.type,
        callType: model.callType,
        coin: model.coin,
        time: model.dateTime,
        duration: model.duration,
    }).save();
    log.end();
    return history
};

const getHistoryByUserId = async (id, context) => {
    const log = context.logger.start(`services:history:getHistoryByUserId`);
    if (!id) {
        throw new Error('user id is required')
    }
    const history = await db.history.find({ $or: [{ fromUser: id }, { toUser: id }] }).populate(["fromUser", "toUser"]).sort({ "$natural": -1 })
    log.end();
    return history
};

const update = async (id, data, context) => {
    const log = context.logger.start(`services:history:update`);
    if (!id) {
        throw new Error('history id is required')
    }

    const history = await db.history.findById(id)

    if (history) {
        if (history.toUser) {
            const user = await db.user.findById(history.toUser)
            user.callStatus == "inactive"
            await user.save()
        }
        if (data.duration > 0) {
            await deduct({ from: history.fromUser, to: history.toUser, callTime: parseInt(data.duration) || 0 }, context)
        }
        if (history.fromUser) {
            const user = await db.user.findById(history.fromUser)
            user.callStatus == "inactive"
            await user.save()
        }

        if (data.time !== "string" && data.time !== undefined) {
            history.time = data.time;
        }
        if (data.duration !== "string" && data.duration !== undefined) {
            history.duration = data.duration;
        }
        await history.save();
        log.end();
        return history
    };
}

exports.create = create;
exports.getHistoryByUserId = getHistoryByUserId;
exports.update = update;