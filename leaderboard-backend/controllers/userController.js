const User = require('../models/User');
const calculateScore = require('../utils/calculateScore');

// User registration logic
const addUser = async (req, res) => {
  try {
    console.log("📥 Controller addUser hit");
    const { name, rollNo, email, phone, year, branch, cgpa, leetcodeId, gfgId, codeforcesId, dob, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const { totalScore, leetcodeScore, gfgScore, codeforcesScore } = await calculateScore(leetcodeId, gfgId, codeforcesId);

    const newUser = new User({
      name,
      rollNo,
      email,
      phone,
      year,
      branch,
      cgpa,
      leetcodeId,
      gfgId,
      codeforcesId,
      dob,
      score: totalScore,
      leetcodeScore,
      gfgScore,
      codeforcesScore,
      password 
    });

    await newUser.save();

    res.json({
      message: '✅ User added with real score!',
      user: newUser
    });
  } catch (err) {
    console.error('❌ Error in addUser:', err);
    res.status(500).json({ message: 'Failed to add user' });
  }
};

// User login logic (Password ignored — only email check)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // ⚠️ Skipping password validation — only checking if email exists
    // Password is just for appearance

    res.json({
      message: '✅ Login successful!',
      user: {
        _id: user._id,
        name: user.name,
        rollNo: user.rollNo,
        email: user.email,
        score: user.score
      }
    });
  } catch (err) {
    console.error('❌ Error in loginUser:', err);
    res.status(500).json({ message: 'Login failed' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};





module.exports = { addUser, loginUser, getAllUsers};