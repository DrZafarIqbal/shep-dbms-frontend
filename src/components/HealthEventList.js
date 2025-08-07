import React, { useState, useEffect } from 'react';
import HealthEventForm from './HealthEventForm';

const HealthEventList = () => {
  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchEvents = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/healthevents`);
    const data = await res.json();
    setEvents(data);
  };

  const addEvent = async (record) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/healthevents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    fetchEvents();
  };

  const updateEvent = async (record) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/healthevents/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    setEditing(null);
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/healthevents/${id}`, {
      method: 'DELETE'
    });
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <h2>Health Events</h2>
      <HealthEventForm
        onSubmit={editing ? updateEvent : addEvent}
        initialData={editing || {}}
        buttonLabel={editing ? "Update Event" : "Add Event"}
      />
      <ul>
        {events.map((item) => (
          <li key={item.id}>
            {(item.tag_number || item.branding_id)} | {item.event_type} on {item.event_date}
            <button onClick={() => setEditing(item)}>Edit</button>
            <button onClick={() => deleteEvent(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HealthEventList;
