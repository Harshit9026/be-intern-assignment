import { Router } from 'express';
import { HashtagController } from '../controllers/hashtag.controller';
import { validate } from '../middleware/validation.middleware';
import { addHashtagsToPostSchema } from '../validations/hashtagValidation';

const hashtagRoutes = Router();
const controller = new HashtagController();

// Add hashtags to a post - with validation
hashtagRoutes.post('/post', validate(addHashtagsToPostSchema), controller.addHashtagsToPost.bind(controller));

// Get posts by hashtag - no validation needed for GET
hashtagRoutes.get('/:tag', controller.getPostsByHashtag.bind(controller));

export default hashtagRoutes;