# Backend Design Document

## Overview
This project implements the backend for a social media platform supporting users, posts, likes, follows, and hashtags.  
The system is designed with a clean relational data model, RESTful APIs, pagination, and indexing to ensure performance and scalability.

---

## Database Schema & Relationships

### User
- Represents a platform user.
- Fields: `id`, `firstName`, `lastName`, `email`, `createdAt`, `updatedAt`
- One user can:
  - Create many posts
  - Like many posts
  - Follow many users
  - Be followed by many users

### Post
- Represents a user-created post.
- Fields: `id`, `content`, `createdAt`, `updatedAt`
- Relationships:
  - Many-to-One with User (author)
  - One-to-Many with Like
  - Many-to-Many with Hashtag (via PostHashtag)

### Follow
- Represents a follow relationship between two users.
- Fields: `id`, `createdAt`
- Relationships:
  - Many-to-One with User (follower)
  - Many-to-One with User (following)

### Like
- Represents a like on a post by a user.
- Fields: `id`, `createdAt`
- Relationships:
  - Many-to-One with User
  - Many-to-One with Post

### Hashtag
- Represents a hashtag.
- Fields: `id`, `tag`
- Stored in lowercase to support case-insensitive search.

### PostHashtag
- Junction table between Post and Hashtag.
- Fields: `id`
- Relationships:
  - Many-to-One with Post
  - Many-to-One with Hashtag

---

## Indexing Strategy

Indexes are used to optimize read-heavy queries:

- **Users**
  - Unique index on `email` to prevent duplicates

- **Follows**
  - Composite unique index on `(follower, following)`  
    Prevents duplicate follow relationships and speeds up follower queries

- **Likes**
  - Composite unique index on `(user, post)`  
    Prevents duplicate likes and enables fast like checks

- **Hashtags**
  - Index on `tag`  
    Enables fast hashtag-based searches

These indexes significantly improve performance for feed generation, follower listing, and hashtag searches.

---

## API Design Considerations

- RESTful endpoints are used for all entities.
- Pagination (`limit`, `offset`) is implemented on:
  - Feed
  - Followers list
  - Activity history
  - Hashtag search
- Sorting is done at the database level for efficiency.

---

## Feed Generation Strategy

The feed endpoint:
1. Fetches users followed by the current user.
2. Retrieves posts authored by those users.
3. Aggregates:
   - Like counts
   - Hashtags
4. Sorts posts by creation time (newest first).
5. Applies pagination.

This approach minimizes unnecessary data loading and keeps queries efficient.

---

## User Activity Tracking

User activity includes:
- Posts created
- Posts liked
- Users followed

Activities are merged into a single timeline and sorted chronologically to provide a unified activity history.

---

## Scalability Considerations

- Pagination prevents large payloads.
- Indexed queries ensure fast lookups as data grows.
- QueryBuilder is used for complex queries to optimize SQL execution.
- The architecture supports future enhancements such as:
  - Redis caching for feed data
  - Read replicas for heavy read traffic
  - Background jobs for analytics

---

## Summary

This backend is designed to be:
- Modular
- Scalable
- Efficient
- Easy to extend

All core features required for a social media platform are implemented with performance and maintainability in mind.
