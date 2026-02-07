// import { DataSource } from 'typeorm';

// export const AppDataSource = new DataSource({
//   type: 'sqlite',
//   database: 'database.sqlite',
//   synchronize: false, // Do not use synchronize, write migrations instead
//   logging: true,
//   entities: ['src/entities/**/*.ts'],
//   subscribers: [],
//   migrations: ['src/migrations/**/*.ts'],
// });

import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Post } from './entities/Post';
import { Follow } from './entities/Follow';
import { Like } from './entities/Like';
import { Hashtag } from './entities/Hashtag';
import { PostHashtag } from './entities/PostHashtag';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: true,
  entities: [
    User,
    Post,
    Follow,
    Like,
    Hashtag,
    PostHashtag,
  ],
  migrations: ['src/migrations/**/*.ts'],
});
