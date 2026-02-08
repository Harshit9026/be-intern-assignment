import { Router } from 'express';
import { PostController } from '../controllers/post.controller';
import { validate } from '../middleware/validation.middleware';
import { createPostSchema, updatePostSchema } from '../validations/postValidation';

export const postRoutes = Router();
const controller = new PostController();

postRoutes.get('/', controller.getAllPosts.bind(controller));
postRoutes.get('/:id', controller.getPostById.bind(controller));
postRoutes.post('/', validate(createPostSchema), controller.createPost.bind(controller));
postRoutes.put('/:id', validate(updatePostSchema), controller.updatePost.bind(controller));
postRoutes.delete('/:id', controller.deletePost.bind(controller));