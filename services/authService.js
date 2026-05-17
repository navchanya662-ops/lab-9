const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utils/AppError');

exports.registerUser = async ({ name, email, password, confirmPassword }) => {
  if (!name || !email || !password || !confirmPassword) {
    throw new AppError('Усі поля обовʼязкові', 400);
  }

  if (password !== confirmPassword) {
    throw new AppError('Паролі не збігаються', 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    throw new AppError('Некоректний формат email', 400);
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError('Користувач з таким email вже існує', 409);
  }

  return User.create({
    name: name.trim(),
    email: normalizedEmail,
    password
  });
};

exports.loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError('Введіть email та пароль', 400);
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');

  if (!user) {
    throw new AppError('Невірний email або пароль', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError('Невірний email або пароль', 401);
  }

  return user;
};
