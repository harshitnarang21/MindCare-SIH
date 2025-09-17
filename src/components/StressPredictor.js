import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import DatePicker from 'react-datepicker';
import 'react-calendar/dist/Calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import { v4 as uuidv4 } from 'uuid';

// Enhanced academic stress prediction with user events
const predictStressPeriods = (academicEvents, userEvents, studyPlan) => {
  const allEvents = [...academicEvents, ...userEvents, ...studyPlan];
  const predictions = [];
  const today = new Date();
  
  allEvents.forEach(event => {
    const eventDate = new Date(event.date);
    const daysBefore = Math.floor((eventDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysBefore >= 0 && daysBefore <= 21) { // 3 weeks ahead
      let riskLevel = 'low';
      let intervention = 'General wellness check';
      
      // Enhanced risk calculation
      if (event.type === 'exam' && daysBefore <= 7) {
        riskLevel = 'high';
        intervention = `🚨 ${event.name} in ${daysBefore} days! Intensive study mode activated.`;
      } else if (event.type === 'assignment' && daysBefore <= 3) {
        riskLevel = 'medium';
        intervention = `⚠️ ${event.name} due soon. Time to finalize your work.`;
      } else if (event.type === 'presentation' && daysBefore <= 5) {
        riskLevel = 'high';
        intervention = `🎯 ${event.name} coming up. Practice your presentation now.`;
      } else if (event.type === 'study-session' && daysBefore <= 1) {
        riskLevel = 'medium';
        intervention = `📚 Study session: ${event.name}. Get your materials ready.`;
      } else if (event.type === 'reminder' && daysBefore <= 1) {
        riskLevel = 'low';
        intervention = `🔔 Reminder: ${event.name}`;
      }
      
      predictions.push({
        date: eventDate,
        riskLevel,
        intervention,
        event: event.name,
        type: event.type,
        daysLeft: daysBefore,
        source: event.source || 'manual'
      });
    }
  });
  
  return predictions.sort((a, b) => a.daysLeft - b.daysLeft);
};

// Google Classroom simulation (for demo purposes)
const simulateGoogleClassroomData = () => [
  { 
    id: uuidv4(),
    date: '2025-09-28', 
    name: 'React.js Assignment Submission', 
    type: 'assignment',
    source: 'google-classroom',
    course: 'Web Development',
    description: 'Build a complete React application with routing'
  },
  { 
    id: uuidv4(),
    date: '2025-10-02', 
    name: 'Database Management Quiz', 
    type: 'exam',
    source: 'google-classroom',
    course: 'DBMS',
    description: 'Online quiz covering SQL and normalization'
  }
];

const EnhancedStressPredictor = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stressPredictions, setStressPredictions] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);
  const [googleClassroomConnected, setGoogleClassroomConnected] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showStudyPlanModal, setShowStudyPlanModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: new Date(),
    type: 'assignment',
    description: '',
    priority: 'medium'
  });
  const [newStudySession, setNewStudySession] = useState({
    subject: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '11:00',
    topics: '',
    goals: ''
  });

  // Sample academic events
  const sampleAcademicEvents = [
    { 
      id: uuidv4(),
      date: '2025-09-25', 
      name: 'Data Structures Mid-term', 
      type: 'exam',
      source: 'manual'
    },
    { 
      id: uuidv4(),
      date: '2025-10-05', 
      name: 'SIH Final Presentation', 
      type: 'presentation',
      source: 'manual'
    }
  ];

  useEffect(() => {
    // Simulate Google Classroom connection
    let classroomEvents = [];
    if (googleClassroomConnected) {
      classroomEvents = simulateGoogleClassroomData();
    }
    
    const predictions = predictStressPeriods(sampleAcademicEvents, [...userEvents, ...classroomEvents], studyPlan);
    setStressPredictions(predictions);
  }, [userEvents, studyPlan, googleClassroomConnected]);

  // Connect to Google Classroom (simulation)
  const handleGoogleClassroomConnect = () => {
    setGoogleClassroomConnected(true);
    // In real implementation, this would handle OAuth flow
    alert('✅ Successfully connected to Google Classroom!\n📚 Importing your assignments and coursework...');
  };

  // Add user event/reminder
  const handleAddEvent = () => {
    const event = {
      id: uuidv4(),
      ...newEvent,
      type: newEvent.type,
      source: 'user-created'
    };
    setUserEvents([...userEvents, event]);
    setNewEvent({
      name: '',
      date: new Date(),
      type: 'assignment',
      description: '',
      priority: 'medium'
    });
    setShowEventModal(false);
  };

  // Add study session to plan
  const handleAddStudySession = () => {
    const session = {
      id: uuidv4(),
      name: `${newStudySession.subject} Study Session`,
      date: newStudySession.date,
      type: 'study-session',
      source: 'study-plan',
      ...newStudySession
    };
    setStudyPlan([...studyPlan, session]);
    setNewStudySession({
      subject: '',
      date: new Date(),
      startTime: '09:00',
      endTime: '11:00',
      topics: '',
      goals: ''
    });
    setShowStudyPlanModal(false);
  };

  // Get date stress info
  const getDateStressInfo = (date) => {
    return stressPredictions.find(
      prediction => prediction.date.toDateString() === date.toDateString()
    );
  };

  // Calendar tile styling
  const tileClassName = ({ date }) => {
    const stressInfo = getDateStressInfo(date);
    if (stressInfo) {
      return `stress-${stressInfo.riskLevel}`;
    }
    return null;
  };

  const selectedDateStress = getDateStressInfo(selectedDate);
  const upcomingHighRisk = stressPredictions
    .filter(p => p.riskLevel === 'high' && p.daysLeft >= 0)
    .slice(0, 3);

  return (
    <div className="enhanced-stress-predictor">
      <div className="predictor-header">
        <h2>🎓 Smart Academic Stress Predictor</h2>
        <p>AI-powered with Google Classroom integration & Personal Study Planner</p>
        
        {/* Integration Controls */}
        <div className="integration-controls">
          {!googleClassroomConnected ? (
            <button 
              className="google-classroom-btn"
              onClick={handleGoogleClassroomConnect}
            >
              📚 Connect Google Classroom
            </button>
          ) : (
            <div className="connected-status">
              ✅ Google Classroom Connected
            </div>
          )}
          
          <button 
            className="add-event-btn"
            onClick={() => setShowEventModal(true)}
          >
            ➕ Add Event/Reminder
          </button>
          
          <button 
            className="study-plan-btn"
            onClick={() => setShowStudyPlanModal(true)}
          >
            📅 Create Study Plan
          </button>
        </div>
      </div>

      {/* High-Risk Alerts */}
      {upcomingHighRisk.length > 0 && (
        <div className="stress-alerts">
          <h3>🚨 Upcoming High-Risk Periods</h3>
          {upcomingHighRisk.map((risk, index) => (
            <div key={index} className={`stress-alert stress-alert-${risk.riskLevel}`}>
              <div className="alert-content">
                <strong>{risk.event}</strong>
                <p>{risk.intervention}</p>
                <div className="alert-meta">
                  <span className="days-countdown">{risk.daysLeft} days left</span>
                  <span className="source-badge">{risk.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Calendar */}
      <div className="calendar-section">
        <h3>📅 Academic Timeline & Stress Prediction</h3>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileClassName={tileClassName}
          className="enhanced-calendar"
        />
        
        {selectedDateStress && (
          <div className={`selected-date-info stress-${selectedDateStress.riskLevel}`}>
            <h4>{selectedDate.toDateString()}</h4>
            <div className="event-details">
              <p><strong>📋 Event:</strong> {selectedDateStress.event}</p>
              <p><strong>🎯 Type:</strong> {selectedDateStress.type}</p>
              <p><strong>📍 Source:</strong> {selectedDateStress.source}</p>
              <p><strong>💡 Recommendation:</strong> {selectedDateStress.intervention}</p>
            </div>
          </div>
        )}
      </div>

      {/* Event Creation Modal */}
      {showEventModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>➕ Add New Event/Reminder</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleAddEvent(); }}>
              <input
                type="text"
                placeholder="Event name"
                value={newEvent.name}
                onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                required
              />
              
              <DatePicker
                selected={newEvent.date}
                onChange={(date) => setNewEvent({...newEvent, date})}
                dateFormat="yyyy-MM-dd"
              />
              
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
              >
                <option value="assignment">📝 Assignment</option>
                <option value="exam">📊 Exam</option>
                <option value="presentation">🎯 Presentation</option>
                <option value="reminder">🔔 Reminder</option>
                <option value="deadline">⏰ Deadline</option>
              </select>
              
              <select
                value={newEvent.priority}
                onChange={(e) => setNewEvent({...newEvent, priority: e.target.value})}
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
              
              <textarea
                placeholder="Description (optional)"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
              
              <div className="modal-actions">
                <button type="submit">Add Event</button>
                <button type="button" onClick={() => setShowEventModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Study Plan Modal */}
      {showStudyPlanModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>📚 Create Study Session</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleAddStudySession(); }}>
              <input
                type="text"
                placeholder="Subject name"
                value={newStudySession.subject}
                onChange={(e) => setNewStudySession({...newStudySession, subject: e.target.value})}
                required
              />
              
              <DatePicker
                selected={newStudySession.date}
                onChange={(date) => setNewStudySession({...newStudySession, date})}
                dateFormat="yyyy-MM-dd"
              />
              
              <div className="time-inputs">
                <input
                  type="time"
                  value={newStudySession.startTime}
                  onChange={(e) => setNewStudySession({...newStudySession, startTime: e.target.value})}
                />
                <span>to</span>
                <input
                  type="time"
                  value={newStudySession.endTime}
                  onChange={(e) => setNewStudySession({...newStudySession, endTime: e.target.value})}
                />
              </div>
              
              <input
                type="text"
                placeholder="Topics to cover"
                value={newStudySession.topics}
                onChange={(e) => setNewStudySession({...newStudySession, topics: e.target.value})}
              />
              
              <textarea
                placeholder="Study goals"
                value={newStudySession.goals}
                onChange={(e) => setNewStudySession({...newStudySession, goals: e.target.value})}
              />
              
              <div className="modal-actions">
                <button type="submit">Add to Study Plan</button>
                <button type="button" onClick={() => setShowStudyPlanModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statistics Dashboard */}
      <div className="enhanced-stats">
        <div className="stat-card">
          <h4>📊 Total Events</h4>
          <span className="stat-number">{stressPredictions.length}</span>
        </div>
        <div className="stat-card">
          <h4>📚 Google Classroom</h4>
          <span className="stat-number">{googleClassroomConnected ? '✅' : '❌'}</span>
        </div>
        <div className="stat-card">
          <h4>📝 User Events</h4>
          <span className="stat-number">{userEvents.length}</span>
        </div>
        <div className="stat-card">
          <h4>📅 Study Sessions</h4>
          <span className="stat-number">{studyPlan.length}</span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStressPredictor;
