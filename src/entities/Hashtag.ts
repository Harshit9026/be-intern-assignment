import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,  
  Index,
} from 'typeorm';
import { PostHashtag } from './PostHashtag';  // ADD THIS

@Entity('hashtags')
export class Hashtag {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  tag: string;

  // ADD THIS RELATIONSHIP
  @OneToMany(() => PostHashtag, (postHashtag) => postHashtag.hashtag)
  postHashtags: PostHashtag[];
}