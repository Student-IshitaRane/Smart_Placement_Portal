const connectDB = require('../config/db');
const User = require('../models/User');
const calculateScore = require('../utils/calculateScore');

const updateScores = async () => {
  await connectDB();
  const users = await User.find();

  if (users.length === 0) {
    console.log("❌ No users found.");
    return;
  }

  for (let user of users) {
    const {
      totalScore,
      leetcodeScore,
      gfgScore,
      codeforcesScore
    } = await calculateScore(user.leetcodeId, user.gfgId, user.codeforcesId);

    user.score = totalScore;
    user.leetcodeScore = leetcodeScore;
    user.gfgScore = gfgScore;
    user.codeforcesScore = codeforcesScore;

    try {
      await user.save();
      console.log(`✅ Updated ${user.name} with score ${totalScore}`);
    } catch (err) {
      console.log(`❌ Failed to save ${user.name}`, err);
    }
  }
};

updateScores();
