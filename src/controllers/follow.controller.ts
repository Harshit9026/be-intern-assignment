import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Follow } from '../entities/Follow';
import { User } from '../entities/User';

export class FollowController {
  private followRepository = AppDataSource.getRepository(Follow);
  private userRepository = AppDataSource.getRepository(User);

  async followUser(req: Request, res: Response) {
    try {
      const { followerId, followingId } = req.body;

      if (followerId === followingId) {
        return res.status(400).json({ message: 'Cannot follow yourself' });
      }

      const follower = await this.userRepository.findOneBy({ id: followerId });
      const following = await this.userRepository.findOneBy({ id: followingId });

      if (!follower || !following) {
        return res.status(404).json({ message: 'User not found' });
      }

      const follow = this.followRepository.create({
        follower,
        following,
      });

      const result = await this.followRepository.save(follow);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error following user' });
    }
  }

  async unfollowUser(req: Request, res: Response) {
    try {
      const { followerId, followingId } = req.body;

      const result = await this.followRepository.delete({
        follower: { id: followerId },
        following: { id: followingId },
      });

      if (result.affected === 0) {
        return res.status(404).json({ message: 'Follow relation not found' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error unfollowing user' });
    }
  }
}
