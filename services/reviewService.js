const Review = require('../models/Review');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

const ensureProductExists = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError('Товар не знайдено', 404);
  }

  return product;
};

exports.getReviewsByProduct = async (productId) => {
  await ensureProductExists(productId);

  return Review.find({ product: productId })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
};

exports.createReview = async (data, productId, userId) => {
  await ensureProductExists(productId);

  return Review.create({
    rating: data.rating,
    comment: data.comment,
    product: productId,
    user: userId
  });
};

exports.deleteReview = async (reviewId, productId, currentUser) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new AppError('Відгук не знайдено', 404);
  }

  if (review.product.toString() !== productId) {
    throw new AppError('Відгук не знайдено для цього товару', 404);
  }

  if (
    review.user.toString() !== currentUser._id.toString() &&
    currentUser.role !== 'admin'
  ) {
    throw new AppError('Ви не маєте прав видалити цей відгук', 403);
  }

  await review.deleteOne();
  return review;
};
