const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Оцінка обовʼязкова'],
    min: [1, 'Оцінка не може бути менше 1'],
    max: [5, 'Оцінка не може бути більше 5']
  },
  comment: {
    type: String,
    required: [true, 'Текст відгуку обовʼязковий'],
    trim: true,
    minlength: [10, 'Відгук має містити мінімум 10 символів'],
    maxlength: [500, 'Відгук не може бути довшим за 500 символів']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);
