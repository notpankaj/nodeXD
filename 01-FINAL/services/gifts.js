const ObjectId = require("mongodb").ObjectId
const stripe = require('stripe')('sk_test_51KfdqKSIbgCXqMm2fnVDKcAd1LV0rVXZ9QiRvd0bm5JQYIeQXbF26NgYQA7RqiuSF3hUotbvt4FNPlsuI6OQgrPz00bCL9VA9k');
const endpointSecret = 'whsec_qZYloeQTjG5bOmE1iE31H76UD6Ll7vQY';

const buildGift = async (model, context) => {
    const { title, coin, description } = model;
    const log = context.logger.start(`services:gifts:buildGift${model}`);
    const gift = await new db.gift({
        title: title,
        coin: coin,
        description: description,
    }).save();

    log.end();
    return gift;
};

const setGift = async (model, gift, context) => {
    const log = context.logger.start("services:gifts:setGift");
    if (model.coin !== "string" && model.coin !== undefined) {
        gift.coin = model.coin;
    }
    if (model.title !== "string" && model.title !== undefined) {
        gift.title = model.title;
    }
    if (model.description !== "string" && model.description !== undefined) {
        gift.description = model.description;
    }
    log.end();
    await gift.save();
    return gift;
};

const create = async (model, context) => {
    const log = context.logger.start("services:gifts:create");
    let gift = await db.gift.findOne({ title: model.title });
    if (gift) {
        throw new Error(`${model.title} already exits choose another!`);
    } else {
        gift = buildGift(model, context);
        log.end();
        return gift;
    }
};

const update = async (id, model, context) => {
    const log = context.logger.start(`services: gifts: update`);
    let entity = await db.gift.findById(id)
    if (!entity) {
        log.end();
        throw new Error("invalid gift");
    }
    console.log('model ==>>>>', id, model);
    const gift = await setGift(model, entity, context);
    console.log('updated data', gift);
    log.end();
    return gift
};

const send = async (model, context) => {
    const log = context.logger.start(`services: gifts: send`);
    let gift = await db.gift.findById(model.giftId)
    if (!gift) {
        throw new Error('provider gift not found')
    }
    // checking user have coin to gift to  user

    // sender coin history
    let coinBalance = await db.coinBalance.findOne({ user: model.senderId })

    // ==============manipulating  receiver coin==================
    if (coinBalance && coinBalance.activeCoin >= gift.coin) {
        // receiver coin history
        const coinBalance = await db.coinBalance.findOne({ user: model.receiverId })
        // if  user have coin update it 
        if (coinBalance) {
            let totalCoin = coinBalance.totalCoin
            let activeCoin = coinBalance.activeCoin
            totalCoin += gift.coin
            activeCoin += gift.coin
            coinBalance.totalCoin = totalCoin
            coinBalance.activeCoin = activeCoin
            coinBalance.earnedCoins.push({
                type: 'gifted',
                gift: gift._id,
                fromUser: model.senderId,
                coins: gift.coin
            })

            await coinBalance.save()

        }
        else {
            // if  user have  no coin then create it 
            const coin = await new db.coinBalance({
                user: model.receiverId,
                totalCoin: gift.coin,
                activeCoin: gift.coin,
                earnedCoins: [
                    {
                        type: 'gifted',
                        gift: gift._id,
                        fromUser: model.senderId,
                        coins: gift.coin
                    }],
            }).save()
        }
    } else {
        throw new Error("you don't have enough coin to send this gift")
    }

    let activeCoin = coinBalance.activeCoin
    activeCoin -= gift.coin
    coinBalance.activeCoin = activeCoin

    // ==============manipulating  sender coin==================
    coinBalance.spendCoins.push({
        onUser: model.receiverId,
        type: 'gifted',
        gift: gift._id,
        coins: gift.coin
    })
    await coinBalance.save()
    log.end();
    return 'gift sent successfully'
}

// const gift = await setGift(model, entity, context);

const getGifts = async (query, context) => {
    const log = context.logger.start(`services:gifts:getGifts`);
    let pageNo = Number(query.pageNo) || 1;
    let pageSize = Number(query.pageSize) || 10;
    let skipCount = pageSize * (pageNo - 1);
    // const userId = context.gift.id || context.gift._id
    const gifts = await db.gift.find().skip(skipCount).limit(pageSize)
    gifts.count = await db.gift.find().count();
    log.end()
    return gifts
};

const uploadIcon = async (id, files, context) => {
    const log = context.logger.start(`services:gifts:uploadIcon`);
    let fileName = files[0].filename.replace(/ /g, '')
    let file = files[0]
    if (!id) {
        throw new Error("gift id is required");
    }
    let gift = await db.gift.findById(id)
    if (!gift) {
        log.end();
        throw new Error("gift not found");
    }
    if (file == undefined || file.size == undefined || file.size <= 0) throw new Error("image is required");
    if (gift.icon != "") {
        const path = file.destination + '/' + gift.icon
        try {
            fs.unlinkSync(path);
            console.log(`image successfully removed from ${path}`);
        } catch (error) {
            console.error('there was an error to remove image:', error.message);
        }
    }
    // user.images.push({ name: fileName })
    gift.icon = fileName
    await gift.save()
    log.end();
    return 'icon uploaded successfully'

}

const myGifts = async (id, context) => {
    const log = context.logger.start(`services: gifts: myGifts`);
    if (!id) {
        throw new Error('user id is Required')
    }
    // let myGifts = await db.coinBalance.findOne({ user: id })
    let myGifts = await db.coinBalance.aggregate([

        {
            $match: {
                // and: [
                // {
                user: ObjectId(id)
                // },
                // {
                //     "earnedCoins": {
                //         "$elemMatch": {
                //             "$and": [
                //                 { "type": "gifted" },
                //             ]
                //         }
                //     },
                // },
                // ]
            }
        },
        {
            "$project": {
                // "earnedCoins": 1, "description": 1,
                "earnedCoins": {
                    "$filter": {
                        "input": "$earnedCoins",
                        "as": "earnedCoins",
                        "cond": {
                            "$and": [
                                { "$eq": ["$$earnedCoins.type", "gifted"] },
                            ]
                        }
                    }
                }
            }
        }

    ])


    // .populate(["earnedCoins.gift", "earnedCoins.fromUser"])
    // let myGifts = await db.coinBalance.findOne({ $and: [{ user: { $eq: id } }, { "earnedCoins.type": { $eq: "gifted" } }] }).populate("earnedCoins.gift").populate("earnedCoins.fromUser")
    // log.end();
    return myGifts
};

const buy = async (model, context) => {
    const log = context.logger.start(`services: gifts: buy`);

    if (!model.userId) {
        throw new Error('user id is Required')
    }

    if (!model.giftId) {
        throw new Error('giftId id is Required')
    }

    const user = await db.user.findById(model.userId)

    if (!user) {
        throw new Error('user not found')
    }

    const gift = await db.gift.findById(model.giftId)

    if (!gift) {
        throw new Error('this id not associate any gift')
    }

    let coinBalance = await db.coinBalance.findOne({ user: user.id })
    // if  user have coin update it 
    if (coinBalance != undefined && coinBalance != null && coinBalance.activeCoin >= gift.coin) {
        let activeCoin = coinBalance.activeCoin
        activeCoin -= gift.coin
        coin.activeCoin = activeCoin
        await coinBalance.save()
    }
    else {
        throw new Error("you don't have enough coin to this gift")
    }

    log.end();
    return coinBalance

};

const handlePaymentMethod = async (model, context) => {
    const log = context.logger.start(`services: gifts: handlePaymentMethod ${{ model }}`);
    let payment = await db.payment.findOne({ pi: model.id })
    if (model.status == 'succeeded') {
        let coin = await db.coinBalance.findOne({ user: payment.userId })
        let gift = await db.gift.findOne({ user: payment.giftId })
        // if  user have coin update it 
        if (coin != undefined && coin != null) {
            let totalCoin = coin.totalCoin
            let activeCoin = coin.activeCoin
            totalCoin += gift.coin
            activeCoin += gift.coin
            coin.totalCoin = totalCoin
            coin.activeCoin += activeCoin
            if (coin.purchasedCoins && coin.purchasedCoins.length > 0) {
                coin.purchasedCoins.push({
                    gift: gift.id,
                    coin: gift.coin,
                })
            }
            else {
                coin.purchasedCoins = [{
                    gift: gift.id,
                    coin: gift.coin,
                }]
            }
            await coin.save()

        }
        else {
            // if  user have  no coin then create it 
            coin = await new db.coinBalance({
                user: model.userId,
                totalCoin: gift.coin,
                activeCoin: gift.coin,
                purchasedCoins: [
                    {
                        gift: gift.id,
                        coin: gift.coin,
                    }],
            }).save()
        }
        payment.status = model.status
        payment.receiptNumber = model.receipt_number
        payment.receiptUrl = model.receipt_url
        await payment.save()
    } else {
        log.info('model.status', model.status)
        payment.status = model.status || ''
        await payment.save()
    }
    return
}
const credit = async (model, context) => {
    const log = context.logger.start(`services: gifts: credit ${model}`);
    const { type, data: { object } } = model;
    switch (type) {
        case 'payment_intent.succeeded':
            // console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
            handlePaymentMethod(object, context);
            break;
        case 'payment_intent.amount_capturable_updated':
            handlePaymentMethod(object, context);
            break;
        case 'payment_intent.canceled':
            handlePaymentMethod(object, context);
            break;
        case 'payment_intent.created':
            handlePaymentMethod(object, context);
            break;
        case 'payment_intent.payment_failed':
            handlePaymentMethod(object, context);
            break;
        case 'payment_intent.processing':
            handlePaymentMethod(object, context);
            break;
        case 'payment_intent.requires_action':
            handlePaymentMethod(object, context);
            break;
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${type}.`);
    }
    log.end();
    return object

};

exports.create = create;
exports.update = update;
exports.getGifts = getGifts;
exports.send = send;
exports.uploadIcon = uploadIcon;
exports.myGifts = myGifts;
exports.buy = buy;
exports.credit = credit;