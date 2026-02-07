import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Like } from '../entities/Like';
import { User } from '../entities/User';
import { Post } from '../entities/Post';

export class LikeController {
  private likeRepo = AppDataSource.getRepository(Like);
  private userRepo = AppDataSource.getRepository(User);
  private postRepo = AppDataSource.getRepository(Post);

  async likePost(req: Request, res: Response) {
    try {
      const { userId, postId } = req.body;

      const user = await this.userRepo.findOneBy({ id: userId });
      const post = await this.postRepo.findOneBy({ id: postId });

      if (!user || !post) {
        return res.status(404).json({ message: 'User or Post not found' });
      }

      const like = this.likeRepo.create({ user, post });
      const result = await this.likeRepo.save(like);
      res.status(201).json(result);
    } catch (err) {
      // unique index will throw if already liked
      res.status(400).json({ message: 'Post already liked' });
    }
  }

  async unlikePost(req: Request, res: Response) {
    try {
      const { userId, postId } = req.body;

      const result = await this.likeRepo.delete({
        user: { id: userId },
        post: { id: postId },
      });

      if (result.affected === 0) {
        return res.status(404).json({ message: 'Like not found' });
      }

      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: 'Error unliking post' });
    }
  }
}
