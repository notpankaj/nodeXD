const success = (res, message, data) => {
  res.status(200).json({
    isSuccess: true,
    statusCode: 200,
    message,
    data,
  });
};
const failure = (res, message) => {
  res.status(400).json({
    isSuccess: false,
    statusCode: 400,
    error: message,
  });
};

exports.success = success;
exports.failure = failure;
