import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './GenerateReport.css';

const GenerateReport = () => {
  const [reportData, setReportData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Function to fetch the report from the backend
  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/companies/finalized-report');
      const data = await response.json();

      if (response.ok) {
        setReportData(data);
      } else {
        console.error('Error fetching report:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to export data to Excel
  const handleExport = () => {
    const excelData = sortedAndFilteredData.map(company => ({
      'Company Name': company.name,
      'CTC (LPA)': company.ctc,
      'Eligible Branches': company.eligibleBranches.join(', '),
      'Eligible Year': company.eligibleYears.join(', '),
      'Placed Students': company.numStudentsPlaced
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Placement Report");
    XLSX.writeFile(workbook, `Placement_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Request sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort and filter data
  const getSortedAndFilteredData = () => {
    let filteredData = reportData.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.eligibleBranches.some(branch => 
        branch.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  // Fetch report data on component mount
  useEffect(() => {
    fetchReportData();
  }, []);

  const sortedAndFilteredData = getSortedAndFilteredData();

  return (
    <div className="report-container">
      <header className="report-header">
        <h1>Placement Report</h1>
        <div className="header-actions">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search companies or branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="export-button" onClick={handleExport}>
            <svg className="download-icon" viewBox="0 0 24 24">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Export Report
          </button>
        </div>
      </header>

      <div className="report-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Generating your report...</p>
          </div>
        ) : sortedAndFilteredData.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <h3>No results found</h3>
            <p>Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : (
          <div className="report-table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('name')}>
                    Company Name
                    {sortConfig.key === 'name' && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => requestSort('ctc')}>
                    CTC
                    {sortConfig.key === 'ctc' && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th>Eligible Branches</th>
                  <th>Eligible Year</th>
                  <th onClick={() => requestSort('numStudentsPlaced')}>
                    Placed Students
                    {sortConfig.key === 'numStudentsPlaced' && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedAndFilteredData.map((company, index) => (
                  <tr key={index}>
                    <td>
                      <div className="company-cell">
                        <div className="company-logo-placeholder"></div>
                        <span>{company.name}</span>
                      </div>
                    </td>
                    <td>₹{company.ctc.toLocaleString()} LPA</td>
                    <td>
                      <div className="tags-container">
                        {company.eligibleBranches.map((branch, i) => (
                          <span key={i} className="branch-tag">{branch}</span>
                        ))}
                      </div>
                    </td>
                    <td>{company.eligibleYears.join(', ')}</td>
                    <td>
                      <div className="students-count">
                        <span className="count-number">{company.numStudentsPlaced}</span>
                        <span className="count-label">students</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!isLoading && sortedAndFilteredData.length > 0 && (
        <footer className="report-footer">
          <div className="pagination-info">
            Showing 1-{Math.min(10, sortedAndFilteredData.length)} of {sortedAndFilteredData.length} companies
          </div>
          <div className="pagination-controls">
            <button disabled className="pagination-button">
              Previous
            </button>
            <button className="pagination-button active">1</button>
            <button className="pagination-button">2</button>
            <button className="pagination-button">
              Next
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default GenerateReport;