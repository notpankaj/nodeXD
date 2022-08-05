

const block = async (model, context) => {
    const log = context.logger.start(`services:users:block`);
    // const user = await db.user.findById(model.byUser)
    const isBlocked = await db.block.findOne({ toUser: model.toUser, byUser: model.byUser })

    if (isBlocked) {
        throw new Error('user already blocked')
    }

    const block = await new db.block({
        toUser: model.toUser,
        byUser: model.byUser,
    }).save();

    // let index = 0

    // if (model.to == 'following') {
    //     for (const item of user.following) {
    //         if (model.toUser == item.userId) {
    //             user.following[index].status = 'blocked'
    //             user.following[index].blockId = block.id
    //             index++
    //         }
    //     }
    // } else {
    //     for (const item of user.followers) {
    //         if (model.toUser == item.userId) {
    //             user.followers[index].status = 'blocked'
    //             user.followers[index].blockId = block.id
    //             index++
    //         }
    //     }
    // }

    // await user.save()
    log.end();
    return block

};

const unblock = async (model, context) => {
    const log = context.logger.start(`services:users:unblock`);
    // const user = await db.user.findById(model.byUser)
    const block = await db.block.findOne({ toUser: model.toUser, byUser: model.byUser })
    if (!block) {
        throw new Error('block user not found')
    }
    let blockUser = await db.block.deleteOne({ toUser: model.toUser, byUser: model.byUser });
    if (blockUser.deletedCount == 0) {
        throw new Error("something went wrong");
    }

    // let index = 0
    // if (model.to == 'following') {
    //     let index = 0
    //     for (const item of user.following) {

    //         if (model.toUser == item.userId) {
    //             user.following[index].status = 'un-block'
    //             user.following[index].blockId = ""
    //             index++
    //         }
    //         else {
    //             throw new Error('user not present in your following list please check ')
    //         }
    //     }
    // } else {
    //     for (const item of user.followers) {
    //         if (model.toUser == item.userId) {
    //             user.followers[index].status = 'un-block'
    //             user.followers[index].blockId = ""
    //             index++
    //         } else {
    //             throw new Error('user not present in your followers list please check ')
    //         }
    //     }
    // }

    // await user.save()
    log.end();
    return block

};

const blockList = async (id, context) => {
    const log = context.logger.start(`services:blocks:blockList`);
    if (!id) {
        throw new Error('user id is required')
    }
    const blockUsers = await db.block.find({ byUser: id }).populate('toUser')
    log.end();
    return blockUsers
};

exports.block = block;
exports.unblock = unblock;
exports.blockList = blockList;