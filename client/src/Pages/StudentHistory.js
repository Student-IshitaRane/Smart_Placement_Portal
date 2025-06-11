import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { 
  HiOutlineBriefcase, 
  HiOutlineCalendar, 
  HiOutlineStatusOnline,
  HiOutlineFilter,
  HiOutlineSearch
} from 'react-icons/hi';
import './StudentHistory.css';

const StudentHistory = () => {
  const { studentId } = useParams();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/applications/student/${studentId}/history`);
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (studentId) {
      fetchHistory();
    }
  }, [studentId]);

  const filteredApplications = applications
    .filter(app => 
      app.companyId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(app => 
      statusFilter === 'all' || 
      app.status.toLowerCase() === statusFilter.toLowerCase()
    );

  const statusCounts = applications.reduce((acc, app) => {
    const status = app.status.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="enterprise-container">
      <div className="enterprise-header">
        <h1 className="enterprise-title">Application History</h1>
        <p className="enterprise-subtitle">Track your job application progress</p>
      </div>

      <div className="enterprise-controls">
        <div className="search-control">
          <HiOutlineSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-control">
          <HiOutlineFilter className="filter-icon" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses ({applications.length})</option>
            <option value="applied">Applied ({statusCounts.applied || 0})</option>
            <option value="interview">Interview ({statusCounts.interview || 0})</option>
            <option value="accepted">Accepted ({statusCounts.accepted || 0})</option>
            <option value="rejected">Rejected ({statusCounts.rejected || 0})</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="enterprise-loading">
          <div className="loading-spinner"></div>
          <p>Loading application history...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="enterprise-empty">
          <img 
            src="https://cdn3.iconfinder.com/data/icons/feather-5/24/search-512.png" 
            alt="No results" 
            className="empty-illustration"
          />
          <h3>No applications found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="enterprise-table-container">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app._id}>
                  <td>
                    <div className="company-cell">
                      <HiOutlineBriefcase className="company-icon" />
                      {app.companyId?.name || 'Unknown Company'}
                    </div>
                  </td>
                  <td>{app.position || 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      <HiOutlineCalendar className="date-icon" />
                      {new Date(app.appliedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td>
                    <button className="action-button">
                      <HiOutlineStatusOnline />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentHistory;