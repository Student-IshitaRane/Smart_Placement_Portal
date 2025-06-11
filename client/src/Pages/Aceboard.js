import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Aceboard.css';

const Aceboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
  fetch('http://localhost:5000/leaderboard/global')
    .then(response => response.json())
    .then(data => {
      // Sort descending by score
      const sortedData = data
        .slice()
        .sort((a, b) => (b.score || 0) - (a.score || 0));

      // Rank assignment with medals
      const medals = ['🥇', '🥈', '🥉'];

      const rankedData = sortedData.reduce((acc, user, index) => {
        const last = acc[acc.length - 1];
        const rank = last && last.score === (user.score || 0)
          ? last.rank // Same rank if score matches
          : (last ? last.rank + 1 : 1);

        const medal = rank <= 3 ? medals[rank - 1] : null;

        acc.push({ ...user, rank, medal });
        return acc;
      }, []);

      setLeaderboardData(rankedData);
    });
}, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = leaderboardData
    .filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.rank.toString().includes(searchQuery)
    );

  return (
    <div className="aceboard-container">
      <div className="aceboard-content">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="aceboard-header"
        >
          <div className="aceboard-header-content">
            <h1 className="aceboard-title">
              <span className="aceboard-logo">AB</span>
              Aceboard Leaderboard
            </h1>
            <p className="aceboard-subtitle">Track your overall performance against peers</p>
          </div>
          <div className="aceboard-stats">
            <div className="stat-card">
              <div className="stat-value">{leaderboardData.length}</div>
              <div className="stat-label">Participants</div>
            </div>
          </div>
        </motion.div>

        <div className="search-controls">
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name or rank..."
              className="search-input"
            />
          </div>
        </div>

        <div className="table-wrapper">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="leaderboard-card"
          >
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th className="rank-header">Rank</th>
                  <th className="name-header">Name</th>
                  <th className="score-header">Score</th>
                  <th className="year-header">Year</th>
                  <th className="branch-header">Branch</th>
                  <th className="cgpa-header">CGPA</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((user) => (
                  <motion.tr
                    key={user._id}
                    className={`user-row ${user.rank <= 3 ? `top-${user.rank}` : ''}`}
                    whileHover={{
                      backgroundColor: 'rgba(137, 107, 255, 0.05)',
                      transition: { duration: 0.2 }
                    }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <td className="rank-cell">
                      <div className="rank-badge">
                        {user.medal ? (
                          <div className={`medal medal-${user.rank}`}>
                            {user.medal}
                          </div>
                        ) : (
                          user.rank
                        )}
                      </div>
                    </td>
                    <td className="name-cell">
                      <div className="user-info">
                        <span className="user-name">{user.name}</span>
                        {user.isVerified && (
                          <span className="verified-badge" title="Verified">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="score-cell">
                      <div className="score-value">
                        {user.score || 0}
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${Math.min(100, (user.score || 0) / 500 * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="year-cell">Year {user.year}</td>
                    <td className="branch-cell">{user.branch}</td>
                    <td className="cgpa-cell">
                      <div className="cgpa-badge">
                        {user.cgpa || 0}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredData.length === 0 && (
              <div className="empty-state">
                <svg className="empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.172 16.242L12 13.414L14.828 16.242L16.242 14.828L13.414 12L16.242 9.172L14.828 7.758L12 10.586L9.172 7.758L7.758 9.172L10.586 12L7.758 14.828L9.172 16.242ZM12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22Z" fill="currentColor"/>
                </svg>
                <h3>No results found</h3>
                <p>Try adjusting your search query</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Aceboard;