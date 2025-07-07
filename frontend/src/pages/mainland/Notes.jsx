import React from 'react';

export default function MainlandNotes({ formData, setFormData, onSubmit, onPrev }) {
  const [notes, setNotes] = React.useState(formData.notes || '');

  const handleSubmit = () => {
    setFormData({ ...formData, notes });
    onSubmit();
  };

  return (
    <div className="d-flex vh-100 bg-dark text-white">
      <div className="form-container">
        <div className="card-container">
          <h2 className="title">Additional Notes</h2>
          <p className="subtitle mb-4">
            Add any additional information or special requirements for your application.
          </p>

          <textarea
            className="form-control mb-4"
            rows="4"
            placeholder="Any special requirements or additional information..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="button-group mt-3">
            <button className="btn btn-secondary" onClick={onPrev}>Back</button>
            <button
              className="btn btn-success fw-semibold"
              onClick={handleSubmit}
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}