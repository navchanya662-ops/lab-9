const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Заголовок обов'язковий"],
    trim: true,
    minlength: [3, 'Заголовок має містити мінімум 3 символи']
  },
  content: {
    type: String,
    required: [true, "Текст статті обов'язковий"],
    minlength: [10, 'Текст статті має містити мінімум 10 символів']
  },
  author: {
    type: String,
    required: [true, "Автор обов'язковий"],
    trim: true
  },
  tags: [{ type: String, trim: true }],
  publishedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Article || mongoose.model('Article', articleSchema);
