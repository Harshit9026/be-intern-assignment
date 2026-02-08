import Joi from 'joi';

// For creating a standalone hashtag (if needed)
export const createHashtagSchema = Joi.object({
  tag: Joi.string()
    .required()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .lowercase()
    .messages({
      'string.empty': 'Tag is required',
      'string.min': 'Tag must be at least 1 character long',
      'string.max': 'Tag cannot exceed 100 characters',
      'string.pattern.base': 'Tag can only contain letters, numbers, and underscores',
    }),
});

// For updating a hashtag (if needed)
export const updateHashtagSchema = Joi.object({
  tag: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .lowercase()
    .messages({
      'string.min': 'Tag must be at least 1 character long',
      'string.max': 'Tag cannot exceed 100 characters',
      'string.pattern.base': 'Tag can only contain letters, numbers, and underscores',
    }),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

// FOR THE "ADD HASHTAGS TO POST" ENDPOINT - THIS IS WHAT YOU NEED!
export const addHashtagsToPostSchema = Joi.object({
  postId: Joi.number().integer().positive().required().messages({
    'number.base': 'Post ID must be a number',
    'number.positive': 'Post ID must be positive',
    'any.required': 'Post ID is required',
  }),
  tags: Joi.array()
    .items(
      Joi.string()
        .min(1)
        .max(100)
        .pattern(/^[a-zA-Z0-9_]+$/)
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Tags must be an array',
      'array.min': 'At least one tag is required',
      'any.required': 'Tags are required',
      'string.pattern.base': 'Each tag can only contain letters, numbers, and underscores',
    }),
});