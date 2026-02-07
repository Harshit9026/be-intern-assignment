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

      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }

      /** 1️⃣ Get users that current user follows */
      const followRepo = AppDataSource.getRepository(Follow);
      const follows = await followRepo.find({
        where: { follower: { id: userId } },
        relations: ['following'],
      });

      const followingIds = follows.map((f) => f.following.id);

      /** ✅ FIX 1: If user follows no one, return empty feed */
      if (followingIds.length === 0) {
        return res.json([]);
      }

      /** 2️⃣ Get posts from followed users */
      const postRepo = AppDataSource.getRepository(Post);
      const posts = await postRepo
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.author', 'author')
        .where('author.id IN (:...ids)', { ids: followingIds }) // ✅ FIX 2
        .orderBy('post.createdAt', 'DESC')
        .skip(offset)
        .take(limit)
        .getMany();

      if (posts.length === 0) {
        return res.json([]);
      }

      const postIds = posts.map((p) => p.id);

      /** 3️⃣ Get like counts */
      const likeRepo = AppDataSource.getRepository(Like);
      const likeCounts = await likeRepo
        .createQueryBuilder('like')
        .select('like.postId', 'postId')
        .addSelect('COUNT(*)', 'count')
        .where('like.postId IN (:...ids)', { ids: postIds })
        .groupBy('like.postId')
        .getRawMany();

      const likeMap = new Map<number, number>();
      likeCounts.forEach((l) =>
        likeMap.set(Number(l.postId), Number(l.count))
      );

      /** 4️⃣ Get hashtags */
      const postHashtagRepo = AppDataSource.getRepository(PostHashtag);
      const hashtags = await postHashtagRepo
        .createQueryBuilder('ph')
        .leftJoinAndSelect('ph.post', 'post')      // ✅ FIX 3
        .leftJoinAndSelect('ph.hashtag', 'hashtag')
        .where('post.id IN (:...ids)', { ids: postIds })
        .getMany();

      const tagMap = new Map<number, string[]>();
      hashtags.forEach((h) => {
        const arr = tagMap.get(h.post.id) || [];
        arr.push(h.hashtag.tag);
        tagMap.set(h.post.id, arr);
      });

      /** 5️⃣ Build final response */
      const response = posts.map((p) => ({
        id: p.id,
        content: p.content,
        author: p.author,
        likeCount: likeMap.get(p.id) || 0,
        hashtags: tagMap.get(p.id) || [],
        createdAt: p.createdAt,
      }));

      return res.json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching feed' });
    }
  }
}
