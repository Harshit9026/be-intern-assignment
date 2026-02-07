import { Router } from 'express';
import { LikeController } from '../controllers/like.controller';

const likeRoutes = Router();
const controller = new LikeController();

likeRoutes.post('/', controller.likePost.bind(controller));
likeRoutes.delete('/', controller.unlikePost.bind(controller));

export default likeRoutes;
