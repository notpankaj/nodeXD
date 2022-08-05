var socketio = require('socket.io');
var events = require('events');
var moment = require('moment');
var _ = require('lodash');
var eventEmitter = new events.EventEmitter();
const service = require('../services/notifications')
const { deduct } = require('../services/coin')
const serviceU = require("../services/users");

const connect = async (io, logger) => {
    // const sockets = async (http, logger) => {
    const log = logger.start(`sockets:socketEvents:connect`);
    // io = socketio.listen(http);
    var ioChat = io
    var userStack = {};
    var oldChats, sendUserStack;
    var userSocket = {};

    ioChat.on('connection', async (socket) => {
        log.info("socketio chat connected.");
        let userId = socket.userId
        if (socket.userId == undefined || socket.userId == "") {
            socket.emit('oops', {
                event: 'token is not valid',
                data: 'token is not valid'
            });
        }
        //function to get user name
        // socket.emit('set-user-data', (userId) => {
        // })
        // socket.on('set-user-data', (userId) => {
        //     if (!userId) {
        //         log.info('userId is required', userId)
        //         // socket.emit('oops', {
        //         //     status:"NOK",
        //         //     event: 'set-user-data',
        //         //     data: 'set-user-data is required'
        //         // });
        //         socket.emit('oops', {
        //             // status:"NOK",
        //             event: 'set-user-data',
        //             data: 'set-user-data is required'
        //         });
        //     } else {
        // socket.on('connect_failed', function () {
        //     console.log("Sorry, there seems to be an issue with the connection!");
        // })

        // socket.on("connect_error", (err) => {
        //     console.log(err.message); // prints the message associated with the error
        // });
        // }); /
        log.info(userId + "  logged In");
        //storing variable.
        // socket.userId = userId;
        userSocket[socket.userId] = socket.id;
        log.info("userSocket", userSocket)
        //getting all users list
        eventEmitter.emit('get-all-users');
        // sending all users list. and setting if online or offline.
        sendUserStack = function () {
            for (i in userSocket) {
                for (j in userStack) {
                    if (j == i) {
                        userStack[j] = "Online";
                    }
                }
            }
            //for popping connection message.
            ioChat.emit('onlineStack', userStack);
        } //end of sendUserStack function.
        // }
        // }); //end of set-user-data event.

        //setting room.
        socket.on('set-room', async function (room) {

            //leaving room. 
            socket.leave(socket.room);
            try {
                //getting room data.
                // eventEmitter.emit('get-room-data', room);
                let conversation = await getRoomAndSetRoom(room)
                //setting room and join.
                if (conversation) {
                    socket.room = conversation.id;
                    log.info("roomId : " + socket.room);
                    socket.join(socket.room);
                    ioChat.to(userSocket[socket.userId]).emit('set-room', socket.room);
                }
            } catch (e) {
                log.info('set-room Err', e.message)
                socket.emit('oops',
                    {
                        event: 'set-room',
                        data: e.message
                    });
            }


        }); //end of set-room event.
        socket.on('callUser', async (data) => {
            let modal = {}
            modal.channelId = data.channelName
            modal.isPublisher = false
            data.receiverId
            data.callerId
            if (data.receiverId == data.callerId) {
                socket.emit('oops', {
                    event: 'callUser',
                    data: 'you cannot call to  yourself'
                });
                // throw new Error('you cannot call to  yourself')
            }
            let rtcRes = await serviceU.generateRtcToken(modal, { logger })

            const user = await db.user.findById(data.receiverId)
            const caller = await db.user.findById(data.callerId)

            if (caller.gender == "male") {
                const callerCoinHistory = await db.coinBalance.findOne({ user: caller.id })

                if (!callerCoinHistory || callerCoinHistory.activeCoin < 59) {
                    socket.emit('oops', {
                        event: 'callUser',
                        data: 'you dont have enough coin'
                    });
                    // throw new Error("you dont have enough coin")
                }
            }
            if (!user) {
                socket.emit('oops', {
                    event: 'callUser',
                    data: 'called  user not found'
                });
                // throw new Error('called  user not found')
            }
            if (!user.callStatus == "active") {
                socket.emit('oops', {
                    event: 'callUser',
                    data: 'user is busy on another call'
                });
                // throw new Error('user is busy on another call')
            }

            const history = await new db.history({
                toUser: data.receiverId,
                fromUser: caller.id,
            }).save();


            const message = {
                data: {  //you can send only notification or only data(or include both)
                    type: "callReceive",
                    callType: 'simple',
                    "channelName": data.channelName.toString(),
                    "name": data.username,
                    "imageUrl": data.imageUrl,
                    historyId: history.id,
                    // callRate: callRate.rate,
                    token: rtcRes.token,
                    userId: rtcRes.userId.toString()

                },
            };
            ioChat.to(userSocket[data.receiverId]).emit('receiveCall', message)
        })

        socket.on('acceptCall', (data) => {
            ioChat.to(userSocket[data.Id]).emit('acceptCall', data)
        })

        socket.on('close', (data) => {
            ioChat.to(userSocket[data.to]).emit('close')
        })

        socket.on('rejected', (data) => {
            ioChat.to(userSocket[data.to]).emit('rejected')
        })
        //showing msg on typing.
        socket.on('typing', function () {
            socket.to(socket.room).broadcast.emit('typing', " typing...");
        });


        socket.on('chat-msg', async function (data) {
            log.info('chat-msg called', { data })
            try {
                if (data.gift) {
                    await saveChat({
                        msgFrom: socket.userId,
                        msg: data.msg,
                        giftId: data.gift.id,
                        msgTo: data.msgTo,
                        room: socket.room,
                        date: data.date
                    })
                } else {
                    await saveChat({
                        msgFrom: socket.userId,
                        msg: data.msg,
                        msgTo: data.msgTo,
                        room: socket.room,
                        date: data.date
                    })
                }

                const user = await db.user.findById(data.msgTo)
                const sender = await db.user.findById(socket.userId)

                if (user && user.deviceToken != "" && user.deviceToken != undefined) {
                    let response
                    if (data.gift) {
                        response = service.pushNotification(user.deviceToken, sender.firstName, "gift", data.gift, socket.room, sender.id, sender.image)

                    } else {
                        response = service.pushNotification(user.deviceToken, sender.firstName, "messaging", data.msg, socket.room, sender.id, sender.image)
                    }
                    log.info('pushNotification', { response })
                }

                let msgDate = moment.utc(data.date).format()
                ioChat.to(socket.room).emit('chat-msg', {
                    msgFrom: socket.userId,
                    msg: data.msg,
                    gift: data.gift,
                    date: msgDate
                });
            } catch (e) {
                log.info('chat-msg Err', e.message)
                socket.emit('oops',
                    {
                        event: 'chat-msg',
                        data: e.message
                    });
                return;
            }


        });


        socket.on('set-channel', async function (cannelName) {
            log.info('join-cannel', { cannelName })
            socket.leave(socket.room);
            if (!cannelName || cannelName == "" || cannelName == undefined) {
                socket.emit('oops',
                    {
                        event: 'set-channel',
                        data: "cannelName is required"
                    });
            } else {
                //leaving room. 
                // socket.leave(socket.room);
                socket.room = cannelName;
                log.info("socket.room", socket.room)
                socket.join(socket.room);
                ioChat.to(userSocket[socket.userId]).emit('set-room', socket.room);
            }

        }); //end of set-cannel event.

        socket.on('call-end', async function (data) {
            // let count = 0
            // let updateHistoryRes
            log.info('call-end called', { data })
            // if (data.receiverId == "" || data.receiverId == undefined) {
            //     count++
            //     socket.emit('oops',
            //         {
            //             event: 'call-end',
            //             data: "receiverId is required"
            //         });
            // }

            // if (data.callerId == "" || data.callerId == undefined) {
            //     count++
            //     socket.emit('oops',
            //         {
            //             event: 'call-end',
            //             data: "callerId is required"
            //         });
            // }
            // if (data.historyId == "" || data.historyId == undefined) {
            //     count++
            //     socket.emit('oops',
            //         {
            //             event: 'call-end',
            //             data: "historyId is required"
            //         });
            // }

            // if (data.time == "" || data.time == undefined) {
            //     count++
            //     socket.emit('oops',
            //         {
            //             event: 'call-end',
            //             data: "dateTime is required"
            //         });
            // }

            // if (data.duration == "" || data.duration == undefined) {
            //     count++
            //     socket.emit('oops',
            //         {
            //             event: 'call-end',
            //             data: "duration is required"
            //         });
            // }



            // if (count === 0) {
            //     const history = await db.history.findById(data.historyId)
            //     log.info('history', history)
            //     if (history) {
            //         const user = await db.user.findById(history.toUser)
            //         user.callStatus == "inactive"
            //         log.info("===call duration===", data.duration)
            //         await user.save()
            //         if (data.duration > 0) {
            //             deduct({ from: history.fromUser, to: history.toUser, callTime: parseInt(data.duration) || 0 }, { logger })
            //         }
            //         updateHistoryRes = await updateHistory(history, data, log)
            //         if (history.fromUser) {

            //             const user = await db.user.findById(history.fromUser)
            //             user.callStatus == "inactive"
            //             await user.save()
            //         }
            //     } else {
            //         socket.emit('oops',
            //             {
            //                 event: 'call-end',
            //                 data: "history not found"
            //             });

            //     }
            //     // socket.leave(socket.room);
            // }

            ioChat.to(socket.room).emit('call-end',);

        });

        socket.on('call-start', async function (data) {
            //     let count = 0
            //     let history
            //     log.info('call-start called', { data })
            //     if (data.receiverId == "" || data.receiverId == undefined) {
            //         count++
            //         socket.emit('oops',
            //             {
            //                 event: 'call-start',
            //                 data: "receiverId is required"
            //             });
            //     }

            //     if (data.callerId == "" || data.callerId == undefined) {
            //         count++
            //         socket.emit('oops',
            //             {
            //                 event: 'call-start',
            //                 data: "callerId is required"
            //             });
            //     }
            //     if (count === 0) {
            //         const user = await db.user.findById(data.receiverId)
            //         log.info('user ==== receiverId', user.firstName)
            //         if (user.callStatus == 'active') {
            //             socket.emit('oops',
            //                 {
            //                     event: 'call-start',
            //                     data: "user is busy"
            //                 });
            //         } else {
            //             user.callStatus == "active"
            //             await user.save()
            //             if (data.callerId) {
            //                 const user = await db.user.findById(data.callerId)
            //                 log.info('user ==== callerId', user.firstName)
            //                 user.callStatus == "active"
            //                 await user.save()
            //                 try {
            //                     history = await createHistory(data, log)
            //                 } catch (error) {
            //                     socket.emit('oops',
            //                         {
            //                             event: 'call-start',
            //                             data: error.message
            //                         });
            //                 }
            //             }
            //             // socket.leave(socket.room);
            //         }
            //     }
            ioChat.to(socket.room).emit('call-start',);

        })

        socket.on('call-decline', async function (data) {
            log.info("call-decline")
            log.info("socket.room", socket.room)
            ioChat.to(socket.room).emit('call-decline', {});
            socket.leave(socket.room);
        })





        //for popping disconnection message.
        socket.on('disconnect', function () {
            log.info(socket.userId + "  logged out");
            socket.broadcast.emit('broadcast', { description: socket.userId + ' Logged out' });
            log.info("chat disconnected.");
            _.unset(userSocket, socket.userId);
            // userStack[socket.userId] = "Offline";
            // ioChat.emit('onlineStack', userStack);
        }); //end of disconnect event.
    }); //end of io.on(connection).
    //end of socket.io code for chat feature.

    //database operations are kept outside of socket.io code.

    createHistory = async (data, log) => {
        console.log('createHistory', log)
        log.info('createHistory')
        //for receiver
        const history = await new db.history({
            toUser: data.receiverId,
            fromUser: data.callerId,
            // time: data.time,
            // duration: data.duration,
        }).save();
        return history
    }

    updateHistory = async (history, data, log) => {
        console.log('updateHistory', log)
        log.info('updateHistory')

        if (data.time !== "string" && data.time !== undefined) {
            history.time = data.time;
        }
        if (data.duration !== "string" && data.duration !== undefined) {
            history.duration = data.duration;
        }
        await history.save();
        return history;

    }

    getRoomAndSetRoom = async (room) => {
        log.info("getRoomAndSetRoom:", room)
        var today = Date.now();
        if (room && room.conversationFrom == "" && room.conversationTo == "") {
            log.info("set-room parameter is required");
            throw new Error('set-room parameter is required')
        }
        if (room.conversationFrom == room.conversationTo) {
            log.info("set-room parameter is required");
            throw new Error('set-room parameter not be same ')
        }

        let conversation = await db.conversation.findOne({ $or: [{ user1: room.conversationFrom, user2: room.conversationTo }, { user1: room.conversationTo, user2: room.conversationFrom }] })
        if (!conversation) {
            const conversation = await new db.conversation({
                user1: room.conversationFrom,
                user2: room.conversationTo,
                lastActive: today,
                createdOn: today
            }).save()
            log.info("conversation saved ");
            return conversation
            // setRoom(conversation._id)
        } else {
            conversation.lastActive = today
            await conversation.save()
            return conversation
            // setRoom(conversation._id)
        }


    }


    saveChat = async (data) => {
        log.info("saveChat:", data)
        if (!data) {
            throw new Error('message body is Required')
        }
        if (!data.msg) {
            throw new Error('msg is Required')
        }
        if (!data.room) {
            throw new Error('room id is Required')
        }
        if (!data.msgTo) {
            throw new Error('msgTo  is Required')
        }
        const message = await new db.message({
            sender: data.msgFrom,
            receiver: data.msgTo,
            gift: data.giftId,
            content: data.msg,
            read: data.read || true,
            conversation: data.room
        }).save()

        if (data.gift !== "" || data.gift != undefined) {

            //=================== sender coin detail =====================
            let coin = await db.coin.findOne({ user: data.msgFrom })

        }

        log.info("message saved .");
        return message

    }


    //saving chats to database.
    // eventEmitter.on('save-chat', async (data) => {
    //    log.info("save-chat:", data)
    //     // var today = Date.now();
    //     try {
    //         if (data == undefined || data == null || data == "") {
    //            log.info("message body not received ");
    //         }

    //         const message = await new db.message({
    //             sender: data.msgFrom,
    //             receiver: data.msgTo,
    //             content: data.msg,
    //             read: data.read || true,
    //             conversation: data.room
    //         }).save()

    //         if (message) {
    //            log.info("message saved .");
    //         }

    //     } catch (error) {
    //        log.info("message Error : " + error);
    //     }
    // });

    //end of saving chat.

    //listening for get-all-users event. creating list of all users.

    eventEmitter.on('get-all-users', function () {
        db.user.find({})
            .select('name')
            .exec(function (err, result) {
                if (err) {
                    log.info("Error : " + err);
                } else {
                    userStack = {}
                    //console.log(result);
                    for (var i = 0; i < result.length; i++) {
                        userStack[result[i].id] = "Offline";
                    }
                    //console.log("stack "+Object.keys(userStack));
                    sendUserStack();
                }
            });
    }); //end of get-all-users event.

    //listening get-room-data event.

};

exports.connect = connect;
// exports.sockets = sockets;