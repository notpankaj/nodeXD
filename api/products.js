const response = require("../exchange/response");
const service = require("../services/products");

const create = async (req, res) => {
  let message;
  try {
    const user = await service.create(req.body);
    message = "products created successfuly!";
    response.success(res, message, user);
  } catch (error) {
    message = error?.message;
    response.failure(res, message);
  }
};
const get = async (req, res) => {
  try {
    const user = await service.get(req.params.id);
    let message = "products get successfuly!";
    response.success(res, message, user);
  } catch (error) {
    message = error?.message;
    response.failure(res, message);
  }
};
const update = async (req, res) => {
  try {
    const user = await service.update(req.params.id, req.body);
    let message = "products updated successfuly!";
    response.success(res, message, user);
  } catch (error) {
    message = error?.message;
    response.failure(res, message);
  }
};

const productDelete = async (req, res) => {
  let message;
  try {
    const user = await service.delete(req.params.id);
    message = "products delete successfuly!";
    response.success(res, message, user);
  } catch (error) {
    message = error?.message;
    response.failure(res, message);
  }
};
const getAll = async (req, res) => {
  let message;
  try {
    const product = await service.getAll(req.query);

    message = "products get successfuly!";

    response.page(
      res,
      product,
      req.query.pageNo,
      req.query.pageSize,
      product.count,
      message
    );
  } catch (error) {
    message = error?.message;
    response.failure(res, message);
  }
};

exports.create = create;
exports.update = update;
exports.delete = productDelete;
exports.get = get;
exports.getAll = getAll;
