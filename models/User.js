const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Ім'я обов'язкове"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email обов'язковий"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Некоректний формат email']
  },
  password: {
    type: String,
    required: [true, "Пароль обов'язковий"],
    minlength: [8, 'Пароль має містити мінімум 8 символів'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
