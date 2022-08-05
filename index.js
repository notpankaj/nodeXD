const express = require("express");
const config = require("config");
const cors = require("cors");
const app = express();
const PORT = config.get("app").port;

// socket
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const boot = async () => {
  app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
  });

  //  ^ SOCKET
  http.listen(PORT + 1, () => {
    console.log(`Socket Listening to ${PORT + 1}`);
  });

  await require("./socket/socketEvents").connect(io);
};

const init = async () => {
  try {
    await require("./settings/database").configure();
    await require("./settings/express").configure(app);
    await require("./settings/routes").configure(app);
    boot();
  } catch (error) {
    console.log("error init:", error.message);
  }
};

init();
