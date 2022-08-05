const connect = async (io) => {
  var ioChat = io;
  ioChat.on("connection", (socket) => {
    socket.on("chat-msg", (data) => {
      console.log(data, "le beta");
      socket.emit("chat-msg", data);
    });
  });
};

exports.connect = connect;
