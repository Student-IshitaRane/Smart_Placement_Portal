function normalizeCodeforces(rating) {
  const maxRating = 3500;
  return Math.min((rating / maxRating) * 100, 100);
}

function normalizeGFG(score) {
  const maxScore = 1000;
  return score;
}

function normalizeLeetcode(easySolved, mediumSolved, hardSolved) {
  // Updated problem counts (as of current LeetCode)
  const maxEasy = 100, maxMedium = 100, maxHard = 75;

  // Weights for easy, medium, and hard problems
  const easyWeight = 1;
  const mediumWeight = 2;
  const hardWeight = 3;

  // Calculate weighted score
  const weightedScore = (easySolved * easyWeight) + 
                       (mediumSolved * mediumWeight) + 
                       (hardSolved * hardWeight);

  // Calculate maximum possible score
  const maxScore = (maxEasy * easyWeight) + 
                  (maxMedium * mediumWeight) + 
                  (maxHard * hardWeight);

  // Normalize to percentage
  const normalizedScore = (weightedScore / maxScore) * 100;

  return Math.min(normalizedScore, 100);
}

module.exports = {
  normalizeCodeforces,
  normalizeGFG,
  normalizeLeetcode
};