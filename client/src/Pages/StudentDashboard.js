import React, { useState } from 'react';
import { 
  FiSearch, 
  FiBell, 
  FiUser, 
  FiFilter, 
  FiBookmark,
  FiBriefcase,
  FiCheckCircle,
  FiTrendingUp
} from 'react-icons/fi';
import CompanyList from '../components/CompanyList';
import './StudentDashboard.scss';

const StudentDashboard = ({ studentId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('recommended');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleApplicationSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="student-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <h1>CareerBridge</h1>
          </div>
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search internships, jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="header-actions">
            <button className="notification-btn">
              <FiBell />
              <span className="badge">3</span>
            </button>
            <div className="user-avatar">
              <FiUser />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Success Toast */}
        {showSuccess && (
          <div className="success-toast">
            <FiCheckCircle className="icon" />
            <p>Application submitted successfully!</p>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab ${activeTab === 'recommended' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommended')}
          >
            <FiBriefcase className="tab-icon" />
            Recommended
          </button>
          <button
            className={`tab ${activeTab === 'applied' ? 'active' : ''}`}
            onClick={() => setActiveTab('applied')}
          >
            <FiCheckCircle className="tab-icon" />
            My Applications
          </button>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <div className="filter-group">
            <FiFilter className="filter-icon" />
            <select>
              <option>All Industries</option>
              <option>Technology</option>
              <option>Business</option>
            </select>
          </div>
          <div className="filter-group">
            <FiTrendingUp className="sort-icon" />
            <select>
              <option>Sort by: Newest</option>
              <option>Sort by: Deadline</option>
            </select>
          </div>
        </div>

        {/* Opportunity List */}
        <CompanyList
          studentId={studentId}
          onSuccess={handleApplicationSuccess}
          filter={activeTab}
        />
      </main>
    </div>
  );
};

export default StudentDashboard;