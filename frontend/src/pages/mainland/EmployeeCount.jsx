import React from 'react';

export default function MainlandEmployeeCount({ formData, setFormData, onNext, onPrev }) {
  const [employeeCount, setEmployeeCount] = React.useState(formData.employeeCount || '');

  const handleContinue = () => {
    setFormData({ ...formData, employeeCount });
    onNext();
  };

  return (
    <div className="d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Estimated Number of Employees</h2>
          <p className="subtitle mb-4">
            Please provide an estimate of how many employees your company will have in the first year.
          </p>

          <select
            className="form-select mb-4"
            value={employeeCount}
            onChange={(e) => setEmployeeCount(e.target.value)}
          >
            <option value="">Select employee range</option>
            <option value="1-5">1-5 employees</option>
            <option value="6-10">6-10 employees</option>
            <option value="11-20">11-20 employees</option>
            <option value="21-50">21-50 employees</option>
            <option value="51-100">51-100 employees</option>
            <option value="100+">100+ employees</option>
          </select>

          <div className="button-group mt-3">
            <button className="btn btn-secondary" onClick={onPrev}>Back</button>
            <button
              className="btn btn-outline-light fw-semibold"
              disabled={!employeeCount}
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}