import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    role: 'user', // Default role
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError('');
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = 'Emails do not match';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      // Check if user already exists with this email
      const { data: existingUser, error: checkError } = await supabase
        .from('Users')
        .select('user_id')
        .eq('email', formData.email)
        .single();
      if (existingUser) {
        setSignupError('An account with this email already exists. Please use a different email.');
        setLoading(false);
        return;
      }
      // Insert user into new Users table (case-sensitive table/column names)
      const { data, error } = await supabase.from('Users').insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password, // Should be string, not bigint
          role: 'user',
        },
      ]).select('user_id').single();
      if (!error && data && data.user_id) {
        // REMOVE: Do not create onboarding row here
        // const { error: onboardingError } = await supabase.from('Onboarding').insert([{ user_id: data.user_id }]);
        // if (onboardingError) {
        //   setSignupError('Onboarding row creation failed: ' + onboardingError.message);
        //   setLoading(false);
        //   return;
        // }
      }
      setLoading(false);
      if (error) {
        if (error.code === '23505' || error.message.includes('duplicate')) {
          setSignupError('Email already exists. Please use a different email.');
        } else {
          setSignupError(error.message);
        }
      } else {
        navigate('/signin');
      }
    }
  };

  return (
    <div className="signup container py-5">
      <div className="mx-auto" style={{ maxWidth: '500px' }}>
        <h2 className="mb-3">Create an Account</h2>
        <p>
          Already have an account? <Link to="/signin" className="text-primary">Sign in</Link>
        </p>
        {signupError && <div className="alert alert-danger">{signupError}</div>}
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="mb-1">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
            <div className="invalid-feedback">{errors.firstName}</div>
          </div>

          <div className="mb-1">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
            <div className="invalid-feedback">{errors.lastName}</div>
          </div>

          <div className="mb-1">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@email.com"
            />
            <div className="invalid-feedback">{errors.email}</div>
          </div>

          <div className="mb-1">
            <label className="form-label">Confirm Email</label>
            <input
              type="email"
              className={`form-control ${errors.confirmEmail ? 'is-invalid' : ''}`}
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleChange}
              placeholder="Confirm email"
            />
            <div className="invalid-feedback">{errors.confirmEmail}</div>
          </div>

          <div className="mb-1">
            <label className="form-label">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
            <div className="invalid-feedback">{errors.password}</div>
          </div>

          <div className="mb-1">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
            <div className="invalid-feedback">{errors.confirmPassword}</div>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'Signing up...' : 'Sign up'}</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
