const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cron = require('node-cron');
const updateScores = require('./scripts/updateScores');  // Make sure the path is correct
const applicationRoutes = require('./routes/applicationRoutes');  // <-- add this
const userRoutes = require('./routes/userRoutes'); // ✅ new import

// Use 'require' for importing routes
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const companyRoutes = require('./routes/companyRoutes');  // Routes for company management
const adminRoutes = require('./routes/adminRoutes');
const { createNotice, getNotices } = require('./controllers/noticeControllers');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use('/leaderboard', leaderboardRoutes);  // Existing leaderboard routes
app.use('/api/companies', companyRoutes);  // New company routes for admin and student
app.use('/api/applications', applicationRoutes);  // <-- add this below your companies route
app.use('/api/users', userRoutes);  // ✅ New user routes for registration and login

app.get('/notices', getNotices);
app.post('/notices', createNotice);
app.use('/api/studentList', userRoutes);
app.use('/', adminRoutes);

// Schedule to run updateScores.js every hour
cron.schedule('0 * * * *', () => {
  console.log('⏰ Running updateScores.js every hour...');
  updateScores();  // Automatically call the function to update scores
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
