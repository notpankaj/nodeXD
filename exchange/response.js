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

const page = (res, data, pageNo, pageSize, total, message) => {
  res.status(200).json({
    isSuccess: true,
    message,
    statusCode: 200,
    pageNo: pageNo,
    pageSize: pageSize,
    total: total,
    items: data,
  });
};

exports.success = success;
exports.failure = failure;
exports.page = page;
