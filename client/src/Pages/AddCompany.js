import React, { useState } from 'react';
import './AddCompany.css';
import Select from 'react-select';

const AddCompany = () => {
  const [formData, setFormData] = useState({
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

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['minCgpa', 'allowedBranches', 'year'].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        eligibility: {
          ...prev.eligibility,
          [name]: name === 'allowedBranches' ? value : 
                 name === 'minCgpa' ? parseFloat(value) :
                 Number(value),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const processedData = {
      ...formData,
      eligibility: {
        ...formData.eligibility,
        allowedBranches: formData.eligibility.allowedBranches,
      }
    };

    try {
      const response = await fetch('http://localhost:5000/api/companies/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Company added successfully!');
        setFormData({
          name: '',
          role: '',
          ctc: '',
          eligibility: { minCgpa: '', allowedBranches: '', year: '' },
          testDate: '',
          interviewDate: '',
          notes: '',
        });
      } else {
        setMessage(data.message || '❌ Failed to add company');
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Error submitting the form');
    }
  };

  return (
    <div className="add-company-container">
      <h2>Add New Company</h2>
      {message && <p className="form-message">{message}</p>}
      <form onSubmit={handleSubmit} className="add-company-form">
        <input name="name" type="text" placeholder="Company Name" value={formData.name} onChange={handleChange} required />
        <input name="role" type="text" placeholder="Job Role" value={formData.role} onChange={handleChange} required />
        <input name="ctc" type="text" placeholder="CTC" value={formData.ctc} onChange={handleChange} required />
        <input 
          name="minCgpa" 
          type="number" 
          placeholder="Minimum CGPA" 
          value={formData.eligibility.minCgpa} 
          onChange={handleChange} 
          step="0.1"
          min="0"
          max="10"
          required 
        />
        
        <label>
          Allowed Branches
          <Select
            isMulti
            name="allowedBranches"
            options={[
              { value: 'Computer Science', label: 'Computer Science' },
              { value: 'Information Technology', label: 'Information Technology' },
              { value: 'Electronics and Telecommunication', label: 'Electronics and Telecommunication' },
              { value: 'Mechanical', label: 'Mechanical' },
              { value: 'Instrumentation', label: 'Instrumentation' },
            ]}
            className="react-select-container"
            classNamePrefix="react-select"
            onChange={(selectedOptions) => {
              const selectedValues = selectedOptions.map(option => option.value);
              setFormData(prev => ({
                ...prev,
                eligibility: {
                  ...prev.eligibility,
                  allowedBranches: selectedValues
                }
              }));
            }}
            value={
              Array.isArray(formData.eligibility.allowedBranches)
                ? formData.eligibility.allowedBranches.map(branch => ({
                    value: branch,
                    label: branch
                  }))
                : []
            }
          />
        </label>

        <input name="year" type="number" placeholder="Eligible Year" value={formData.eligibility.year} onChange={handleChange} required />
        <div className="date-input-group">
          <label>
            Test Date
            <input name="testDate" type="date" value={formData.testDate} onChange={handleChange} />
          </label>
        </div>
        <div className="date-input-group">
          <label>
            Interview Date
            <input name="interviewDate" type="date" value={formData.interviewDate} onChange={handleChange} />
          </label>
        </div>
        <textarea name="notes" placeholder="Notes (optional)" value={formData.notes} onChange={handleChange}></textarea>
        <button type="submit">Add Company</button>
      </form>
    </div>
  );
};

export default AddCompany;