require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const AppError = require('./utils/AppError');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5500',
  'http://127.0.0.1:5500'
];

 app.use(cors({
   origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
       return callback(null, true);
     }

    return callback(new Error(`CORS: origin ${origin} не дозволено`));
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbOk = mongoose.connection.readyState === 1;
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? 'ok' : 'error',
    db: dbOk ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()) + 's',
    env: process.env.NODE_ENV
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API онлайн-магазину для лабораторної роботи 15',
    endpoints: {
      register: '/api/auth/register',
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      me: '/api/auth/me',
      products: '/api/products',
      reviews: '/api/products/:productId/reviews'
    }
  });
});

app.use((req, res, next) => {
  next(new AppError(`Маршрут ${req.originalUrl} не знайдено`, 404));
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
