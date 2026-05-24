const Joi = require('joi');

exports.registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': "Ім'я обов'язкове",
    'string.min': "Ім'я має містити мінімум 2 символи",
    'string.max': "Ім'я не може бути довшим за 50 символів",
    'any.required': "Ім'я обов'язкове"
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.empty': 'Email обовʼязковий',
    'string.email': 'Введіть коректний email',
    'any.required': 'Email обовʼязковий'
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Пароль обовʼязковий',
    'string.min': 'Пароль має містити мінімум 8 символів',
    'any.required': 'Пароль обовʼязковий'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Паролі не збігаються',
    'any.required': 'Підтвердження пароля обовʼязкове',
    'string.empty': 'Підтвердження пароля обовʼязкове'
  })
});

exports.loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.empty': 'Email обовʼязковий',
    'string.email': 'Введіть коректний email',
    'any.required': 'Email обовʼязковий'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Пароль обовʼязковий',
    'any.required': 'Пароль обовʼязковий'
  })
});
