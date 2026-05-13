require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const ApiError = require('./errors/ApiError');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Lab 9 API',
    endpoints: {
      auth: '/api/auth/register',
      posts: '/api/posts',
      comments: '/api/comments'
    }
  });
});

app.use((req, res, next) => {
  next(ApiError.notFound('Маршрут не знайдено'));
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Сервер запущено на порту ${PORT}`);
    });
  } catch (error) {
    console.error('Не вдалося запустити сервер:', error.message);
    process.exit(1);
  }
};

startServer();
