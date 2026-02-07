import { Router } from 'express';
import { PostController } from '../controllers/post.controller';

export const postRoutes = Router();
const controller = new PostController();

postRoutes.get('/', controller.getAllPosts.bind(controller));
postRoutes.get('/:id', controller.getPostById.bind(controller));
postRoutes.post('/', controller.createPost.bind(controller));
postRoutes.put('/:id', controller.updatePost.bind(controller));
postRoutes.delete('/:id', controller.deletePost.bind(controller));


