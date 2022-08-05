const ObjectId = require("mongodb").ObjectId
const paypal = require('paypal-rest-sdk');

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AdTnU32YHXZlDkwE46vUnKOAC9J2Dw-HtLaCh_TqI3-Laaf0zsLvQSMrLN1pJCLpKzja33Ko7ytwEyTD',
    'client_secret': 'ELn2xxtQpQkBglXX14jU1przoWo2g7ypmxb2ihT2AVm4ylY1vQR481aqlvzyfcAVX5X19fclDrQA9PXQ'
});

var sender_batch_id = Math.random().toString(36).substring(9);


const create = async (model, context) => {
    const log = context.logger.start("services:redeem:create");
    // const user = await user.findById(model.userId)
    // let coinBalance = await db.coinBalance.findOne({ user: user.id })
    var create_payout_json = {
        "sender_batch_header": {
            "sender_batch_id": sender_batch_id,
            "email_subject": "You have a payment"
        },
        "items": [
            {
                "recipient_type": "EMAIL",
                "amount": {
                    "value": model.amount,
                    "currency": "USD"
                },
                "receiver": model.email,
                "note": "Thank you.",
                "sender_item_id": "item_1"
            },

        ]
    };
    const result = await handleRedeem(create_payout_json)
    if (result) {
        // todo handle  response 
    }
    log.end()
    return result
};

const handleRedeem = (model) => {

    return new Promise((resolve, reject) => {
        paypal.payout.create(model, function (error, payout) {
            if (error) {
                reject(error)
                // console.log(error.response);
                // throw error;
            } else {
                resolve(payout);
                console.log("Create Payout Response");
                // console.log();
                // return payout
            }
        })

    })

}
const updateStatus = (model) => {
    const log = context.logger.start(`services:redeem:updateStatus${model}`);

    // const result = await handleRedeem(create_payout_json)
    // if(result){
    // todo handle  response 
    // }
    log.end()
    return model



}


exports.create = create;
exports.updateStatus = updateStatus;