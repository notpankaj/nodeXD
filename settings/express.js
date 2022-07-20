const express = require("express");
const path = require("path");

const configure = (app) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  const root = path.normalize(__dirname + "./../");
  app.use(express.static(path.join(root, "public")));

  
  

};

exports.configure = configure;
