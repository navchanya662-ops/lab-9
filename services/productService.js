const Product = require('../models/Product');
const AppError = require('../utils/AppError');

const pickProductFields = (data) => {
  const { name, description, price, category, stock } = data;
  const productData = {};

  if (name !== undefined) productData.name = name;
  if (description !== undefined) productData.description = description;
  if (price !== undefined) productData.price = price;
  if (category !== undefined) productData.category = category;
  if (stock !== undefined) productData.stock = stock;

  return productData;
};

exports.getAllProducts = async () => {
  return Product.find()
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
};

exports.getProductById = async (id) => {
  const product = await Product.findById(id)
    .populate('createdBy', 'name email');

  if (!product) {
    throw new AppError('Товар не знайдено', 404);
  }

  return product;
};

exports.createProduct = async (data, userId) => {
  return Product.create({
    ...pickProductFields(data),
    createdBy: userId
  });
};

exports.updateProduct = async (id, data, currentUser) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new AppError('Товар не знайдено', 404);
  }

  if (
    product.createdBy.toString() !== currentUser._id.toString() &&
    currentUser.role !== 'admin'
  ) {
    throw new AppError('Ви не маєте прав редагувати цей запис', 403);
  }

  Object.assign(product, pickProductFields(data));
  await product.save();

  return product.populate('createdBy', 'name email');
};

exports.deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new AppError('Товар не знайдено', 404);
  }

  return product;
};
