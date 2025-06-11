const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("📡 Already connected to MongoDB");
      return;
    }
    
    await mongoose.connect('mongodb://localhost:27017/leaderboardApp', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("📡 Connected to MongoDB");
  } catch (err) {
    console.log('❌ MongoDB connection failed:', err);
    process.exit(1); // Exit the process if unable to connect
  }
};

module.exports = connectDB;
