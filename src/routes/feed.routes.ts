import { Router } from 'express';
import { FeedController } from '../controllers/feed.controller';

const feedRoutes = Router();
const controller = new FeedController();

feedRoutes.get('/', controller.getFeed.bind(controller));

export default feedRoutes;
