const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');

exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Список товарів отримано',
    data: {
      count: products.length,
      products
    }
  });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('createdBy', 'name email');

  if (!product) {
    return next(new AppError('Товар не знайдено', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Товар отримано',
    data: {
      product
    }
  });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.status(201).json({
    success: true,
    message: 'Товар створено',
    data: {
      product
    }
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;
  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = price;
  if (category !== undefined) updateData.category = category;
  if (stock !== undefined) updateData.stock = stock;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!product) {
    return next(new AppError('Товар не знайдено', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Товар оновлено',
    data: {
      product
    }
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('Товар не знайдено', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Товар видалено',
    data: null
  });
});
