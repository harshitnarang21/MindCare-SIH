import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import UserProfileForm from './components/UserProfileForm';
import ChatBot from './components/ChatBot';
import Resources from './components/Resources';
import BookingSystem from './components/BookingSystem';
import PeerSupport from './components/PeerSupport';
import AdminDashboard from './components/AdminDashboard';
import StressPredictor from './components/StressPredictor';

// Header component with authentication
const AppHeader = () => {
  const { user, login, logout } = useAuth();

  return (
    <header className="app-header">
      <nav className="navbar">
        <div className="nav-brand">
          <div className="brand-container">
            <div className="brand-icon">🧠</div>
            <div className="brand-text">
              <h1>MindCare</h1>
              <p>Student Mental Health Support</p>
            </div>
          </div>
        </div>
        
        <ul className="nav-links">
          <li><Link to="/" className="nav-link">
            <span className="nav-icon">💬</span>
            <span>AI Chat</span>
          </Link></li>
          <li><Link to="/resources" className="nav-link">
            <span className="nav-icon">📚</span>
            <span>Resources</span>
          </Link></li>
          <li><Link to="/booking" className="nav-link">
            <span className="nav-icon">📅</span>
            <span>Book Counselor</span>
          </Link></li>
          <li><Link to="/peer-support" className="nav-link">
            <span className="nav-icon">👥</span>
            <span>Peer Support</span>
          </Link></li>
          <li><Link to="/stress-predictor" className="nav-link">
            <span className="nav-icon">📊</span>
            <span>Stress Predictor</span>
          </Link></li>
          <li><Link to="/admin" className="nav-link">
            <span className="nav-icon">📊</span>
            <span>Admin</span>
          </Link></li>
        </ul>

        {/* Authentication Section */}
        <div className="auth-section">
          {user ? (
            <div className="header-user-info">
              <img 
                src={user.picture} 
                alt="Profile" 
                className="header-user-avatar"
              />
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                {user.hasCompletedProfile && user.profile && (
                  <span className="user-institution">
                    {user.profile.institution}
                  </span>
                )}
              </div>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => login()} className="login-btn">
              🔐 Sign in with Google
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

// Main App content
const AppContent = () => {
  const { showProfileForm } = useAuth();

  return (
    <div className="App">
      <AppHeader />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ChatBot />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/booking" element={<BookingSystem />} />
          <Route path="/peer-support" element={<PeerSupport />} />
          <Route path="/stress-predictor" element={<StressPredictor />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2025 MindCare - Confidential Mental Health Support for Students</p>
          <div className="emergency-info">
            <div className="emergency-badge">
              <span className="emergency-icon">🚨</span>
              <div className="emergency-text">
                <strong>24/7 Emergency Support</strong>
                <div className="emergency-numbers">
                  <span>India: 102</span> | <span>US: 988</span> | <span>Crisis: 741741</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Profile Form Modal */}
      {showProfileForm && <UserProfileForm />}
    </div>
  );
};

// Root App component
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
