import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignInPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log('Sign-in attempt:', formData);
      // Add authentication logic here
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 signin-bg">
      <div className="card p-4 shadow signin-card">
        <h2 className="text-center mb-3" style={{ color: 'var(--color-primary)' }}>Sign In</h2>
        <p className="text-center mb-4 text-muted">
          Don’t have an account? <Link to="/signup" className="text-primary text-decoration-none">Create one</Link>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              id="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="rememberMe" />
              <label htmlFor="rememberMe" className="form-check-label">Remember me</label>
            </div>
            <a href="/forgot-password" className="text-decoration-none text-primary">Forgot Password?</a>
          </div>

          <button type="submit" className="btn btn-primary w-100">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
