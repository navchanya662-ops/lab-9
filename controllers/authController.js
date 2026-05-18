const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt
});

exports.register = catchAsync(async (req, res) => {
  const user = await authService.registerUser(req.body);
  const token = generateToken(user._id, user.role);

  res.cookie('token', token, cookieOptions);

  res.status(201).json({
    success: true,
    message: 'Реєстрація успішна',
    data: {
      user: formatUser(user)
    }
  });
});

exports.login = catchAsync(async (req, res) => {
  const user = await authService.loginUser(req.body);
  const token = generateToken(user._id, user.role);

  res.cookie('token', token, cookieOptions);

  res.status(200).json({
    success: true,
    message: 'Вхід виконано успішно',
    data: {
      user: formatUser(user)
    }
  });
});

exports.logout = catchAsync(async (req, res) => {
  res.cookie('token', '', { ...cookieOptions, maxAge: 0 });

  res.status(200).json({
    success: true,
    message: 'Вихід виконано'
  });
});

exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Профіль користувача отримано',
    data: {
      user: formatUser(req.user)
    }
  });
});
