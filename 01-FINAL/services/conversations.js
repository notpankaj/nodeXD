const message = require("../models/message")
const ObjectId = require('mongodb').ObjectID


const getOldChat = async (query, context) => {
    const log = context.logger.start('services:conversations:getOldChat')
    let pageNo = Number(query.pageNo) || 1
    let pageSize = Number(query.pageSize) || 10

    let skipCount = pageSize * (pageNo - 1)

    if (!query.conversationId) {
        throw new Error('conversationId is required')
    }

    const chat = await db.message.find({ conversation: ObjectId(query.conversationId) }).populate("gift").sort({ createdAt: -1 }).skip(skipCount).limit(pageSize)

    chat.count = await db.message.find({ conversation: ObjectId(query.conversationId) }).count()

    // let skipCount = parseInt(query.skip_messages);
    // let chat = await db.chats.find({ room: query.room_id }).sort('-createdOn').skip(skipCount).lean()
    //     .limit(5)

    log.end()
    return chat
}

const conversationList = async (id, context) => {
    const log = context.logger.start('services:conversations:conversationList')
    if (!id) {
        throw Error('id is required')
    }
    let conversation = await db.conversation.aggregate([
        {
            "$match": { $or: [{ "user1": ObjectId(id) }, { "user2": ObjectId(id) }] }
        },
        {
            "$lookup": {
                "from": 'messages',
                "localField": '_id',
                "foreignField": 'conversation',
                "as": 'messages'
            }
        },
        {
            "$unwind": {
                "path": "$messages",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$lookup":
            {
                "from": "users",
                'let': { 'receiverId': "$messages.receiver", 'senderId': "$messages.sender" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $or: [
                                            { $eq: ["$$receiverId", "$_id"] },
                                            { $eq: ["$$senderId", "$_id"] },
                                        ]
                                    },
                                    { $ne: [ObjectId(id), "$_id"] },
                                ]

                            }
                        }
                    },
                ],
                "as": "users"
            }
        },
        {
            "$unwind": {
                "path": "$users",
                // "preserveNullAndEmptyArrays": true
            }
        },
        {
            $group: {
                _id: { _id: "$users._id", },
                "user": { $first: '$users' },
                "conversationsId": { $first: '$_id' },

            }
        },

        { $sort: { "lastActive": -1, } },
        // { $limit: { "messages": 1, } },
        //getting last message from array list 
        // { $addFields: { lastElem: { $last: "$messages.content" } } },
        //mapping response

        {
            $project: {
                "_id": 0,
                "firstName": "$user.firstName",
                "userId": "$user._id",
                "image": "$user.avatar",
                "conversationId": "$conversationsId"
            }
        }
    ])

    const blockedUsers = await db.block.find({ $or: [{ byUser: id }, { toUser: id }] })
    for (let index = 0; index < conversation.length; index++) {
        const user = conversation[index]
        for (let i = 0; i < blockedUsers.length; i++) {
            const blockedUser = blockedUsers[i];
            console.log(blockedUser.toUser.toString() == user.userId.toString())
            if (blockedUser.toUser.toString() == user.userId.toString()) {
                conversation[index].isBlocked = true
            } else {
                console.log(blockedUser.byUser.toString() == user.userId.toString())
                if (blockedUser.byUser.toString() == user.userId.toString()) {
                    conversation[index].isBlocked = true
                }

            }
        }

    }

    // for (let index = 0; index < conversation.length; index++) {
    //     const isBlocked = await db.block.findOne({ byUser: conversation[index].userId, toUser: id })
    //     if (isBlocked) {
    //         conversation[index].isBlocked = true
    //     } else {
    //         conversation[index].isBlocked = false
    //     }
    // }
    console.log('conversation', conversation)

    log.end()
    return conversation
}

exports.getOldChat = getOldChat
exports.conversationList = conversationList