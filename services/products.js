const Product = require("../models/product");

const get = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error("no product found!");
  }
  return product;
};
const create = async (model) => {
  const product = await Product.create(model);
  return product;
};
const productDelete = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new Error("no product found!");
  }
  return product;
};
const update = async () => {};

const getAll = async (query) => {
  let pageNo = Number(query.pageNo) || 1;
  let pageSize = Number(query.pageSize) || 10;
  let skipCount = pageSize * pageNo;
  const products = await Product.find().skip(skipCount).limit(pageSize);

  products.count = await Product.find().count();
  return products;
};
exports.get = get;
exports.create = create;
exports.delete = productDelete;
exports.update = update;
exports.getAll = getAll;
