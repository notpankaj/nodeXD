"use strict";

const success = (res, message, data) => {
  res.status(200).json({
    isSuccess: true,
    statusCode: 200,
    data: data,
    message: message
  });
};

const failure = (res, message) => {
  res.status(400).json({
    isSuccess: false,
    statusCode: 400,
    error: message
  });
};
const payPalfailure = (res, message, code) => {
  res.status(code).json({
    isSuccess: false,
    statusCode: code,
    error: message
  });
};

const unAuthorized = (res, message) => {
  res.status(401).json({
    isSuccess: false,
    statusCode: 401,
    error: message
  });
};

const data = (res, data) => {
  res.status(200).json({
    isSuccess: true,
    statusCode: 200,
    data: data
  });
};

const page = (res, data, pageNo, pageSize, total) => {
  res.status(200).json({
    isSuccess: true,
    statusCode: 200,
    pageNo: pageNo,
    pageSize: pageSize,
    total: total,
    items: data
  });
};

const authorized = (res, message, data, token) => {
  res
    .status(200)
    .set("x-access-token", token)
    .json({
      isSuccess: true,
      statusCode: 200,
      message: message,
      data: data
    });
};

exports.data = data;
exports.page = page;
exports.success = success;
exports.failure = failure;
exports.authorized = authorized;
exports.unAuthorized = unAuthorized;
exports.payPalfailure = payPalfailure;
