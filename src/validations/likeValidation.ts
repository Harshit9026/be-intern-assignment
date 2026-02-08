import Joi from 'joi';

export const createLikeSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    'number.base': 'User ID must be a number',
    'number.positive': 'User ID must be positive',
    'any.required': 'User ID is required',
  }),
  postId: Joi.number().integer().positive().required().messages({
    'number.base': 'Post ID must be a number',
    'number.positive': 'Post ID must be positive',
    'any.required': 'Post ID is required',
  }),
});