// src/pages/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
        // Set remaining attempts if provided
        if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    },
    loginBox: {
      backgroundColor: '#fff',
      padding: '3rem 2rem',
      borderRadius: '1rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      width: '100%',
      maxWidth: '400px'
    },
    logo: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    logoText: {
      fontSize: '2rem',
      fontWeight: '800',
      color: '#4c51bf',
      margin: 0
    },
    subtitle: {
      color: '#718096',
      fontSize: '0.875rem',
      marginTop: '0.5rem'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: '700',
      color: '#2d3748',
      textAlign: 'center',
      marginBottom: '2rem'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    inputGroup: {
      position: 'relative'
    },
    inputIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#a0aec0'
    },
    input: {
      width: '100%',
      padding: '0.875rem 1rem 0.875rem 3rem',
      fontSize: '1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '0.5rem',
      outline: 'none',
      transition: 'border-color 0.2s',
      backgroundColor: '#f7fafc'
    },
    passwordToggle: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#a0aec0',
      cursor: 'pointer',
      padding: '0.25rem',
      transition: 'color 0.2s'
    },
    error: {
      backgroundColor: '#fed7d7',
      color: '#c53030',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      textAlign: 'center',
      marginTop: '-0.5rem'
    },
    submitButton: {
      backgroundColor: '#4c51bf',
      color: '#fff',
      padding: '0.875rem',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    },
    footer: {
      textAlign: 'center',
      marginTop: '2rem',
      color: '#718096',
      fontSize: '0.875rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.logo}>
          <h1 style={styles.logoText}>Mobile Care</h1>
          <p style={styles.subtitle}>Admin Portal</p>
        </div>
        
        <h2 style={styles.title}>Admin Login</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <FaUser style={styles.inputIcon} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#4c51bf'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <FaLock style={styles.inputIcon} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#4c51bf'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
              onMouseEnter={(e) => e.target.style.color = '#4c51bf'}
              onMouseLeave={(e) => e.target.style.color = '#a0aec0'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          {error && (
            <div style={styles.error}>
              {error}
              {remainingAttempts !== null && remainingAttempts > 0 && (
                <div style={{ marginTop: '0.5rem', fontWeight: '600' }}>
                  {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
                </div>
              )}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#5a67d8')}
            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#4c51bf')}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;