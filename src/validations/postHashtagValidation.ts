import Joi from 'joi';

export const createPostHashtagSchema = Joi.object({
  postId: Joi.number().integer().positive().required().messages({
    'number.base': 'Post ID must be a number',
    'number.positive': 'Post ID must be positive',
    'any.required': 'Post ID is required',
  }),
  hashtagId: Joi.number().integer().positive().required().messages({
    'number.base': 'Hashtag ID must be a number',
    'number.positive': 'Hashtag ID must be positive',
    'any.required': 'Hashtag ID is required',
  }),
});