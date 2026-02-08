import { Router } from 'express';
import { FollowController } from '../controllers/follow.controller';
import { validate } from '../middleware/validation.middleware';
import { createFollowSchema } from '../validations/followValidation';

const followRoutes = Router();
const controller = new FollowController();

followRoutes.post('/', validate(createFollowSchema), controller.followUser.bind(controller));
followRoutes.delete('/', validate(createFollowSchema), controller.unfollowUser.bind(controller));

export default followRoutes;