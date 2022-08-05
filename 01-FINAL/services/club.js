
const ObjectId = require('mongodb').ObjectId
const join = async (model, context) => {
    const log = context.logger.start(`services:club:join`);
    const query = {
        name: model.clubName,
        members: { $elemMatch: { $eq: model.userId, } }
    }

    const members = await db.club.find(query)

    if (members && members.length > 0) {
        return members
        // throw new Error('user already clubed')
    }

    const query2 = {
        name: model.clubName,
        // members: {  $ne: model.userId, } }
        members: { $not: { $elemMatch: { $eq: model.userId } } }
    }

    const Update = {
        $addToSet: { members: model.userId }
    }

    const joined = await db.club.findOneAndUpdate(query2, Update)
    log.end();
    return joined
};


const leave = async (model, context) => {
    const log = context.logger.start(`services:club:leave`);
    const query = {
        name: model.clubName,
        members: { $elemMatch: { $eq: model.userId, } }
    }
    let leave
    const isMember = await db.user.find(query)
    if (isMember) {
        const Update = {
            $pull: { members: model.userId }
        }
        leave = await db.club.findOneAndUpdate(query, Update)
        // throw new Error('user already clubed')
    }

    log.end();
    return leave
};

const memberList = async (name, context) => {
    const log = context.logger.start(`services:club:memberList`);

    if (!name) {
        throw new Error('club name is required')
    }

    // const club = await db.club.find(query).populate('members')
    // const club = await db.club.aggregate([
    //     { $match: { name: name } },
    //     {
    //         $lookup: {
    //             from: "users",
    //             localField: "members",
    //             // pipeline: [
    //             //     { $match: { gender: context.user.gender == 'male' ? 'female' : 'male' } },],
    //             foreignField: "_id",
    //             as: "users"
    //         },
    //     },
    //     { $unwind: "$users" },
    //     {
    //         $project: {
    //             _id: 0,
    //             "_id": "$users._id",
    //             "firstName": "$users.firstName",
    //             "lastName": "$users.lastName",
    //             "avatar": "$users.avatar",
    //             "following": {
    //                 $filter: {
    //                     input: "$users.following",
    //                     as: "following",
    //                     cond: { $eq: ["$$following.userId", ObjectId(context.user.id)] }
    //                 }
    //                 // $cond: {
    //                 //     if: { $isArray: "$users.following" }, then: "$users.following", else: []
    //                 // }
    //             }

    //         }
    //     },
    //     {
    //         $unwind: {
    //             path: '$following',
    //             preserveNullAndEmptyArrays: true
    //         },
    //     },
    //     {
    //         $addFields: {
    //             "isFollowing":
    //             {
    //                 $cond: {
    //                     if: {
    //                         $eq: ["$following.userId", ObjectId(context.user.id)]
    //                     }, then: true, else: false
    //                     // $cond: {
    //                     //     if: {
    //                     //         "following": {
    //                     //             $filter: {
    //                     //                 input: "$following",
    //                     //                 as: "following",
    //                     //                 cond: { $eq: ["$$following.userId", ObjectId(context.user.id)] }
    //                     //             }
    //                     //         }
    //                     //     }, then: true, else: false
    //                     // }
    //                 }
    //             }
    //         }
    //     },
    //     // {
    //     //     $group: {
    //     //         _id: { _id: "$_id", isFollowing: '$isFollowing' },
    //     //         firstName: { $first: '$firstName' },
    //     //         lastName: { $first: '$lastName' },
    //     //         avtar: { $first: '$avtar' },
    //     //         isFollowing: { $last: '$isFollowing' }, //Todo handle true false
    //     //     }
    //     // }

    // ])
    log.end();
    return club
};

const membersByFilter = async (query, context) => {
    const log = context.logger.start(`services:club:membersByFilter`);
    if (!query.country) {
        throw new Error('country is required')
    }

    let filter = {}
    // ===============================================for you=================================================

    if (query.gender.trim() !== "" && query.gender == undefined) {
        filter = {
            $lookup: {
                from: "users",
                // localField: "members",
                pipeline: [
                    { $match: { gender: context.user.gender == 'male' ? 'female' : 'male', country: query.country } },],
                foreignField: "_id",
                as: "users"
            },
        }
    }

    // ================================================= nearBy ==================================================

    else if (query.lat & query.long) {
        filter = {
            "location": {
                $near: {
                    $geometry:
                        { type: "Point", coordinates: [query.lat, query.long] }, $maxDistance: 10000 // 10 kilometer
                }
            }
        }
    }

    // ========================================== popular ========================================================

    else if (query.popular) {
        filter = {
            $lookup: {
                from: "users",
                // localField: "members",
                pipeline: [
                    { $match: { gender: context.user.gender == 'male' ? 'female' : 'male', country: query.country } },],
                foreignField: "_id",
                as: "users"
            },
        },
            { $unwind: "$users" },
        {
            $project: {
                name: "$users.firstName",


                followers: { $cond: { if: { $isArray: "$users.followers" }, then: { $size: "$users.followers" }, else: 0 } }
            }
        },
            { $sort: { followers: -1 } }
    }

    else {
        throw new Error('At least one filter is required')
    }

    const club = await db.club.aggregate([filter])
    log.end()
    return club

};




exports.join = join;
exports.leave = leave;
exports.memberList = memberList;
exports.membersByFilter = membersByFilter;
