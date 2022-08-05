"use strict";
const imageUrl = require('config').get('image').url

exports.toModel = entity => {
    const model = {
        id: entity._id,
        title: entity.title,
        coin: entity.coin,
        description: entity.description,
        iconUrl: entity.icon ? `${imageUrl}${entity.icon}` : "",
    };
    return model;
};


exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity);
    });
};