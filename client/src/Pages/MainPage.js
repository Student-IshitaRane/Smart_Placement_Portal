import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
  const studentId = localStorage.getItem('studentId');

  const features = [
    {
      title: 'Leaderboard',
      subtext: 'Track Student Rankings',
      color: '#cce5ff',
      to: '/leaderboard',
    },
    {
      title: 'Opportunity Hub',
      subtext: 'Apply for internships, jobs',
      color: '#ffe0b2',
      to: '/student',
    },
    {
      title: 'Application History',
      subtext: 'View Past Applications',
      color: '#f8d7da',
      to: `/student/history/${studentId}`,
    },
    {
      title: 'Notice Board',
      subtext: 'Stay Updated Always',
      color: '#e2e3ff',
      to: '/StudentNoticeBoard',
    },
    {
      title: 'Past Recruitments',
      subtext: 'Consistent top recruiters',
      color: '#d4edda',
      to: '/CompaniesList',
    },
    {
      title: 'More',
      subtext: 'Extra Features Coming Soon',
      color: '#fce5cd',
      to: '#',
    }
  ];

  return (
    <div className="main-layout">
      {/* Navigation Header with Logo + Options */}
      <div className="nav-bar">
        <div className="nav-logo">
          <img src="/assets/CumminsLogo.png" alt="Cummins College Logo" className="cummins-logo" />
        </div>
        <div className="nav-right">
          <Link to="/profile" className="nav-option">Profile</Link>
          <Link to="/settings" className="nav-option">Settings</Link>
          <Link to="/notifications" className="nav-option">Notifications</Link>
        </div>
      </div>

      {/* Main Section */}
      <div className="main-row">
        <div className="main-left-inline">
          <h1>
            <span style={{ color: '#255085' }}>Launch</span>{' '}
            <span style={{ color: '#383838' }}>Your Career</span>
          </h1>
          <p className="career-text">Cummins College. Career Mode: ON.</p>
          <img
            src="/assets/AuthPageImage.png"
            alt="Coder Girl"
            className="main-image-large"
          />
        </div>

        <div className="right-feature-grid">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.to}
              className="feature-box-inline"
              style={{ backgroundColor: feature.color }}
            >
              <h3>{feature.title}</h3>
              <p>{feature.subtext}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;