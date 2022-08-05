const response = require("../exchange/response");
const service = require("../services/stores");

const create = async (req, res) => {
  let message;
  try {
    const store = await service.create(req.body);
    message = "store created successfuly!";
    response.success(res, message, store);
  } catch (error) {
    message = error?.message;
    response.failure(res, message);
  }
};

const get = async (req, res) => {
  let message;
  try {
    const user = await service.get(req.params.id);
    message = "store get successfuly!";
    response.success(res, message, user);
  } catch (error) {
    message = error?.message;
    response.failure(res, message);
  }
};

exports.create = create;
exports.get = get;
