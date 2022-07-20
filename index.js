const express = require("express");
const config = require("config");

const app = express();
const PORT = config.get("app").port;

const boot = () => {
  app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`);
  });
};

const init = async () => {
  try {
    await require("./settings/database").configure();
    await require("./settings/express").configure(app);
    await require("./settings/routes").configure(app);
    boot();
  } catch (error) {
    console.log("error init:", error?.message);
  }
};

init();
