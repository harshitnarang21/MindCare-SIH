import React, { useState } from 'react';

const BookingSystem = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Booking request submitted! You will be contacted within 24 hours.');
  };

  return (
    <div className="component-container">
      <h2>📅 Book Counselor Appointment</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>Name:</label>
          <input type="text" required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" required />
        </div>
        <div className="form-group">
          <label>Preferred Date:</label>
          <input type="date" required />
        </div>
        <div className="form-group">
          <label>Emergency Level:</label>
          <select required>
            <option value="">Select urgency</option>
            <option value="routine">Routine (1-2 weeks)</option>
            <option value="urgent">Urgent (2-3 days)</option>
            <option value="crisis">Crisis (same day)</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">Book Appointment</button>
      </form>
    </div>
  );
};

export default BookingSystem;
