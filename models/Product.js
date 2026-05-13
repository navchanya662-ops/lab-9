const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Назва товару обов'язкова"],
    trim: true,
    minlength: [2, 'Назва товару має містити мінімум 2 символи'],
    maxlength: [120, 'Назва товару не може бути довшою за 120 символів']
  },
  description: {
    type: String,
    required: [true, "Опис товару обов'язковий"],
    trim: true,
    minlength: [10, 'Опис товару має містити мінімум 10 символів']
  },
  price: {
    type: Number,
    required: [true, "Ціна товару обов'язкова"],
    min: [0, 'Ціна не може бути відʼємною']
  },
  category: {
    type: String,
    required: [true, "Категорія товару обов'язкова"],
    trim: true
  },
  stock: {
    type: Number,
    required: [true, "Кількість товару на складі обов'язкова"],
    min: [0, 'Кількість на складі не може бути відʼємною'],
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
