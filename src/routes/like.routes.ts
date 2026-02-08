import { Router } from 'express';
import { LikeController } from '../controllers/like.controller';
import { validate } from '../middleware/validation.middleware';
import { createLikeSchema } from '../validations/likeValidation';

const likeRoutes = Router();
const controller = new LikeController();

likeRoutes.post('/', validate(createLikeSchema), controller.likePost.bind(controller));
likeRoutes.delete('/', validate(createLikeSchema), controller.unlikePost.bind(controller));

export default likeRoutes;