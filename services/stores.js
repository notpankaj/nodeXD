const Store = require("../models/store");

const create = async (model) => {
  const storeCount = await Store.find({ user: model.user }).count();
  console.log(storeCount);
  if (storeCount >= 1) {
    throw new Error("User Can Have Only One Store!");
  } else {
    const newStore = await Store.create(model);
    return newStore;
  }
};

const get = async (userId) => {
  const store = await Store.find({ user: userId });
  return store;
};

exports.create = create;
exports.get = get;
