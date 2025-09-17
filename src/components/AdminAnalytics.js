import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    todaySignups: 0,
    stressEvents: 0,
    institutionBreakdown: [],
    stressLevelDistribution: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Total users
      const { count: totalUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Today's signups
      const today = new Date().toISOString().split('T')[0];
      const { count: todaySignups } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      // Total stress events
      const { count: stressEvents } = await supabase
        .from('stress_events')
        .select('*', { count: 'exact', head: true });

      // Institution breakdown
      const { data: institutions } = await supabase
        .from('user_profiles')
        .select('institution')
        .not('institution', 'is', null);

      const institutionBreakdown = institutions.reduce((acc, curr) => {
        acc[curr.institution] = (acc[curr.institution] || 0) + 1;
        return acc;
      }, {});

      // Stress level distribution
      const { data: stressLevels } = await supabase
        .from('stress_events')
        .select('stress_level');

      const stressLevelDistribution = stressLevels.reduce((acc, curr) => {
        acc[curr.stress_level] = (acc[curr.stress_level] || 0) + 1;
        return acc;
      }, {});

      setAnalytics({
        totalUsers,
        todaySignups,
        stressEvents,
        institutionBreakdown: Object.entries(institutionBreakdown).slice(0, 10),
        stressLevelDistribution: Object.entries(stressLevelDistribution)
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <div className="admin-analytics">
      <h2>📊 MindCare Analytics Dashboard</h2>
      
      {/* Key Metrics */}
      <div className="analytics-grid">
        <div className="metric-card">
          <h3>👥 Total Users</h3>
          <div className="metric-number">{analytics.totalUsers}</div>
        </div>
        <div className="metric-card">
          <h3>🆕 Today's Signups</h3>
          <div className="metric-number">{analytics.todaySignups}</div>
        </div>
        <div className="metric-card">
          <h3>📈 Stress Events</h3>
          <div className="metric-number">{analytics.stressEvents}</div>
        </div>
      </div>

      {/* Institution Breakdown */}
      <div className="analytics-section">
        <h3>🏫 Top Institutions</h3>
        <div className="institution-list">
          {analytics.institutionBreakdown.map(([institution, count]) => (
            <div key={institution} className="institution-item">
              <span className="institution-name">{institution}</span>
              <span className="user-count">{count} users</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stress Level Distribution */}
      <div className="analytics-section">
        <h3>📊 Stress Level Distribution</h3>
        <div className="stress-distribution">
          {analytics.stressLevelDistribution.map(([level, count]) => (
            <div key={level} className={`stress-stat stress-${level}`}>
              <span className="level-name">{level} stress</span>
              <span className="level-count">{count} events</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={fetchAnalytics} className="refresh-btn">
        🔄 Refresh Analytics
      </button>
    </div>
  );
};

export default AdminAnalytics;
