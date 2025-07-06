import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const SignInPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [signinError, setSigninError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSigninError('');
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      // Query the Users table (case-sensitive)
      const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('email', formData.email)
        .single();
      setLoading(false);
      if (error || !data) {
        setSigninError('Invalid email or password.');
        return;
      }
      // Compare password (plain text for now)
      if (data.password !== formData.password) {
        setSigninError('Invalid email or password.');
        return;
      }
      // Store user info in localStorage for session persistence
      localStorage.setItem('user', JSON.stringify({
        user_id: data.user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role: data.role,
      }));
      navigate('/onboarding');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 signin-bg">
      <div className="card p-4 shadow signin-card">
        <h2 className="text-center mb-3" style={{ color: 'var(--color-primary)' }}>Sign In</h2>
        <p className="text-center mb-4 text-muted">
          Don’t have an account? <Link to="/signup" className="text-primary text-decoration-none">Create one</Link>
        </p>
        {signinError && <div className="alert alert-danger">{signinError}</div>}
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

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
