import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';

@Entity('likes')
@Index(['user', 'post'], { unique: true })
export class Like {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToOne(() => Post, { nullable: false })
  post: Post;

  @CreateDateColumn()
  createdAt: Date;
}
