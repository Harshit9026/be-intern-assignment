import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { Follow } from '../entities/Follow';
import { Like } from '../entities/Like';
import { PostHashtag } from '../entities/PostHashtag';

export class FeedController {
  async getFeed(req: Request, res: Response) {
    try {
      const userId = parseInt(req.query.userId as string);
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      console.log('Feed request - userId:', userId, 'limit:', limit, 'offset:', offset);

      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }

     /* Get users that current user follows */
      const followRepo = AppDataSource.getRepository(Follow);
      const follows = await followRepo.find({
        where: { follower: { id: userId } },
        relations: ['following'],
      });

      const followingIds = follows.map((f) => f.following.id);
      console.log('Following IDs:', followingIds);

      /** If user follows no one, return empty feed */
      if (followingIds.length === 0) {
        console.log('User follows no one, returning empty feed');
        return res.json([]);
      }

      /**  Get posts from followed users */
      const postRepo = AppDataSource.getRepository(Post);
      const posts = await postRepo
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.author', 'author')
        .where('author.id IN (:...ids)', { ids: followingIds })
        .orderBy('post.createdAt', 'DESC')
        .skip(offset)
        .take(limit)
        .getMany();

      console.log('Posts found:', posts.length);

      if (posts.length === 0) {
        console.log('No posts found, returning empty feed');
        return res.json([]);
      }

      const postIds = posts.map((p) => p.id);
      console.log('Post IDs:', postIds);

      /* Get like counts */
      const likeRepo = AppDataSource.getRepository(Like);
      const likeCounts = await likeRepo
        .createQueryBuilder('like')
        .select('like.postId', 'postId')
        .addSelect('COUNT(like.id)', 'count')
        .where('like.postId IN (:...ids)', { ids: postIds })
        .groupBy('like.postId')
        .getRawMany();

      console.log('Like counts raw data:', likeCounts);

      const likeMap = new Map<number, number>();
      likeCounts.forEach((l) => {
        const postId = Number(l.postId);
        const count = Number(l.count);
        likeMap.set(postId, count);
        console.log(`Post ${postId} has ${count} likes`);
      });

      /* Get hashtags */
      const postHashtagRepo = AppDataSource.getRepository(PostHashtag);
      const hashtags = await postHashtagRepo
        .createQueryBuilder('ph')
        .innerJoinAndSelect('ph.post', 'post')
        .innerJoinAndSelect('ph.hashtag', 'hashtag')
        .where('post.id IN (:...ids)', { ids: postIds })
        .getMany();

      console.log('Hashtags found:', hashtags.length);

      const tagMap = new Map<number, string[]>();
      hashtags.forEach((h) => {
        if (!h.post || !h.hashtag) {
          console.log('Warning: Missing post or hashtag relation', h);
          return;
        }
        const arr = tagMap.get(h.post.id) || [];
        arr.push(h.hashtag.tag);
        tagMap.set(h.post.id, arr);
      });

      console.log('Hashtag map:', Array.from(tagMap.entries()));

      /* Build final response */
      const response = posts.map((p) => ({
        id: p.id,
        content: p.content,
        author: {
          id: p.author.id,
          firstName: p.author.firstName,
          lastName: p.author.lastName,
          email: p.author.email,
        },
        likeCount: likeMap.get(p.id) || 0,
        hashtags: tagMap.get(p.id) || [],
        createdAt: p.createdAt,
      }));

      console.log('Final response length:', response.length);
      console.log('Sample response:', JSON.stringify(response[0], null, 2));

      return res.json(response);
    } catch (error) {
      console.error('Error in getFeed:', error);
      const dbError = error as any;
      return res.status(500).json({ 
        message: 'Error fetching feed',
        error: dbError.message || 'Unknown error'
      });
    }
  }
}