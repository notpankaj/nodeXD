const response = require("../exchange/response");
const service = require("../services/users");

const login = async (req, res) => {
  let message;
  try {
    const user = await service.login(req.body, req.context);
    message = "user login successfuly!";
    response.success(res, message, user);
  } catch (error) {
    message = error?.message;
    response.failure(res, message);
  }
};
const create = async (req, res) => {
  let message;

  try {
    const user = await service.create(req.body);
    message = "user created successfuly!";
    response.success(res, message, user);
  } catch (error) {
    message = error?.message;
    response.failure(res, message);
  }
};
const update = async (req, res) => {
  try {
    const user = await service.update(req.params.id, req.body);
    let message = "user updated successfuly!";
    response.success(res, message, user);
  } catch (error) {
    message = error?.message;
    response.failure(res, message);
  }
};
const get = async (req, res) => {
  try {
    const user = await service.get(req.params.id);
    let message = "user get successfuly!";
    response.success(res, message, user);
  } catch (error) {
    message = error?.message;
    response.failure(res, message);
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await service.deleteUser(req.params.id);
    let message = "user deleted successfuly!";
    response.success(res, message, user);
  } catch (error) {
    message = error?.message;
    response.failure(res, message);
  }
};
const recoverUser = async (req, res) => {
  try {
    const user = await service.recoverUser(req.params.id);
    let message = "user recover successfuly!";
    response.success(res, message, user);
  } catch (error) {
    message = error?.message;
    response.failure(res, message);
  }
};

exports.login = login;
exports.create = create;
exports.update = update;
exports.get = get;
exports.deleteUser = deleteUser
exports.recoverUser= recoverUser

