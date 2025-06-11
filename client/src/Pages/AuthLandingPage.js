import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authBg from '../assets/auth-bg.jpeg';
import './AuthLandingPage.css';

const AuthLandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }) 
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('studentId', data.user._id);
        navigate('/main');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="auth-container">
      <div 
        className="auth-left"
        style={{ 
          background: `linear-gradient(rgba(123, 47, 247, 0.8), rgba(253, 185, 155, 0.8)), url(${authBg}) no-repeat center center`,
          backgroundSize: 'cover'
        }}
      >
        <div className="welcome-content">
          <div className="logo">CodeXplore</div>
          <h1>Welcome Back!</h1>
        </div>
      </div>
      <div className="auth-right">
        <div className="login-box">
          <h2>Login</h2>
          <p>Welcome back! Please login to your account.</p>
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input 
              type="email" 
              placeholder="username@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Password</label>
            <input 
              type="password" 
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                Remember Me
              </label>
              <Link to="#" className="forgot-password">Forgot Password?</Link>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">Login</button>
          </form>
          <p className="signup-text">
            New User? <Link to="/register">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLandingPage;
