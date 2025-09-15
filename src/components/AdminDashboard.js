import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="component-container">
      <h2>📊 Admin Dashboard</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Users</h3>
          <div className="metric">1,247</div>
        </div>
        <div className="dashboard-card">
          <h3>Crisis Alerts</h3>
          <div className="metric">3</div>
        </div>
        <div className="dashboard-card">
          <h3>Active Sessions</h3>
          <div className="metric">89</div>
        </div>
        <div className="dashboard-card">
          <h3>Bookings</h3>
          <div className="metric">156</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
