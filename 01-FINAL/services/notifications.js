"use strict";
const service = require("../services/users");
const admin = require("firebase-admin");
const utility = require("../utility/index")
const imageUrl = require('config').get('image').url

const pushNotification = async (deviceToken, title, type, message, conversationId, senderId, senderImage) => {
    console.log(`pushNotification==deviceToken====${deviceToken}====title===${title}=====type===${type}======message===${message}`)
    let payload = {
        data: {  //you can send only notification or only data(or include both)
            type: type,
            "channelName": "",
            "name": title,
            "imageUrl": imageUrl + senderImage,
            "conversationId": conversationId,
            "senderId": senderId,
        },
        notification: {
            title: title,
            body: message
        },
        token: deviceToken
    };

    // const options = {
    //     priority: "high",
    //     timeToLive: 60 * 60 * 24
    // };
    const res = await admin.messaging().send(payload)
    console.log(res)
    // admin.messaging().sendToDevice(deviceToken, payload, options).then(response => {
    //     console.log('message Successfully sent :', response);
    // }).catch(error => {
    //     console.log('Error sending message:', error);
    // });

}

const sendCallNotification = async (body, context) => {
    const log = context.logger.start(`services:callNotification`);
    let modal = {}
    modal.channelId = body.channelName
    modal.isPublisher = false
    if (body.receiverId == context.user.id) {
        throw new Error('you cannot call to  yourself')
    }
    let rtcRes = await service.generateRtcToken(modal, context)

    const user = await db.user.findById(body.receiverId)

    if (context.user.gender == "male") {
        const callerCoinHistory = await db.coinBalance.findOne({ user: context.user.id })

        if (!callerCoinHistory || callerCoinHistory.activeCoin < 59) {
            throw new Error("you dont have enough coin")
        }
    }
    if (!user) {
        throw new Error('called  user not found')
    }
    if (!user.callStatus == "active") {
        throw new Error('user is busy on another call')
    }
    if (!user.deviceToken) {
        throw new Error('called  user  device Token not found')
    }
    utility.verifyFCMToken(user.deviceToken)

    const history = await new db.history({
        toUser: body.receiverId,
        fromUser: context.user.id,
    }).save();

    const registrationToken = user.deviceToken;

    const message = {
        data: {  //you can send only notification or only data(or include both)
            type: "callReceive",
            callType: 'simple',
            "channelName": body.channelName.toString(),
            "name": body.username,
            "imageUrl": body.imageUrl,
            historyId: history.id,
            // callRate: callRate.rate,
            token: rtcRes.token,
            userId: rtcRes.userId.toString()

        },
        notification: {
            title: "call",
            body: body.username
        },
        token: registrationToken
    };

    const res = await admin.messaging().send(message)

    log.end()

    return history


}

const random = async (modal, context) => {

    const log = context.logger.start(`services:notifications:random`);
    if (!modal.channelId || modal.channelId == "") {
        throw new Error('channelId is required')
    }
    // let callRate = await db.callRate.findOne({ status: 'active' });

    let randomUser = await getRandomUser(context)
    // let randomUser = await db.user.aggregate([
    //     {
    //         $match: {
    //             $and: [
    //                 { gender: { $in: [context.user.gender == 'male' ? 'female' : 'male'] } },
    //                 { _id: { $ne: [context.user.id] } },
    //             ]
    //         }
    //     },
    //     { $sample: { size: 1 } }
    // ])
    if (randomUser.length == 0) {
        throw new Error('something went wrong')
    }
    let recUser = randomUser[0]
    // for (let index = 0; index < users.length; index++) {
    const isBlocked = await db.block.findOne({ byUser: context.user.id, toUser: recUser._id, })
    if (isBlocked) {
        getRandomUser(context)
    }
    let receiver = {}
    receiver.deviceToken = randomUser[0].deviceToken


    if (!receiver.deviceToken) {
        throw new Error('called  user  device Token not found')
    }

    const user = await db.user.findById(recUser.id)
    const callerCoinHistory = await db.coinBalance.findOne({ user: context.user.id })
    if (callerCoinHistory.activeCoin < 59) {
        throw new Error("you dont have enough coin")
    }
    if (!user) {
        throw new Error('called  user not found')
    }
    if (!user.callStatus == "active") {
        throw new Error('user is busy on another call')
    }
    if (!user.deviceToken) {
        throw new Error('called  user  device Token not found')
    }
    utility.verifyFCMToken(user.deviceToken)

    const history = await new db.history({
        toUser: body.recUser.id,
        fromUser: context.user.id,
    }).save();

    const registrationToken = receiver.deviceToken;
    utility.verifyFCMToken(receiver.deviceToken)
    receiver.channelId = modal.channelId
    receiver.isPublisher = false
    const receiverRtc = await service.generateRtcToken(receiver, context)
    const message = {
        data: {  //you can send only notification or only data(or include both)
            type: "callReceive",
            callType: 'random',
            "channelName": receiver.channelId.toString(),
            "name": context.user.username,
            // "imageUrl": caller.imageUrl,
            historyId: history.id,
            // callRate: callRate.rate,
            token: receiverRtc.token,
            userId: receiverRtc.userId.toString(),
            receiverId: recUser.id

        },
        notification: {
            title: "call",
            body: context.user.username
        },
        token: registrationToken
    };
    const res = await admin.messaging().send(message)
    log.end()
    return history
}

const getRandomUser = async () => {

    let randomUser = await db.user.aggregate([
        {
            $match: {
                $and: [
                    { gender: { $in: [context.user.gender == 'male' ? 'female' : 'male'] } },
                    { _id: { $ne: [context.user.id] } },
                ]
            }
        },
        { $sample: { size: 1 } }
    ])

    return randomUser
}

exports.pushNotification = pushNotification
exports.sendCallNotification = sendCallNotification
exports.random = random