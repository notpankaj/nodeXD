"use strict";
const imageUrl = require('config').get('image').url

exports.toModel = (entity, context) => {

    const model = {
        toUser: entity.toUser.firstName,
        fromUser: entity.fromUser.firstName,
        toUserId: entity.toUser._id,
        fromUserId: entity.fromUser._id,
        toUserAvatar: entity.toUser.avatar ? `${imageUrl}${entity.toUser.avatar}` : "",
        fromUserAvatar: entity.fromUser.avatar ? `${imageUrl}${entity.fromUser.avatar}` : "",
        duration: entity.duration,
        time: entity.time,
        createdAt: entity.createdAt
    };

    if (entity.duration == 0) {
        model.callType = entity.fromUser.id == context.user.id ? 'outgoing' : 'missed'
    } else {
        model.callType = entity.fromUser.id == context.user.id ? 'outgoing' : 'incoming'
    }

    return model;

};


exports.toSearchModel = (entities, context) => {
    return entities.map(entity => {
        return exports.toModel(entity, context);
    });
};