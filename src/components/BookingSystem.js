import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const BookingSystem = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    institution: '',
    course: '',
    appointment_date: '',
    appointment_time: '',
    preferred_counsellor: 'any',
    session_type: 'individual',
    concerns: [],
    additional_notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [existingBookings, setExistingBookings] = useState([]);

  const concernOptions = [
    'Academic Stress',
    'Anxiety & Depression',
    'Time Management',
    'Social Anxiety',
    'Family Issues',
    'Financial Stress',
    'Career Uncertainty',
    'Relationship Problems',
    'Sleep Issues',
    'Eating Disorders',
    'Substance Use',
    'Other'
  ];

  const counsellors = [
    { id: 'any', name: 'Any Available Counsellor' },
    { id: 'dr_sarah', name: 'Dr. Sarah Johnson - Anxiety Specialist' },
    { id: 'dr_michael', name: 'Dr. Michael Chen - Academic Stress' },
    { id: 'dr_priya', name: 'Dr. Priya Sharma - Depression & Mood' },
    { id: 'dr_james', name: 'Dr. James Wilson - Trauma & PTSD' },
    { id: 'dr_lisa', name: 'Dr. Lisa Thompson - Eating Disorders' }
  ];

  // Load user data and existing bookings when component mounts
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        institution: user.profile?.institution || '',
        course: user.profile?.course || ''
      }));
      fetchExistingBookings();
    }
  }, [user]);

  const fetchExistingBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('counsellor_appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExistingBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConcernChange = (concern) => {
    setFormData(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concern)
        ? prev.concerns.filter(c => c !== concern)
        : [...prev.concerns, concern]
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.appointment_date) return 'Appointment date is required';
    if (!formData.appointment_time) return 'Appointment time is required';
    if (formData.concerns.length === 0) return 'Please select at least one concern';

    // Validate appointment is in the future
    const appointmentDateTime = new Date(`${formData.appointment_date}T${formData.appointment_time}`);
    if (appointmentDateTime <= new Date()) {
      return 'Appointment must be scheduled for a future date and time';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setMessage({ type: 'error', text: 'Please sign in to book an appointment' });
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const appointmentData = {
        user_id: user.id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        age: formData.age ? parseInt(formData.age) : null,
        institution: formData.institution.trim() || null,
        course: formData.course.trim() || null,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        preferred_counsellor: formData.preferred_counsellor,
        session_type: formData.session_type,
        concerns: formData.concerns,
        additional_notes: formData.additional_notes.trim() || null,
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('counsellor_appointments')
        .insert([appointmentData])
        .select();

      if (error) throw error;

      setMessage({ 
        type: 'success', 
        text: 'Appointment booked successfully! You will receive a confirmation email shortly.' 
      });

      // Reset form
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        age: '',
        institution: user.profile?.institution || '',
        course: user.profile?.course || '',
        appointment_date: '',
        appointment_time: '',
        preferred_counsellor: 'any',
        session_type: 'individual',
        concerns: [],
        additional_notes: ''
      });

      // Refresh existing bookings
      fetchExistingBookings();

    } catch (error) {
      console.error('Error booking appointment:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to book appointment. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="booking-container">
      <div className="booking-header">
        <h2>📅 Book a Counselling Session</h2>
        <p>Schedule a confidential session with our professional mental health counsellors</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          <span className="message-icon">
            {message.type === 'success' ? '✅' : '❌'}
          </span>
          {message.text}
        </div>
      )}

      <div className="booking-content">
        <div className="booking-form-section">
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="18"
                    min="13"
                    max="100"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Institution</label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="University/College name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Course/Program</label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    placeholder="Computer Science, Psychology, etc."
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Appointment Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Date *</label>
                  <input
                    type="date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Preferred Time *</label>
                  <input
                    type="time"
                    name="appointment_time"
                    value={formData.appointment_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Preferred Counsellor</label>
                <select
                  name="preferred_counsellor"
                  value={formData.preferred_counsellor}
                  onChange={handleInputChange}
                >
                  {counsellors.map(counsellor => (
                    <option key={counsellor.id} value={counsellor.id}>
                      {counsellor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Session Type</label>
                <select
                  name="session_type"
                  value={formData.session_type}
                  onChange={handleInputChange}
                >
                  <option value="individual">Individual Session</option>
                  <option value="group">Group Session</option>
                  <option value="couple">Couple's Session</option>
                  <option value="family">Family Session</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>Areas of Concern *</h3>
              <p className="section-description">Select all areas you'd like to discuss</p>
              
              <div className="concerns-grid">
                {concernOptions.map(concern => (
                  <label key={concern} className="concern-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.concerns.includes(concern)}
                      onChange={() => handleConcernChange(concern)}
                    />
                    <span className="checkbox-custom"></span>
                    {concern}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Additional Notes</h3>
              <div className="form-group">
                <label>Anything else you'd like your counsellor to know?</label>
                <textarea
                  name="additional_notes"
                  value={formData.additional_notes}
                  onChange={handleInputChange}
                  placeholder="Share any specific concerns, preferences, or information that might help your counsellor prepare for your session..."
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="book-appointment-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Booking Appointment...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">📅</span>
                    Book Appointment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {existingBookings.length > 0 && (
          <div className="existing-bookings">
            <h3>Your Appointments</h3>
            <div className="bookings-list">
              {existingBookings.map(booking => (
                <div key={booking.id} className={`booking-card status-${booking.status}`}>
                  <div className="booking-header">
                    <div className="booking-date">
                      📅 {formatDate(booking.appointment_date)}
                    </div>
                    <div className={`booking-status status-${booking.status}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                  </div>
                  <div className="booking-details">
                    <div className="booking-time">
                      🕐 {formatTime(booking.appointment_time)}
                    </div>
                    <div className="booking-counsellor">
                      👨‍⚕️ {counsellors.find(c => c.id === booking.preferred_counsellor)?.name || 'Any Available'}
                    </div>
                    <div className="booking-type">
                      📋 {booking.session_type.charAt(0).toUpperCase() + booking.session_type.slice(1)} Session
                    </div>
                    {booking.concerns && booking.concerns.length > 0 && (
                      <div className="booking-concerns">
                        🎯 {booking.concerns.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSystem;
