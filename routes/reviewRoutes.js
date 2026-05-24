const express = require('express');
const protect = require('../middleware/protect');
const validate = require('../middleware/validate');
const { createReviewSchema } = require('../validators/reviewValidators');
const {
  getReviews,
  createReview,
  deleteReview
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.get('/', getReviews);
router.post('/', protect, validate(createReviewSchema), createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
