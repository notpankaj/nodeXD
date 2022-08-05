"use strict";
const imageUrl = require('config').get('image').url
const videoUrl = require('config').get('video').url

exports.toModel = entity => {

    if (entity.userId) {
        entity = entity.userId
    }

    if (entity.toUser) {
        entity = entity.toUser
    }

    const model = {
        id: entity._id,
        username: entity.username,
        firstName: entity.firstName,
        lastName: entity.lastName,
        email: entity.email,
        dob: entity.dob,
        password: entity.password,
        gender: entity.gender,
        avatar: entity.avatar ? `${imageUrl}${entity.avatar}` : "",
        story: entity.story ? `${videoUrl}${entity.story}` : "",
        phoneNo: entity.phoneNo,
        location: entity.location,
        status: entity.status,
        isAmFollowing: entity.isFollowing ? entity.isFollowing : false,
        isMyFollower: entity.isFollower ? entity.isFollower : false,
        followingCount: entity.following ? entity.following.length || 0 : 0,
        followerCount: entity.followers ? entity.followers.length || 0 : 0,
        bio: entity.bio,
        website: entity.website,
        country: entity.country,
        token: entity.token,
        isBlocked: entity.isBlocked ? entity.isBlocked : false
    };
    // if (entity.isBlocked == true || entity.isBlocked == false) {
    //     model.isBlocked = entity.isBlocked
    // }

    if (entity.images && entity.images.length > 0) {
        for (let index = 0; index < entity.images.length; index++) {
            entity.images[index].name = `${imageUrl}${entity.images[index].name}`;
        }
        model.images = entity.images
    }

    if (entity.videos && entity.videos.length > 0) {
        for (let index = 0; index < entity.videos.length; index++) {
            entity.videos[index].name = `${videoUrl}${entity.videos[index].name}`;
        }
        model.videos = entity.videos
    }


    return model;

};


exports.toSearchModel = entities => {
    return entities.map(entity => {
        return exports.toModel(entity);
    });
};