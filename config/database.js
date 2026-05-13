const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/lab9_blog',
      { serverSelectionTimeoutMS: 5000 }
    );

    console.log(`MongoDB підключено: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Помилка підключення до MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
