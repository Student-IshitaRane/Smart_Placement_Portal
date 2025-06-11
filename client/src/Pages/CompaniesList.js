import React, { useState } from 'react';
import { updates } from './UpdateCompanies';
import './CompaniesList.css';
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';

const allowedBranches = ["CS", "IT", "ENTC", "MECH", "INSTRU"];

const getFilteredCompanies = (companies) => {
  return companies
    .map(company => {
      const branchMap = {
        "CSE": "CS",
        "IT": "IT",
        "ECE": "ENTC",
        "ME": "MECH",
        "EE": "INSTRU",
        "CH": "CH",
        "PE": "PE"
      };

      const mappedBranches = company.eligibleBranches
        .map(branch => branchMap[branch] || branch)
        .filter(branch => allowedBranches.includes(branch));

      if (mappedBranches.length === 0) return null;

      return {
        ...company,
        eligibleBranches: mappedBranches
      };
    })
    .filter(Boolean);
};

const CompanyList = () => {
  const [viewMode, setViewMode] = useState('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCards, setExpandedCards] = useState({});
  const allCompanies = getFilteredCompanies(updates);

  const filteredCompanies = allCompanies.filter(company => 
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.jobProfile.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.eligibleBranches.some(branch => 
      branch.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleCard = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Pastel purple palette
  const colors = {
    primary: '#e2d1f9',
    secondary: '#f0e6ff',
    accent: '#c4a1d8',
    text: '#4a3b5a',
    header: '#1C0D2F',
    hover: '#dec9e6',
    border: '#d3c0d3',
    evenRow: '#f5f0fa',
    oddRow: '#ece0f5'
  };

  return (
    <div className="company-list-container">
      <div className="header-controls">
        <h1 style={{ color: colors.text }}>Past Recruitments</h1>
        
        <div className="controls-row">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="view-toggle-container">
            <button 
              onClick={() => setViewMode('cards')} 
              className={viewMode === 'cards' ? 'active' : ''}
            >
              Card View
            </button>
            <button 
              onClick={() => setViewMode('table')} 
              className={viewMode === 'table' ? 'active' : ''}
            >
              Table View
            </button>
          </div>
        </div>
      </div>
      
      {viewMode === 'cards' ? (
        <div className="cards-container">
          {filteredCompanies.map((company, index) => (
            <div 
              key={index} 
              className="company-card"
              style={{ 
                background: index % 2 === 0 ? colors.evenRow : colors.oddRow,
                borderColor: colors.border
              }}
            >
              <div className="company-header">
                <h2 className="company-name" style={{ color: colors.text }}>{company.name}</h2>
              </div>
              
              <div className="basic-info">
                <div className="info-row">
                  <span className="info-label">Job Profile:</span>
                  <span className="info-value">{company.jobProfile}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Location:</span>
                  <span className="info-value">{company.location}</span>
                </div>
              </div>
              
              {expandedCards[index] && (
                <div className="detailed-info">
                  <div className="detail-row">
                    <span className="detail-label">No. of Rounds:</span>
                    <span className="detail-value">{company.noOfRounds}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Eligible Branches:</span>
                    <span className="detail-value eligible-branches">
                      {company.eligibleBranches.join(', ')}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">CGPA Criteria:</span>
                    <span className="detail-value">{company.cgpaCriteria}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Backlog Criteria:</span>
                    <span className="detail-value">{company.backlogCriteria}</span>
                  </div>
                </div>
              )}
              
              <button 
                className="expand-button"
                onClick={() => toggleCard(index)}
                style={{ color: colors.accent }}
              >
                {expandedCards[index] ? (
                  <>
                    <span>Show Less</span>
                    <FaChevronUp />
                  </>
                ) : (
                  <>
                    <span>Show More</span>
                    <FaChevronDown />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-container">
          <table className="companies-table">
            <thead>
              <tr style={{ backgroundColor: colors.header }}>
                <th style={{ color: 'white' }}>Company</th>
                <th style={{ color: 'white' }}>Job Profile</th>
                <th style={{ color: 'white' }}>Location</th>
                <th style={{ color: 'white' }}>Rounds</th>
                <th style={{ color: 'white' }}>Eligible Branches</th>
                <th style={{ color: 'white' }}>CGPA</th>
                <th style={{ color: 'white' }}>Backlog</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company, index) => (
                <tr 
                  key={index}
                  style={{ 
                    backgroundColor: index % 2 === 0 ? colors.evenRow : colors.oddRow 
                  }}
                  className="table-row"
                >
                  <td>{company.name}</td>
                  <td>{company.jobProfile}</td>
                  <td>{company.location}</td>
                  <td>{company.noOfRounds}</td>
                  <td>{company.eligibleBranches.join(', ')}</td>
                  <td>{company.cgpaCriteria}</td>
                  <td>{company.backlogCriteria}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompanyList;