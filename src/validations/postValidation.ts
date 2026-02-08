import Joi from 'joi';

export const createPostSchema = Joi.object({
  content: Joi.string().required().min(1).max(10000).messages({
    'string.empty': 'Content is required',
    'string.min': 'Content must be at least 1 character long',
    'string.max': 'Content cannot exceed 10000 characters',
  }),
  authorId: Joi.number().integer().positive().required().messages({
    'number.base': 'Author ID must be a number',
    'number.positive': 'Author ID must be positive',
    'any.required': 'Author ID is required',
  }),
});

export const updatePostSchema = Joi.object({
  content: Joi.string().min(1).max(10000).messages({
    'string.min': 'Content must be at least 1 character long',
    'string.max': 'Content cannot exceed 10000 characters',
  }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });