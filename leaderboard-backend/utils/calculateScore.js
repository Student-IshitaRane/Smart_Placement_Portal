const axios = require('axios');
const cheerio = require('cheerio');
const { normalizeCodeforces, normalizeGFG, normalizeLeetcode } = require('../utils/normalize');

const getLeetCodeStats = async (username) => {
  const url = "https://leetcode.com/graphql";
  const headers = {
    "Content-Type": "application/json",
    "Referer": `https://leetcode.com/${username}/`,
    "User-Agent": "Mozilla/5.0"
  };

  const query = {
    query: `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }`,
    variables: { username }
  };

  try {
    const response = await axios.post(url, query, { headers });
    const submissions = response.data.data.matchedUser.submitStats.acSubmissionNum;
    
    const stats = {};
    submissions.forEach(item => {
      stats[item.difficulty.toLowerCase()] = item.count;
    });
    
    return {
      easySolved: stats.easy || 0,
      mediumSolved: stats.medium || 0,
      hardSolved: stats.hard || 0
    };
  } catch (err) {
    console.error("LeetCode API Error:", err.message);
    return null;
  }
};

const calculateScore = async (leetcodeUsername, gfg, codeforces) => {
  let totalScore = 0;
  let leetcodeScore = 0;
  let gfgScore = 0;
  let codeforcesScore = 0;

  // LeetCode Calculation
  try {
    const leetcodeStats = await getLeetCodeStats(leetcodeUsername);
    if (leetcodeStats) {
      const { easySolved, mediumSolved, hardSolved } = leetcodeStats;
      leetcodeScore = normalizeLeetcode(
        easySolved,
        mediumSolved,
        hardSolved
      );
      totalScore += leetcodeScore;
      console.log(`✅ LeetCode: ${leetcodeScore}`);
    }
  } catch (err) {
    console.log(`❌ LeetCode failed for ${leetcodeUsername}`);
  }

  // Rest of your existing code for GFG and Codeforces...
  try {
    const res = await axios.get(`https://codeforces.com/api/user.info?handles=${codeforces}`);
    const rating = res.data.result[0].rating || 0;
    codeforcesScore = normalizeCodeforces(rating);
    totalScore += codeforcesScore;
    console.log(`✅ Codeforces: ${codeforcesScore}`);
  } catch (err) {
    console.log(`❌ Codeforces failed for ${codeforces}`);
  }

  try {
    const { data } = await axios.get(`https://auth.geeksforgeeks.org/user/${gfg}/profile`);
    const $ = cheerio.load(data);
    const scoreText = $('.scoreCard_head_left--score__oSi_x').first().text().trim();
    const gfgRaw = parseInt(scoreText) || 0;
    gfgScore = normalizeGFG(gfgRaw);
    totalScore += gfgScore;
    console.log(`✅ GFG: ${gfgScore}`);
  } catch (err) {
    console.log(`❌ GFG failed for ${gfg}`);
  }

  return {
    totalScore,
    leetcodeScore,
    gfgScore,
    codeforcesScore
  };
};

module.exports = calculateScore;