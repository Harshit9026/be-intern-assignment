import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Follow } from '../entities/Follow';
import { User } from '../entities/User';

export class FollowController {
  private followRepository = AppDataSource.getRepository(Follow);
  private userRepository = AppDataSource.getRepository(User);

  // =====================
  // POST /api/follows
  // =====================
  async followUser(req: Request, res: Response) {
    try {
      const { followerId, followingId } = req.body;

      // 1. Basic validation
      if (!followerId || !followingId) {
        return res.status(400).json({
          message: 'followerId and followingId are required',
        });
      }

      if (followerId === followingId) {
        return res.status(400).json({
          message: 'Cannot follow yourself',
        });
      }

      // 2. Check users exist
      const follower = await this.userRepository.findOneBy({ id: followerId });
      const following = await this.userRepository.findOneBy({ id: followingId });

      if (!follower || !following) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      // 3. Check if already following
      const existingFollow = await this.followRepository
        .createQueryBuilder('follow')
        .where('follow.followerId = :followerId', { followerId })
        .andWhere('follow.followingId = :followingId', { followingId })
        .getOne();

      if (existingFollow) {
        return res.status(409).json({
          message: 'Already following this user',
        });
      }

      // 4. Create follow
      const follow = this.followRepository.create({
        follower,
        following,
      });

      const savedFollow = await this.followRepository.save(follow);

      return res.status(201).json({
        message: 'Successfully followed user',
        follow: {
          id: savedFollow.id,
          followerId,
          followingId,
          createdAt: savedFollow.createdAt,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error following user',
      });
    }
  }

  // =====================
  // DELETE /api/follows
  // =====================
  async unfollowUser(req: Request, res: Response) {
    try {
      const { followerId, followingId } = req.body;

      if (!followerId || !followingId) {
        return res.status(400).json({
          message: 'followerId and followingId are required',
        });
      }

      const result = await this.followRepository
        .createQueryBuilder()
        .delete()
        .from(Follow)
        .where('followerId = :followerId', { followerId })
        .andWhere('followingId = :followingId', { followingId })
        .execute();

      if (result.affected === 0) {
        return res.status(404).json({
          message: 'Follow relationship not found',
        });
      }

      return res.status(200).json({
        message: 'Successfully unfollowed user',
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error unfollowing user',
      });
    }
  }

  // =====================
  // GET /api/users/:id/followers
  // =====================
  async getFollowers(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({
          message: 'Invalid user id',
        });
      }

      const followers = await this.followRepository.find({
        where: { following: { id: userId } },
        relations: ['follower'],
        order: { createdAt: 'DESC' },
      });

      const result = followers.map((f) => ({
        id: f.follower.id,
        firstName: f.follower.firstName,
        lastName: f.follower.lastName,
        email: f.follower.email,
        followedAt: f.createdAt,
      }));

      return res.json({
        total: result.length,
        followers: result,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error fetching followers',
      });
    }
  }
}
