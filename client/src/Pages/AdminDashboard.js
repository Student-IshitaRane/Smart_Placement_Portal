import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaSearch, 
  FaCheck, 
  FaTimes, 
  FaUserGraduate,
  FaBuilding
} from 'react-icons/fa';
import { 
  MdEmail, 
  MdSchool, 
  MdCheckCircle, 
  MdCancel,
  MdOutlinePendingActions
} from 'react-icons/md';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('applications');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' });

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/applications/companies/active')
      .then((response) => {
        setCompanies(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching active companies:', error);
        setLoading(false);
        showSnackbar('Failed to load companies', 'error');
      });
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      setLoading(true);
      axios.get(`http://localhost:5000/api/applications/admin/${selectedCompanyId}/applications`)
        .then((response) => {
          setApplications(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching applications:', error);
          setLoading(false);
          showSnackbar('Failed to load applications', 'error');
        });
    } else {
      setApplications([]);
    }
  }, [selectedCompanyId]);

  const showSnackbar = (message, type) => {
    setSnackbar({ open: true, message, type });
    setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000);
  };

  const handleApprove = (id) => {
    axios.patch(`http://localhost:5000/api/applications/admin/approve/${id}`)
      .then(() => {
        setApplications(apps => apps.map(app => 
          app._id === id ? { ...app, status: 'Approved' } : app
        ));
        showSnackbar('Application approved', 'success');
      })
      .catch(() => showSnackbar('Approval failed', 'error'));
  };

  const handleReject = (id) => {
    axios.patch(`http://localhost:5000/api/applications/admin/reject/${id}`)
      .then(() => {
        setApplications(apps => apps.map(app => 
          app._id === id ? { ...app, status: 'Rejected' } : app
        ));
        showSnackbar('Application rejected', 'success');
      })
      .catch(() => showSnackbar('Rejection failed', 'error'));
  };

  const handleFinalize = () => {
    if (!selectedCompanyId) return;
    
    if (window.confirm('Finalize selections for this company? This cannot be undone.')) {
      axios.post(`http://localhost:5000/api/applications/admin/finalize/${selectedCompanyId}`)
        .then(() => {
          setApplications([]);
          setSelectedCompanyId('');
          showSnackbar('Selections finalized successfully', 'success');
        })
        .catch(() => showSnackbar('Finalization failed', 'error'));
    }
  };

  const filteredApplications = applications.filter(app =>
    app.studentId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const approvedCount = filteredApplications.filter(a => a.status === 'Approved').length;
  const rejectedCount = filteredApplications.filter(a => a.status === 'Rejected').length;
  const pendingCount = filteredApplications.filter(a => a.status === 'Applied').length;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Placement Portal Admin</h1>
        <div className="header-actions">
          <div className="user-chip">
            <div className="user-avatar">A</div>
            <span>Admin</span>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="controls-container">
          <div className="tabs">
            
          </div>

          <div className="filters-container">
            <div className="filter-group">
              <label>Select Company</label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                disabled={loading}
              >
                <option value="">All Companies</option>
                {companies.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.name} - {c.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group search-group">
              <label></label>
              <div className="search-input">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading || !selectedCompanyId}
                />
              </div>
            </div>

            <button 
              className="finalize-button"
              onClick={handleFinalize}
              disabled={!selectedCompanyId || loading}
            >
              Finalize Selections
            </button>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-card total">
            <div className="stat-value">{filteredApplications.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card approved">
            <div className="stat-value">{approvedCount}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-card pending">
            <div className="stat-value">{pendingCount}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-value">{rejectedCount}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>

        <div className="data-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="empty-state">
              <MdOutlinePendingActions className="empty-icon" />
              <h3>{selectedCompanyId ? 'No applications found' : 'Select a company'}</h3>
              <p>{selectedCompanyId ? 'Try adjusting your search' : 'Choose a company to view applications'}</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th><MdEmail /> Email</th>
                    <th><MdSchool /> Branch</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map(app => (
                    <tr key={app._id}>
                      <td className="student-cell">
                        <div className="student-avatar">
                          {app.studentId?.name?.charAt(0) || 'N'}
                        </div>
                        <div className="student-info">
                          <div className="student-name">{app.studentId?.name || 'N/A'}</div>
                          <div className="student-id">{app.studentId?._id?.slice(-6) || 'N/A'}</div>
                        </div>
                      </td>
                      <td>{app.studentId?.email || 'N/A'}</td>
                      <td>{app.studentId?.branch || 'N/A'}</td>
                      <td>
                        <span className={`status-badge ${app.status.toLowerCase()}`}>
                          {app.status === 'Approved' && <MdCheckCircle />}
                          {app.status === 'Rejected' && <MdCancel />}
                          {app.status}
                        </span>
                      </td>
                      <td>
                        {app.status === 'Applied' && (
                          <div className="action-buttons">
                            <button 
                              className="approve-button"
                              onClick={() => handleApprove(app._id)}
                            >
                              <FaCheck /> Approve
                            </button>
                            <button 
                              className="reject-button"
                              onClick={() => handleReject(app._id)}
                            >
                              <FaTimes /> Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {snackbar.open && (
        <div className={`snackbar ${snackbar.type}`}>
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;