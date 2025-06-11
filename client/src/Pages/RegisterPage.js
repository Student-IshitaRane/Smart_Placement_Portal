import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', rollNo: '', email: '', phone: '', year: '', branch: '',
    cgpa: '', leetcodeId: '', gfgId: '', codeforcesId: '', dob: '', password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Registration successful');
        navigate('/');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Something went wrong');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Create Account</h2>
        <p>Register to get started</p>

        <form onSubmit={handleRegister}>
          {[ 
            { name: 'name', label: 'Name' }, 
            { name: 'rollNo', label: 'Roll Number' }, 
            { name: 'email', label: 'Email', type: 'email' }, 
            { name: 'phone', label: 'Phone', type: 'tel' }
          ].map((field) => (
            <div key={field.name}>
              <label>{field.label}</label>
              <input
                type={field.type || 'text'}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {/* Branch dropdown placed after phone */}
          <div>
            <label>Branch</label>
            <select
              name="branch"
              value={form.branch}
              onChange={handleChange}
              required
              className="dropdown-select"
            >
              <option value="">Select your branch</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics and Telecommunication">Electronics and Telecommunication</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Instrumentation">Instrumentation</option>
            </select>
          </div>

          {/* Year dropdown */}
          <div>
            <label>Year</label>
            <select
              name="year"
              value={form.year}
              onChange={handleChange}
              required
              className="dropdown-select"
            >
              <option value="">Select your year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          {[ 
            { name: 'cgpa', label: 'CGPA' },
            { name: 'leetcodeId', label: 'LeetCode ID' },
            { name: 'gfgId', label: 'GFG ID' },
            { name: 'codeforcesId', label: 'Codeforces ID' },
            { name: 'dob', label: 'Date of Birth', type: 'date' },
            { name: 'password', label: 'Password', type: 'password' }
          ].map((field) => (
            <div key={field.name}>
              <label>{field.label}</label>
              <input
                type={field.type || 'text'}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="register-button">Register</button>
        </form>

        <p className="signup-text">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;