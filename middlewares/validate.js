const { validationResult } = require('express-validator');
const ApiError = require('../errors/ApiError');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(ApiError.badRequest(
      'Validation error',
      errors.array().map(e => ({ field: e.path, msg: e.msg }))
    ));
  }
  next();
};
