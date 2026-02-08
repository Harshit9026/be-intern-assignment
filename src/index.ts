import express from 'express';
import dotenv from 'dotenv';
import { userRouter } from './routes/user.routes';
import { AppDataSource } from './data-source';
import { postRoutes } from './routes/post.routes';
import followRoutes from './routes/follow.routes';
import likeRoutes from './routes/like.routes';
import hashtagRoutes from './routes/hashtag.routes';
import feedRoutes from './routes/feed.routes';

dotenv.config();

const app = express();

// Body parser middleware (BEFORE routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

// Initialize Database
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the Social Media Platform API! Server is running successfully.',
    status: 'OK'
  });
});

//  API Routes
app.use('/api/users', userRouter);
app.use('/api/posts', postRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/hashtags', hashtagRoutes); // 
app.use('/api/feed', feedRoutes);

//  404 Handler (AFTER all routes)
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path 
  });
});

//  Global Error Handler (MUST be last - sends JSON only, NO HTML)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  // Prevent sending HTML error pages
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;