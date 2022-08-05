
"use strict";
const dbConfig = require("config").get("db");
const mongoose = require("mongoose");

const configure = async logger => {
  const log = logger.start(`settings:database:configure`);
  try {
    await mongoose.connect(dbConfig.url + "/" + dbConfig.database, {
      // await mongoose.connect(dbConfig.url + "/" + dbConfig.database , {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // if (process.env.NODE_ENV !== 'prod') {
    //   mongoose.set('debug', true)
    // }
    console.log(`mongoose default connection is open to ${dbConfig.url}`);
    await require("../models").configure();
    global.db = mongoose.models;
    log.end();
  } catch (err) {
    log.error(`unable to create mongo connection to ${dbConfig.url}`);
    throw new Error(err.message);
    // log.error(err);
  }
};

exports.configure = configure;
