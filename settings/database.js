"use strict";

const dbConfig = require("config").get("db");
const mongoose = require("mongoose");

const configure = async () => {
  try {
    await mongoose.connect(dbConfig.url + "/" + dbConfig.database, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`mongoose default connection is open to ${dbConfig.url}`);
  } catch (error) {
    console.log(`unable to create mongo connection to ${dbConfig.url}`);
    throw new Error(error.message);
  }
};
exports.configure = configure;
