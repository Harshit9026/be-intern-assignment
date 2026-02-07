import { Router } from 'express';
import { HashtagController } from '../controllers/hashtag.controller';

const hashtagRoutes = Router();
const controller = new HashtagController();

hashtagRoutes.post('/post', controller.addHashtagsToPost.bind(controller));
hashtagRoutes.get('/:tag', controller.getPostsByHashtag.bind(controller));

export default hashtagRoutes;
