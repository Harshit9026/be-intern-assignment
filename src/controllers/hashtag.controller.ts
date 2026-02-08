import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Hashtag } from '../entities/Hashtag';
import { Post } from '../entities/Post';
import { PostHashtag } from '../entities/PostHashtag';

export class HashtagController {
  private hashtagRepo = AppDataSource.getRepository(Hashtag);
  private postRepo = AppDataSource.getRepository(Post);
  private postHashtagRepo = AppDataSource.getRepository(PostHashtag);

  async addHashtagsToPost(req: Request, res: Response) {
    try {
      const { postId, tags } = req.body; 

      const post = await this.postRepo.findOneBy({ id: postId });
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const created = [];

      for (const rawTag of tags) {
        const tag = rawTag.toLowerCase();

        let hashtag = await this.hashtagRepo.findOneBy({ tag });
        if (!hashtag) {
          hashtag = await this.hashtagRepo.save(
            this.hashtagRepo.create({ tag })
          );
        }

        const link = this.postHashtagRepo.create({
          post,
          hashtag,
        });

        await this.postHashtagRepo.save(link);
        created.push(tag);
      }

      res.status(201).json({ postId, tags: created });
    } catch (error) {
      res.status(500).json({ message: ' added hashtags' });
    }
  }

  async getPostsByHashtag(req: Request, res: Response) {
    try {
      const tag = req.params.tag.toLowerCase();
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const posts = await this.postHashtagRepo
        .createQueryBuilder('ph')
        .leftJoinAndSelect('ph.post', 'post')
        .leftJoinAndSelect('post.author', 'author')
        .leftJoin('ph.hashtag', 'hashtag')
        .where('hashtag.tag = :tag', { tag })
        .orderBy('post.createdAt', 'DESC')
        .skip(offset)
        .take(limit)
        .getMany();

      res.json(
        posts.map((p) => ({
          id: p.post.id,
          content: p.post.content,
          author: p.post.author,
        }))
      );
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts by hashtag' });
    }
  }
}
