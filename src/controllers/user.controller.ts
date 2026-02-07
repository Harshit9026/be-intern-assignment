// import { Request, Response } from 'express';
// import { User } from '../entities/User';
// import { AppDataSource } from '../data-source';

// export class UserController {
//   private userRepository = AppDataSource.getRepository(User);

//   async getAllUsers(req: Request, res: Response) {
//     try {
//       const users = await this.userRepository.find();
//       res.json(users);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching users', error });
//     }
//   }

//   async getUserById(req: Request, res: Response) {
//     try {
//       const user = await this.userRepository.findOneBy({
//         id: parseInt(req.params.id),
//       });
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       res.json(user);
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching user', error });
//     }
//   }

//   async createUser(req: Request, res: Response) {
//     try {
//       const user = this.userRepository.create(req.body);
//       const result = await this.userRepository.save(user);
//       res.status(201).json(result);
//     } catch (error) {
//       res.status(500).json({ message: 'Error creating user', error });
//     }
//   }

//   async updateUser(req: Request, res: Response) {
//     try {
//       const user = await this.userRepository.findOneBy({
//         id: parseInt(req.params.id),
//       });
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       this.userRepository.merge(user, req.body);
//       const result = await this.userRepository.save(user);
//       res.json(result);
//     } catch (error) {
//       res.status(500).json({ message: 'Error updating user', error });
//     }
//   }

//   async deleteUser(req: Request, res: Response) {
//     try {
//       const result = await this.userRepository.delete(parseInt(req.params.id));
//       if (result.affected === 0) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       res.status(204).send();
//     } catch (error) {
//       res.status(500).json({ message: 'Error deleting user', error });
//     }
//   }
// }


import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Follow } from '../entities/Follow';
import { Post } from '../entities/Post';
import { Like } from '../entities/Like';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);
  private followRepository = AppDataSource.getRepository(Follow);
  private postRepository = AppDataSource.getRepository(Post);
  private likeRepository = AppDataSource.getRepository(Like);

  // =====================
  // USER CRUD
  // =====================

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userRepository.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users' });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOneBy({
        id: parseInt(req.params.id),
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = this.userRepository.create(req.body);
      const result = await this.userRepository.save(user);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOneBy({
        id: parseInt(req.params.id),
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      this.userRepository.merge(user, req.body);
      const result = await this.userRepository.save(user);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const result = await this.userRepository.delete(
        parseInt(req.params.id)
      );

      if (result.affected === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user' });
    }
  }

  // =====================
  // FOLLOWERS LIST API
  // GET /api/users/:id/followers
  // =====================

  async getFollowers(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const [follows, total] = await this.followRepository.findAndCount({
        where: { following: { id: userId } },
        relations: ['follower'],
        order: { createdAt: 'DESC' },
        skip: offset,
        take: limit,
      });

      const followers = follows.map((f) => ({
        id: f.follower.id,
        firstName: f.follower.firstName,
        lastName: f.follower.lastName,
        email: f.follower.email,
        followedAt: f.createdAt,
      }));

      res.json({
        total,
        followers,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching followers' });
    }
  }

  // =====================
  // USER ACTIVITY API
  // GET /api/users/:id/activity
  // =====================

  async getActivity(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const posts = await this.postRepository.find({
        where: { author: { id: userId } },
        order: { createdAt: 'DESC' },
      });

      const likes = await this.likeRepository.find({
        where: { user: { id: userId } },
        relations: ['post'],
        order: { createdAt: 'DESC' },
      });

      const follows = await this.followRepository.find({
        where: { follower: { id: userId } },
        relations: ['following'],
        order: { createdAt: 'DESC' },
      });

      const activities = [
        ...posts.map((p) => ({
          type: 'POST_CREATED',
          content: p.content,
          createdAt: p.createdAt,
        })),
        ...likes.map((l) => ({
          type: 'POST_LIKED',
          postId: l.post.id,
          createdAt: l.createdAt,
        })),
        ...follows.map((f) => ({
          type: 'FOLLOWED_USER',
          userId: f.following.id,
          createdAt: f.createdAt,
        })),
      ];

      activities.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

      res.json({
        total: activities.length,
        activities: activities.slice(offset, offset + limit),
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching activity' });
    }
  }
}
