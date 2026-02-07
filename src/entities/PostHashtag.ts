import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Post } from './Post';
import { Hashtag } from './Hashtag';

@Entity('post_hashtags')
@Index(['post', 'hashtag'], { unique: true })
export class PostHashtag {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Post, { nullable: false })
  post: Post;

  @ManyToOne(() => Hashtag, { nullable: false })
  hashtag: Hashtag;
}
