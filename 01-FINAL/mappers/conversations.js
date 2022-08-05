"use strict";
const imageUrl = require('config').get('image').url

exports.toModel = entity => {
    const model = {
        userId: entity.userId,
        name: entity.firstName,
        image: entity.image ? `${imageUrl}${entity.image}` : "",
        conversationId: entity.conversationId,
        isBlocked: entity.isBlocked ? entity.isBlocked : false

    };

    return model;
};


exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity);
    });
};