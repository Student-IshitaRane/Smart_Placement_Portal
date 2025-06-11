const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const { addUser } = require('../controllers/userController'); // ✅ Import controller

router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// router.post('/add', addUser);

// 🌐 Global leaderboard
router.get('/global', async (req, res) => {
  const users = await User.find().sort({ score: -1 });
  res.json(users);
});

// 💻 Leetcode leaderboard
router.get('/leetcode', async (req, res) => {
  const users = await User.find().sort({ leetcodeScore: -1 });
  res.json(users);
});

// 🧠 GFG leaderboard
router.get('/gfg', async (req, res) => {
  const users = await User.find().sort({ gfgScore: -1 });
  res.json(users);
});

// ⚔️ Codeforces leaderboard
router.get('/codeforces', async (req, res) => {
  const users = await User.find().sort({ codeforcesScore: -1 });
  res.json(users);
});

module.exports = router;
