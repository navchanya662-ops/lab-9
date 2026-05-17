require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const AppError = require('./utils/AppError');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API онлайн-магазину для лабораторної роботи 13',
    endpoints: {
      client: '/index.html',
      register: '/api/auth/register',
      login: '/api/auth/login',
      me: '/api/auth/me',
      products: '/api/products'
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
