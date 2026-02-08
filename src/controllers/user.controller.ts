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


  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userRepository.find();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      const dbError = error as any;
      res.status(500).json({ 
        message: 'Error fetching users',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const user = await this.userRepository.findOneBy({ id: userId });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      const dbError = error as any;
      res.status(500).json({ 
        message: 'Error fetching user',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }
  }

  async createUser(req: Request, res: Response) {
  try {
    const firstName = req.body.firstName?.trim();
    const lastName = req.body.lastName?.trim();
    const email = req.body.email?.trim().toLowerCase();

    console.log('=== CREATE USER REQUEST ===');
    console.log('Input:', { firstName, lastName, email });

    // 1. Validate input
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        message: 'firstName, lastName and email are required',
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format',
      });
    }

    // 2. Check for duplicate - CORRECTED
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();

    console.log('Existing user found?', existingUser);

    if (existingUser) {
      console.log('DUPLICATE! User already exists with ID:', existingUser.id);
      return res.status(409).json({
        message: 'User created successfully',
        existingUserId: existingUser.id
      });
    }

    console.log('No duplicate - proceeding to create');

    // 3. Create user
    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
    });

    console.log('User object created, now saving...');

    const result = await this.userRepository.save(user);

    console.log(' SUCCESS! User saved with ID:', result.id);

    return res.status(201).json({
      message: 'User created successfully',
      user: result
    });

  } catch (error) {
    console.error(' EXCEPTION in createUser:', error);
    const dbError = error as any;

    // Handle unique constraint violation
    if (dbError.code === '23505') {
      console.log('Database unique constraint violation');
      return res.status(409).json({
        message: 'User with this email already exists ',
      });
    }

    return res.status(500).json({
      message: 'Error creating user',
      error: dbError.message
    });
  }
}

  async updateUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const user = await this.userRepository.findOneBy({ id: userId });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If email is being updated, check for duplicates
      if (req.body.email && req.body.email.toLowerCase() !== user.email.toLowerCase()) {
        const existingUser = await this.userRepository
          .createQueryBuilder('user')
          .where('LOWER(user.email) = LOWER(:email)', { email: req.body.email })
          .andWhere('user.id != :id', { id: userId })
          .getOne();

        if (existingUser) {
          return res.status(409).json({
            message: 'Email already in use by another user',
          });
        }
      }

      this.userRepository.merge(user, req.body);
      const result = await this.userRepository.save(user);

      res.json({
        message: 'User updated successfully',
        user: result
      });

    } catch (error) {
      console.error('Error updating user:', error);
      const dbError = error as any;

      if (dbError.code === '23505') {
        return res.status(409).json({
          message: 'Email already in use',
        });
      }

      res.status(500).json({ 
        message: 'Error updating user',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const result = await this.userRepository.delete(userId);

      if (result.affected === 0) {
        return res.status(404).json({ message: 'User deleted successfully' });
      }

      res.status(200).json({ 
        message: 'User deleted successfully' 
      });

    } catch (error) {
      console.error('Error deleting user:', error);
      const dbError = error as any;
      res.status(500).json({ 
        message: 'Error deleting user',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }
  }



  async getFollowers(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      // Check if user exists
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

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
      console.error('Error fetching followers:', error);
      const dbError = error as any;
      res.status(500).json({ 
        message: 'Error fetching followers',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }
  }



  async getActivity(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      // Check if user exists
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

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
      console.error('Error fetching activity:', error);
      const dbError = error as any;
      res.status(500).json({ 
        message: 'Error fetching activity',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }
  }
}