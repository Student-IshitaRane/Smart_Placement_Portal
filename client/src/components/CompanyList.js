import React, { useState, useEffect } from 'react';
import './CompanyList.css';

const CompanyList = ({ studentId, onSuccess }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyingCompany, setApplyingCompany] = useState(null);
  const [appliedCompanies, setAppliedCompanies] = useState([]);  // To track applied companies

  useEffect(() => {
    // Fetch the companies from the API
    fetch('http://localhost:5000/api/applications/companies/active')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => setCompanies(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    // Optionally, fetch the applied companies from the backend (if it's available)
    // setAppliedCompanies(fetchedAppliedCompanies);
  }, []);

  const handleApply = async (companyId) => {
    try {
      if (!studentId) {
    alert('Student ID is missing. Please login again.');
    return;
  }

      setApplyingCompany(companyId);  // Set the company that's being applied to

      // Send the application request to the backend
      const response = await fetch('http://localhost:5000/api/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          companyId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add the company to applied companies list on success
        setAppliedCompanies((prevAppliedCompanies) => [...prevAppliedCompanies, companyId]);
        onSuccess();  // Notify parent of success
        alert('Application successful!');
      } else {
        alert(data.message || 'Application failed');
      }
    } catch (error) {
      console.error('Application error:', error);
      alert('Something went wrong while applying.');
    } finally {
      setApplyingCompany(null);  // Reset applying state after request
    }
  };

  if (loading) return <p className="info">Loading companies...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!companies.length) return <p className="info">No active companies available.</p>;

  return (
    <div className="company-list">
      {companies.map((company) => (
        <div key={company._id} className="company-card">
          <div className="company-details">
            <h2>{company.name}</h2>
            <p><strong>Role:</strong> {company.role}</p>
            <p><strong>CGPA:</strong> {company.eligibility.minCgpa}+</p>
            <p><strong>Branches:</strong> {company.eligibility.allowedBranches.join(', ')}</p>
            <p><strong>Year:</strong> {company.eligibility.year}</p>
          </div>

          {/* Conditionally render Apply Now or Registered */}
          {appliedCompanies.includes(company._id) ? (
  <button className="registered-button" disabled>
    Registered
  </button>
) : (
  <button
    onClick={() => handleApply(company._id)}
    className="apply-button"
    disabled={applyingCompany === company._id}
  >
    {applyingCompany === company._id ? 'Applying...' : 'Apply Now'}
  </button>
)}

        </div>
      ))}
    </div>
  );
};

export default CompanyList;