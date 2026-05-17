const catchAsync = require('../utils/catchAsync');
const productService = require('../services/productService');

exports.getAllProducts = catchAsync(async (req, res) => {
  const products = await productService.getAllProducts();

  res.status(200).json({
    success: true,
    message: 'Список товарів отримано',
    data: {
      count: products.length,
      products
    }
  });
});

exports.getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Товар отримано',
    data: {
      product
    }
  });
});

exports.createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user._id);

  res.status(201).json({
    success: true,
    message: 'Товар створено',
    data: {
      product
    }
  });
});

exports.updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body, req.user);

  res.status(200).json({
    success: true,
    message: 'Товар оновлено',
    data: {
      product
    }
  });
});

exports.deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Товар видалено',
    data: null
  });
});
