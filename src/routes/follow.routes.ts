import { Router } from 'express';
import { FollowController } from '../controllers/follow.controller';

const followRoutes = Router();
const controller = new FollowController();

followRoutes.post('/', controller.followUser.bind(controller));
followRoutes.delete('/', controller.unfollowUser.bind(controller));

export default followRoutes;
