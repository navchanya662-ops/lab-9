const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ApiError = require('../errors/ApiError');
const asyncHandler = require('../middlewares/asyncHandler');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    throw ApiError.badRequest('Усі поля обовʼязкові');
  }

  if (password.length < 8) {
    throw ApiError.badRequest('Пароль має містити мінімум 8 символів');
  }

  if (password !== confirmPassword) {
    throw ApiError.badRequest('Паролі не збігаються');
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    throw ApiError.badRequest('Некоректний формат email');
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw ApiError.conflict('Користувач з таким email вже існує');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword
  });

  res.status(201).json({
    success: true,
    message: 'Реєстрація успішна',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    }
  });
});
