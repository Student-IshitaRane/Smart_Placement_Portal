// AdminMainPage.js (unchanged from previous version)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminMainPage.css';

const AdminMainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <h1 className="admin-title">Admin Dashboard</h1>
          <div className="admin-account">
            <span className="account-name">Admin User</span>
            <div className="account-avatar">AU</div>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="welcome-section">
          <h2>Welcome back, Admin</h2>
          <p className="welcome-message">Manage your platform efficiently with these quick actions</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card dashboard-card-analytics" onClick={() => navigate('/admin/dashboard')}>
            <div className="card-icon dashboard-icon"></div>
            <h3>Placement Portal</h3>
            <p>View platform analytics and statistics</p>
          </div>

          <div className="dashboard-card dashboard-card-applications" onClick={() => navigate('/admin/noticeBoard')}>
            <div className="card-icon applications-icon"></div>
            <h3>Notice Board</h3>
            <p>Manage user applications</p>
          </div>

          <div className="dashboard-card dashboard-card-companies" onClick={() => navigate('/admin/companies')}>
            <div className="card-icon companies-icon"></div>
            <h3>Company Management</h3>
            <p>View and edit company profiles</p>
          </div>

          <div className="dashboard-card dashboard-card-add" onClick={() => navigate('/admin/add-company')}>
            <div className="card-icon add-icon"></div>
            <h3>Add New Company</h3>
            <p>Register a new company to the platform</p>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => navigate('/admin/generate-report')}>Generate Report</button> {/* Updated route */}
            <button className="action-btn" onClick={() => navigate('/AdminRegister')}>User Management</button>
            <button className="action-btn" onClick={() => navigate('/StudentList')}>Students placement records</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMainPage;