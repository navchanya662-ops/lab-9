const Joi = require('joi');

exports.createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required().messages({
    'string.empty': 'Назва товару обовʼязкова',
    'string.min': 'Назва товару має містити мінімум 2 символи',
    'string.max': 'Назва товару не може бути довшою за 120 символів',
    'any.required': 'Назва товару обовʼязкова'
  }),
  description: Joi.string().trim().min(10).required().messages({
    'string.empty': 'Опис товару обовʼязковий',
    'string.min': 'Опис товару має містити мінімум 10 символів',
    'any.required': 'Опис товару обовʼязковий'
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Ціна має бути числом',
    'number.min': 'Ціна не може бути відʼємною',
    'any.required': 'Ціна товару обовʼязкова'
  }),
  category: Joi.string().trim().min(2).required().messages({
    'string.empty': 'Категорія товару обовʼязкова',
    'string.min': 'Категорія має містити мінімум 2 символи',
    'any.required': 'Категорія товару обовʼязкова'
  }),
  stock: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'Кількість має бути числом',
    'number.integer': 'Кількість має бути цілим числом',
    'number.min': 'Кількість на складі не може бути відʼємною'
  })
});

exports.updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).messages({
    'string.empty': 'Назва товару не може бути порожньою',
    'string.min': 'Назва товару має містити мінімум 2 символи',
    'string.max': 'Назва товару не може бути довшою за 120 символів'
  }),
  description: Joi.string().trim().min(10).messages({
    'string.empty': 'Опис товару не може бути порожнім',
    'string.min': 'Опис товару має містити мінімум 10 символів'
  }),
  price: Joi.number().min(0).messages({
    'number.base': 'Ціна має бути числом',
    'number.min': 'Ціна не може бути відʼємною'
  }),
  category: Joi.string().trim().min(2).messages({
    'string.empty': 'Категорія товару не може бути порожньою',
    'string.min': 'Категорія має містити мінімум 2 символи'
  }),
  stock: Joi.number().integer().min(0).messages({
    'number.base': 'Кількість має бути числом',
    'number.integer': 'Кількість має бути цілим числом',
    'number.min': 'Кількість на складі не може бути відʼємною'
  })
}).min(1).messages({
  'object.min': 'Потрібно передати хоча б одне поле для оновлення'
});
