import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    agreed: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = 'Emails do not match';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreed) newErrors.agreed = 'You must agree to the terms';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      // Submit logic here
    }
  };

  return (
    <div className="signup container py-5">
      <div className="mx-auto" style={{ maxWidth: '500px' }}>
        <h2 className="mb-3">Create an Account</h2>
        <p>
          Already have an account? <Link to="/signin" className="text-primary">Sign in</Link>
        </p>

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

          <div className="mb-1 form-check">
            <input
              type="checkbox"
              className={`form-check-input ${errors.agreed ? 'is-invalid' : ''}`}
              name="agreed"
              checked={formData.agreed}
              onChange={handleChange}
              id="termsCheck"
            />
            <label className="form-check-label" htmlFor="termsCheck">
              I read and agree with the <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Policy</a>
            </label>
            <div className="invalid-feedback">{errors.agreed}</div>
          </div>

          <button type="submit" className="btn btn-primary w-100">Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
