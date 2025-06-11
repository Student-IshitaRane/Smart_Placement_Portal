import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';
import './ManageCompanies.css';

const branchOptions = [
  { value: 'Computer Science', label: 'Computer Science' },
  { value: 'Information Technology', label: 'Information Technology' },
  { value: 'Electronics and Telecommunication', label: 'Electronics and Telecommunication' },
  { value: 'Mechanical', label: 'Mechanical' },
  { value: 'Instrumentation', label: 'Instrumentation' },
];

const Toast = ({ message, type, onClose }) => {
  return (
    <motion.div
      className={`toast toast-${type}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>
        &times;
      </button>
    </motion.div>
  );
};

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    role: '',
    ctc: '',
    eligibility: {
      minCgpa: '',
      allowedBranches: [],
      year: '',
    },
    testDate: '',
    interviewDate: '',
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
      showToast('Failed to load companies', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await axios.delete(`http://localhost:5000/api/companies/${id}`);
        fetchCompanies();
        showToast('Company deleted successfully');
      } catch (err) {
        console.error('Error deleting company:', err);
        showToast('Failed to delete company', 'error');
      }
    }
  };

  const handleEditClick = (company) => {
    setEditingCompany(company._id);
    setEditFormData({
      name: company.name,
      role: company.role,
      ctc: company.ctc,
      eligibility: {
        minCgpa: company.eligibility?.minCgpa || '',
        allowedBranches: company.eligibility?.allowedBranches || [],
        year: company.eligibility?.year || '',
      },
      testDate: company.testDate?.split('T')[0] || '',
      interviewDate: company.interviewDate?.split('T')[0] || '',
      notes: company.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('eligibility.')) {
      const field = name.split('.')[1];
      setEditFormData(prev => ({
        ...prev,
        eligibility: {
          ...prev.eligibility,
          [field]: value,
        }
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAllowedBranchesChange = (selectedOptions) => {
    const selectedBranches = selectedOptions.map(option => option.value);
    setEditFormData(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        allowedBranches: selectedBranches,
      }
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/companies/${editingCompany}`,
        editFormData
      );
      fetchCompanies();
      setIsModalOpen(false);
      showToast('Company updated successfully');
    } catch (err) {
      console.error('Error updating company:', err);
      showToast('Failed to update company', 'error');
    }
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="pms-container">
      {/* Toast notifications container */}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <header className="pms-header">
        <h1 className="pms-title">Placement Management System</h1>
        <p className="pms-subtitle">Manage recruiting companies and their details</p>
      </header>

      <div className="pms-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading companies...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="companies-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>CTC</th>
                  <th>Eligibility</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company._id}>
                    <td>
                      <div className="company-info">
                        <span className="company-name">{company.name}</span>
                      </div>
                    </td>
                    <td>{company.role}</td>
                    <td>
                      <span className="ctc-badge">{company.ctc} LPA</span>
                    </td>
                    <td>
                      <div className="eligibility-info">
                        <span>CGPA: {company.eligibility?.minCgpa || '-'}</span>
                        <span>Year: {company.eligibility?.year || '-'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="actions">
                        <motion.button
                          onClick={() => handleEditClick(company)}
                          className="edit-btn"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(company._id)}
                          className="delete-btn"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for editing */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              className="edit-modal"
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Edit Company Details</h2>
                <button 
                  className="close-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="modal-form">
                <div className="form-columns">
                  <div className="form-section">
                    <h3 className="section-title">Basic Information</h3>
                    <div className="form-group">
                      <label>Company Name</label>
                      <input
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Job Role</label>
                      <input
                        name="role"
                        value={editFormData.role}
                        onChange={handleEditFormChange}
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>CTC (in LPA)</label>
                      <input
                        name="ctc"
                        value={editFormData.ctc}
                        onChange={handleEditFormChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="section-title">Eligibility Criteria</h3>
                    <div className="form-group">
                      <label>Minimum CGPA</label>
                      <input
                        name="eligibility.minCgpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={editFormData.eligibility.minCgpa}
                        onChange={handleEditFormChange}
                        required
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Allowed Branches</label>
                      <Select
                        isMulti
                        name="eligibility.allowedBranches"
                        options={branchOptions}
                        value={branchOptions.filter(option =>
                          editFormData.eligibility.allowedBranches.includes(option.value)
                        )}
                        onChange={handleAllowedBranchesChange}
                        className="multi-select"
                        classNamePrefix="select"
                      />
                    </div>

                    <div className="form-group">
                      <label>Eligible Year</label>
                      <input
                        name="eligibility.year"
                        type="number"
                        value={editFormData.eligibility.year}
                        onChange={handleEditFormChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">Important Dates</h3>
                  <div className="date-inputs">
                    <div className="form-group">
                      <label>Test Date</label>
                      <input
                        name="testDate"
                        type="date"
                        value={editFormData.testDate}
                        onChange={handleEditFormChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Interview Date</label>
                      <input
                        name="interviewDate"
                        type="date"
                        value={editFormData.interviewDate}
                        onChange={handleEditFormChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">Additional Information</h3>
                  <div className="form-group">
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      value={editFormData.notes}
                      onChange={handleEditFormChange}
                      rows="4"
                      className="form-textarea"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <motion.button
                    type="button"
                    onClick={handleCancelEdit}
                    className="secondary-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="primary-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageCompanies;