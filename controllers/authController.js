const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ApiError = require('../errors/ApiError');
const asyncHandler = require('../middlewares/asyncHandler');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

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

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw ApiError.badRequest('Введіть email та пароль');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET не задано в .env');
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');

  if (!user) {
    throw ApiError.unauthorized('Невірний email або пароль');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw ApiError.unauthorized('Невірний email або пароль');
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Вхід виконано успішно',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  });
});

exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Профіль користувача отримано',
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt
      }
    }
  });
});
