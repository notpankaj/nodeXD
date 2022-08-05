"use strict";
const express = require("express");
const appConfig = require("config").get("app");
const logger = require("@open-age/logger")("server");
const auth = require("./permit/auth");
// const Http = require("http");

const fs = require("fs");
const Https = require("https");
const port = process.env.PORT || appConfig.port || 3000;
const app = express();
const admin = require("firebase-admin");
// var server = Http.createServer(app);
var serviceAccount = require("./amber-firebase-adminsdk.json");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const options = {
  cert: fs.readFileSync("/etc/letsencrypt/live/amberclubpro.com/fullchain.pem"),
  key: fs.readFileSync("/etc/letsencrypt/live/amberclubpro.com/privkey.pem"),
};
var server = Https.createServer(options, app);
// var server = Http.createServer(app);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const boot = async () => {
  const log = logger.start("app:boot");
  log.info(`environment:  ${process.env.NODE_ENV}`);
  log.info("starting server");
  server.listen(port, () => {
    log.info(`listening on port: ${port}`);
    log.end();
  });

  const io = await require("socket.io")(server, {
    allowEIO3: true,
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      const details = auth.extractToken(token, { logger });
      if (details.name === "TokenExpiredError") {
        next(new Error("token expired"));
        // throw new Error("token expired");
      }
      if (details.name === "JsonWebTokenError") {
        next(new Error("token is invalid"));
        // throw new Error("token is invalid");
      }
      const user = await db.user.findById(details._id);
      socket.userId = user.id;

      next();
    } catch (err) {
      next(new Error(err.message));
      // log.error(err)
      // log.end()
      // throw new Error(err.message)
    }
  });

  await require("./socket/socketEvents").connect(io, logger);
};

const init = async () => {
  await require("./settings/database").configure(logger);
  await require("./settings/express").configure(app, logger);
  await require("./settings/routes").configure(app, logger);
  app.get("/chat", function (req, res) {
    res.sendFile(__dirname + "/templates/index.html");
  });

  boot();
};

init();
