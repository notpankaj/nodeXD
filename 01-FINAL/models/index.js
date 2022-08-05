"use strict";

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const configure = async () => {
  const files = fs.readdirSync(path.join(__dirname));

  for (let file of files) {
    const fileName = file
      .split(".")
      .slice(0, -1)
      .join(".");
    if (fileName && fileName !== "index") {
      mongoose.model(fileName, require(`./${fileName}`));
    }
  }
};

exports.configure = configure;
