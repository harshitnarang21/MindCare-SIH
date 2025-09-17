import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const RealTimeStressTracker = () => {
  const { user, addStressEvent } = useAuth();
  const [stressEvents, setStressEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    event_name: '',
    event_type: 'assignment',
    event_date: new Date().toISOString().split('T')[0],
    stress_level: 'medium'
  });

  useEffect(() => {
    if (!user) return;

    // Fetch existing stress events
    fetchStressEvents();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('stress_events_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'stress_events',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setStressEvents(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchStressEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('stress_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setStressEvents(data || []);
    } catch (error) {
      console.error('Error fetching stress events:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const event = await addStressEvent(newEvent);
    if (event) {
      setNewEvent({
        event_name: '',
        event_type: 'assignment',
        event_date: new Date().toISOString().split('T')[0],
        stress_level: 'medium'
      });
    }
  };

  return (
    <div className="stress-tracker">
      <h3>🎯 Real-Time Stress Tracker</h3>
      
      {/* Add New Event Form */}
      <form onSubmit={handleSubmit} className="stress-event-form">
        <input
          type="text"
          placeholder="Event name"
          value={newEvent.event_name}
          onChange={(e) => setNewEvent({...newEvent, event_name: e.target.value})}
          required
        />
        <select
          value={newEvent.event_type}
          onChange={(e) => setNewEvent({...newEvent, event_type: e.target.value})}
        >
          <option value="assignment">📝 Assignment</option>
          <option value="exam">📊 Exam</option>
          <option value="presentation">🎯 Presentation</option>
          <option value="deadline">⏰ Deadline</option>
        </select>
        <input
          type="date"
          value={newEvent.event_date}
          onChange={(e) => setNewEvent({...newEvent, event_date: e.target.value})}
        />
        <select
          value={newEvent.stress_level}
          onChange={(e) => setNewEvent({...newEvent, stress_level: e.target.value})}
        >
          <option value="low">🟢 Low Stress</option>
          <option value="medium">🟡 Medium Stress</option>
          <option value="high">🔴 High Stress</option>
        </select>
        <button type="submit">Add Event</button>
      </form>

      {/* Real-time Event List */}
      <div className="stress-events-list">
        <h4>📊 Recent Stress Events</h4>
        {stressEvents.map(event => (
          <div key={event.id} className={`stress-event stress-${event.stress_level}`}>
            <div className="event-header">
              <span className="event-name">{event.event_name}</span>
              <span className="event-type">{event.event_type}</span>
            </div>
            <div className="event-meta">
              <span className="event-date">{new Date(event.event_date).toLocaleDateString()}</span>
              <span className={`stress-level stress-${event.stress_level}`}>
                {event.stress_level} stress
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeStressTracker;
