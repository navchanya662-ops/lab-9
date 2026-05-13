const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, "Пост обов'язковий"]
  },
  author: {
    type: String,
    required: [true, "Автор обов'язковий"],
    trim: true
  },
  content: {
    type: String,
    required: [true, "Коментар обов'язковий"],
    maxlength: [1000, 'Макс 1000 символів']
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Comment || mongoose.model('Comment', commentSchema);