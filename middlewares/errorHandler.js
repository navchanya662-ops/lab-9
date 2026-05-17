const ApiError = require('../errors/ApiError');

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.isOperational ? err.message : 'Внутрішня помилка сервера';
  let errors = err.errors || [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors || [];
  } else if (err.isOperational) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Некоректний формат id';
    errors = [{ field: err.path, msg: 'Некоректний ObjectId' }];
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Помилка валідації даних';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      msg: e.message
    }));
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Користувач з таким email вже існує';
    errors = [];
  } else if (err.message) {
    message = err.message;
  }

  console.error(`[${new Date().toISOString()}] ${statusCode} ${message}`);

  return res.status(statusCode).json({
    success: false,
    message,
    data: errors.length ? { errors } : null
  });
};
