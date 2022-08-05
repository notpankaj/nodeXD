"use strict";
const imageUrl = require('config').get('image').url

exports.toModel = entity => {

    const model = {
        _id: entity._id,
        msgFrom: entity.sender,
        msg: entity.content,

        date: entity.createdAt
    };
    if (entity.gift) {
        model.gift = {
            title: entity.gift.title,
            icon: entity.gift.icon ? `${imageUrl}${entity.gift.icon}` : "",
            coin: entity.gift.coin,
            id: entity.gift._id
        }
    }
    return model;

};


exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity);
    });
};