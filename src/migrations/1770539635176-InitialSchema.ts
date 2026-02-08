import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1770539635176 implements MigrationInterface {
    name = 'InitialSchema1770539635176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" integer NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_65d5fbf616c25e628a12898e68" ON "posts" ("authorId", "createdAt") `);
        await queryRunner.query(`CREATE TABLE "likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "postId" integer NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_74b9b8cd79a1014e50135f266f" ON "likes" ("userId", "postId") `);
        await queryRunner.query(`CREATE TABLE "follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "followerId" integer NOT NULL, "followingId" integer NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_105079775692df1f8799ed0fac" ON "follows" ("followerId", "followingId") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar(255) NOT NULL, "lastName" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "hashtags" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "tag" varchar(100) NOT NULL, CONSTRAINT "UQ_0b4ef8e83392129fb3373fdb3af" UNIQUE ("tag"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0b4ef8e83392129fb3373fdb3a" ON "hashtags" ("tag") `);
        await queryRunner.query(`CREATE TABLE "post_hashtags" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "postId" integer NOT NULL, "hashtagId" integer NOT NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_50a352c8d6f5c550e88843e690" ON "post_hashtags" ("postId", "hashtagId") `);
        await queryRunner.query(`DROP INDEX "IDX_65d5fbf616c25e628a12898e68"`);
        await queryRunner.query(`CREATE TABLE "temporary_posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" integer NOT NULL, CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_posts"("id", "content", "createdAt", "updatedAt", "authorId") SELECT "id", "content", "createdAt", "updatedAt", "authorId" FROM "posts"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`ALTER TABLE "temporary_posts" RENAME TO "posts"`);
        await queryRunner.query(`CREATE INDEX "IDX_65d5fbf616c25e628a12898e68" ON "posts" ("authorId", "createdAt") `);
        await queryRunner.query(`DROP INDEX "IDX_74b9b8cd79a1014e50135f266f"`);
        await queryRunner.query(`CREATE TABLE "temporary_likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "postId" integer NOT NULL, CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_e2fe567ad8d305fefc918d44f50" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_likes"("id", "createdAt", "userId", "postId") SELECT "id", "createdAt", "userId", "postId" FROM "likes"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`ALTER TABLE "temporary_likes" RENAME TO "likes"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_74b9b8cd79a1014e50135f266f" ON "likes" ("userId", "postId") `);
        await queryRunner.query(`DROP INDEX "IDX_105079775692df1f8799ed0fac"`);
        await queryRunner.query(`CREATE TABLE "temporary_follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "followerId" integer NOT NULL, "followingId" integer NOT NULL, CONSTRAINT "FK_fdb91868b03a2040db408a53331" FOREIGN KEY ("followerId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_ef463dd9a2ce0d673350e36e0fb" FOREIGN KEY ("followingId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_follows"("id", "createdAt", "followerId", "followingId") SELECT "id", "createdAt", "followerId", "followingId" FROM "follows"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`ALTER TABLE "temporary_follows" RENAME TO "follows"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_105079775692df1f8799ed0fac" ON "follows" ("followerId", "followingId") `);
        await queryRunner.query(`DROP INDEX "IDX_50a352c8d6f5c550e88843e690"`);
        await queryRunner.query(`CREATE TABLE "temporary_post_hashtags" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "postId" integer NOT NULL, "hashtagId" integer NOT NULL, CONSTRAINT "FK_003e77538237089ff217a1cfe74" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_31c935be539e76295a7f1c632aa" FOREIGN KEY ("hashtagId") REFERENCES "hashtags" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_post_hashtags"("id", "postId", "hashtagId") SELECT "id", "postId", "hashtagId" FROM "post_hashtags"`);
        await queryRunner.query(`DROP TABLE "post_hashtags"`);
        await queryRunner.query(`ALTER TABLE "temporary_post_hashtags" RENAME TO "post_hashtags"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_50a352c8d6f5c550e88843e690" ON "post_hashtags" ("postId", "hashtagId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_50a352c8d6f5c550e88843e690"`);
        await queryRunner.query(`ALTER TABLE "post_hashtags" RENAME TO "temporary_post_hashtags"`);
        await queryRunner.query(`CREATE TABLE "post_hashtags" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "postId" integer NOT NULL, "hashtagId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "post_hashtags"("id", "postId", "hashtagId") SELECT "id", "postId", "hashtagId" FROM "temporary_post_hashtags"`);
        await queryRunner.query(`DROP TABLE "temporary_post_hashtags"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_50a352c8d6f5c550e88843e690" ON "post_hashtags" ("postId", "hashtagId") `);
        await queryRunner.query(`DROP INDEX "IDX_105079775692df1f8799ed0fac"`);
        await queryRunner.query(`ALTER TABLE "follows" RENAME TO "temporary_follows"`);
        await queryRunner.query(`CREATE TABLE "follows" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "followerId" integer NOT NULL, "followingId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "follows"("id", "createdAt", "followerId", "followingId") SELECT "id", "createdAt", "followerId", "followingId" FROM "temporary_follows"`);
        await queryRunner.query(`DROP TABLE "temporary_follows"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_105079775692df1f8799ed0fac" ON "follows" ("followerId", "followingId") `);
        await queryRunner.query(`DROP INDEX "IDX_74b9b8cd79a1014e50135f266f"`);
        await queryRunner.query(`ALTER TABLE "likes" RENAME TO "temporary_likes"`);
        await queryRunner.query(`CREATE TABLE "likes" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer NOT NULL, "postId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "likes"("id", "createdAt", "userId", "postId") SELECT "id", "createdAt", "userId", "postId" FROM "temporary_likes"`);
        await queryRunner.query(`DROP TABLE "temporary_likes"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_74b9b8cd79a1014e50135f266f" ON "likes" ("userId", "postId") `);
        await queryRunner.query(`DROP INDEX "IDX_65d5fbf616c25e628a12898e68"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME TO "temporary_posts"`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "authorId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "posts"("id", "content", "createdAt", "updatedAt", "authorId") SELECT "id", "content", "createdAt", "updatedAt", "authorId" FROM "temporary_posts"`);
        await queryRunner.query(`DROP TABLE "temporary_posts"`);
        await queryRunner.query(`CREATE INDEX "IDX_65d5fbf616c25e628a12898e68" ON "posts" ("authorId", "createdAt") `);
        await queryRunner.query(`DROP INDEX "IDX_50a352c8d6f5c550e88843e690"`);
        await queryRunner.query(`DROP TABLE "post_hashtags"`);
        await queryRunner.query(`DROP INDEX "IDX_0b4ef8e83392129fb3373fdb3a"`);
        await queryRunner.query(`DROP TABLE "hashtags"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "IDX_105079775692df1f8799ed0fac"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`DROP INDEX "IDX_74b9b8cd79a1014e50135f266f"`);
        await queryRunner.query(`DROP TABLE "likes"`);
        await queryRunner.query(`DROP INDEX "IDX_65d5fbf616c25e628a12898e68"`);
        await queryRunner.query(`DROP TABLE "posts"`);
    }

}
