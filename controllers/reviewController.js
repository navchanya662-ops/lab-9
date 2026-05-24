const catchAsync = require('../utils/catchAsync');
const reviewService = require('../services/reviewService');

exports.getReviews = catchAsync(async (req, res) => {
  const reviews = await reviewService.getReviewsByProduct(req.params.productId);

  res.status(200).json({
    success: true,
    message: 'Список відгуків отримано',
    data: {
      count: reviews.length,
      reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview(
    req.body,
    req.params.productId,
    req.user._id
  );

  res.status(201).json({
    success: true,
    message: 'Відгук створено',
    data: {
      review
    }
  });
});

exports.deleteReview = catchAsync(async (req, res) => {
  await reviewService.deleteReview(req.params.id, req.params.productId, req.user);

  res.status(200).json({
    success: true,
    message: 'Відгук видалено',
    data: null
  });
});
