import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const leaderboards = [
    {
      id: 'leetcode',
      title: 'LeetCode',
      path: '/leetcode',
      subtitle: 'Algorithm mastery tracker',
      icon: '/assets/leetcode-icon.png',
      accent: '#FFA116',
      background: '#FFF4D9', // Light Pastel Yellow
    },
    {
      id: 'codeforces',
      title: 'Codeforces',
      path: '/codeforces',
      subtitle: 'Competitive programming ranks',
      icon: '/assets/codeforces-icon.png',
      accent: '#3B5998',
      background: '#D3E1F4', // Light Pastel Blue
    },
    {
      id: 'gfg',
      title: 'GeeksforGeeks',
      path: '/gfg',
      subtitle: 'DSA practice leaderboard',
      icon: '/assets/gfg-icon.png',
      accent: '#2F8D46',
      background: '#D9F7E6', // Light Pastel Green
    },
    {
      id: 'aceboard',
      title: 'Aceboard',
      path: '/aceboard',
      subtitle: 'Overall coding performance',
      icon: '/assets/aceboard-icon.png',
      accent: '#6C5CE7',
      background: '#D9D2FF', // Light Pastel Purple
    },
  ];

  return (
    <div className="home-container">
      
      <div className="nav-logo">
        <img src="/assets/CumminsLogo.png" alt="Cummins College Logo" className="cummins-logo" style={{ width: '80px', height: 'auto' }} />
      </div>
      
      <header className="home-header">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="playful-heading"
        >
          Choose Your Coding Arena
        </motion.h1>
        <motion.p 
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Track your progress against peers
        </motion.p>
      </header>

      <div className="leaderboards-grid">
        {leaderboards.map((board, index) => (
          <Link 
            key={board.id} 
            to={board.path} 
            className="leaderboard-link"
          >
            <motion.div
              className="leaderboard-card"
              style={{ 
                '--card-accent': board.accent, 
                '--card-background': board.background 
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ 
                rotate: 2,
                scale: 1.05,
                transition: { type: 'spring', stiffness: 300 },
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}
            >
              <div className="card-icon-container">
                <img 
                  src={board.icon} 
                  alt={board.title} 
                  className="card-icon"
                  loading="lazy"
                />
              </div>
              <h3>{board.title}</h3>
              <p>{board.subtitle}</p>
              {/* The rank text is now "Let's Go" */}
              <div className="rank-badge" style={{ backgroundColor: board.accent }}>
                Let's Go
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="dynamic-footer">
        <p>Compare your progress and climb the ranks</p>
      </div>
    </div>
  );
};

export default Home;