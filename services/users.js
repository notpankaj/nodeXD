const User = require("../models/user");
const auth = require("../permit/auth");

const login = async (model) => {
  const user = await User.findOne({
    username: model.username,
    password: model.password,
  });

  if (user) {
    if (user?.isActive) {
      user.token = auth.getToken(user.id, false)
      return user
    } else {
      throw new Error(`user has been delete please contact admin for account recovery!`,)
    }
  } else {
    throw new Error(`user not found : ${user}`,)
  }
};

const create = async (model) => {
  const user = await User.findOne({
    username: model.username,
  });

  if (!user) {
    const user = await User.create(model);
    return user;
  } else {
    throw new Error(`${model?.username} is already taken!`);
  }
};

const update = async (id, model) => {
  const user = await User.findByIdAndUpdate(id, model);
  if (user) {
    return user;
  } else {
    throw new Error(`failed to update`);
  }
};

const get = async (id) => {
  const user = await User.findById(id);
  if (user) {
    return user;
  } else {
    throw new Error(`no user found with id: ${id}`);
  }
};
const deleteUser = async (id) => {
  const user = await User.findByIdAndUpdate(id, { isActive: false });
  if (user) {
    return user;
  } else {
    throw new Error(`no user found with id: ${id}`);
  }
};
// * Admin Only
const recoverUser = async (id) => {
  const user = await User.findByIdAndUpdate(id, { isActive: true });
  if (user) {
    return user;
  } else {
    throw new Error(`no user found with id: ${id}`);
  }
};

exports.login = login;
exports.create = create;
exports.update = update;
exports.get = get;
exports.deleteUser = deleteUser
exports.recoverUser = recoverUser