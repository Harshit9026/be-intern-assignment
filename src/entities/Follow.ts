import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { User } from './User';

@Entity('follows')
@Index(['follower', 'following'], { unique: true })
export class Follow {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // user who follows
  @ManyToOne(() => User, { nullable: false })
  follower: User;

  // user being followed
  @ManyToOne(() => User, { nullable: false })
  following: User;

  @CreateDateColumn()
  createdAt: Date;
}
