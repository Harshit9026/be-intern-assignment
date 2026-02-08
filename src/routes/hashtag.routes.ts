import { Router } from 'express';
import { HashtagController } from '../controllers/hashtag.controller';

const router = Router();
const hashtagController = new HashtagController();

// POST /api/hashtags/post - Add hashtags to a post
router.post('/post', async (req, res) => {
  await hashtagController.addHashtagsToPost(req, res);
});

// GET /api/hashtags/:tag/posts - Get posts by hashtag
router.get('/:tag/posts', async (req, res) => {
  await hashtagController.getPostsByHashtag(req, res);
});

export default router;