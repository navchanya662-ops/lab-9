const Joi = require('joi');

exports.createReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Оцінка має бути числом',
    'number.integer': 'Оцінка має бути цілим числом',
    'number.min': 'Оцінка не може бути менше 1',
    'number.max': 'Оцінка не може бути більше 5',
    'any.required': 'Оцінка обовʼязкова'
  }),
  comment: Joi.string().trim().min(10).max(500).required().messages({
    'string.empty': 'Текст відгуку обовʼязковий',
    'string.min': 'Відгук має містити мінімум 10 символів',
    'string.max': 'Відгук не може бути довшим за 500 символів',
    'any.required': 'Текст відгуку обовʼязковий'
  })
});
