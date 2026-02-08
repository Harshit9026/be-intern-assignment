import Joi from 'joi';

export const createFollowSchema = Joi.object({
  followerId: Joi.number().integer().positive().required().messages({
    'number.base': 'Follower ID must be a number',
    'number.positive': 'Follower ID must be positive',
    'any.required': 'Follower ID is required',
  }),
  followingId: Joi.number().integer().positive().required().messages({
    'number.base': 'Following ID must be a number',
    'number.positive': 'Following ID must be positive',
    'any.required': 'Following ID is required',
  }),
})
  .custom((value, helpers) => {
    if (value.followerId === value.followingId) {
      return helpers.error('any.invalid');
    }
    return value;
  })
  .messages({
    'any.invalid': 'Users cannot follow themselves',
  });