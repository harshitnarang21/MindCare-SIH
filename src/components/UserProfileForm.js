import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfileForm = () => {
  const { user, saveUserProfile, setShowProfileForm } = useAuth();
  const [formData, setFormData] = useState({
    age: '',
    institution: '',
    institutionType: 'college', // college, school, university
    course: '',
    year: '',
    city: '',
    country: '',
    stressFactors: [],
    mentalHealthHistory: 'prefer-not-to-say'
  });

  const stressFactorOptions = [
    'Academic Pressure',
    'Financial Concerns',
    'Social Anxiety',
    'Family Issues',
    'Career Uncertainty',
    'Health Issues',
    'Time Management',
    'Relationship Problems'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStressFactorChange = (factor) => {
    setFormData(prev => ({
      ...prev,
      stressFactors: prev.stressFactors.includes(factor)
        ? prev.stressFactors.filter(f => f !== factor)
        : [...prev.stressFactors, factor]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveUserProfile(formData);
  };

  const handleSkip = () => {
    // Save minimal profile
    saveUserProfile({
      ...formData,
      profileCompleted: false,
      completedAt: new Date().toISOString()
    });
  };

  return (
    <div className="profile-form-overlay">
      <div className="profile-form-container">
        <div className="profile-form-header">
          <h2>🎓 Complete Your MindCare Profile</h2>
          <p>Help us personalize your mental health support experience</p>
          <div className="user-info">
            <img src={user?.picture} alt="Profile" className="user-avatar" />
            <div>
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h3>📚 Academic Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="13"
                  max="100"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Institution Type *</label>
                <select
                  name="institutionType"
                  value={formData.institutionType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="school">School</option>
                  <option value="college">College</option>
                  <option value="university">University</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Institution Name *</label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                placeholder="e.g., ABC University, XYZ College"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Course/Program</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science, Arts, etc."
                />
              </div>
              
              <div className="form-group">
                <label>Year/Grade</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  placeholder="e.g., 2nd Year, Grade 12"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>📍 Location</h3>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Your city"
                />
              </div>
              
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Your country"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>🧠 Wellness Information</h3>
            
            <div className="form-group">
              <label>Common Stress Factors (Select all that apply)</label>
              <div className="checkbox-group">
                {stressFactorOptions.map(factor => (
                  <label key={factor} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.stressFactors.includes(factor)}
                      onChange={() => handleStressFactorChange(factor)}
                    />
                    {factor}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Mental Health Support History</label>
              <select
                name="mentalHealthHistory"
                value={formData.mentalHealthHistory}
                onChange={handleInputChange}
              >
                <option value="prefer-not-to-say">Prefer not to say</option>
                <option value="none">No previous support</option>
                <option value="counseling">Previous counseling</option>
                <option value="therapy">Previous therapy</option>
                <option value="medication">Previous medication</option>
                <option value="peer-support">Peer support groups</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleSkip} className="skip-btn">
              Skip for Now
            </button>
            <button type="submit" className="submit-btn">
              Complete Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;
