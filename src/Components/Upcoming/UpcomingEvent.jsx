import React, { useState, useEffect } from 'react';
import './UpcomingEvent.css';
import BASE_URL from '../../service/BaseAddress'; // Base API URL
import { toast } from 'react-toastify';

const UpcomingEvent = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
    registerLink: '',
    lastDate: '',
    photo: null,
  });

  // Fetch Events
  const fetchEvents = async () => {
    const token = localStorage.getItem('auth-token');
    try {
      const response = await fetch(`${BASE_URL}/api/newevent/list-new-events`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      toast.error('Error fetching events.');
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle File Input
  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  // Create or Update Event
  const handleSubmit = async () => {
    const endpoint = editingEvent
      ? `${BASE_URL}/api/newevent/update-new-event/${editingEvent._id}`
      : `${BASE_URL}/api/newevent/new-event`;
    const method = editingEvent ? 'PUT' : 'POST';

    const token = localStorage.getItem('auth-token');
    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await response.json();
      if (data.message) {
        toast.success(data.message);
        setFormData({ name: '', date: '', description: '', registerLink: '',lastDate: '', photo: null });
        setEditingEvent(null);
        fetchEvents();
      } else {
        toast.error('Error saving the event.');
      }
    } catch (error) {
      toast.error('Error creating/updating event.');
    }
  };

  // Delete Event
  const handleDelete = async (id) => {
    const token = localStorage.getItem('auth-token');
    try {
      const response = await fetch(`${BASE_URL}/api/newevent/delete-new-event/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.message) {
        toast.success(data.message);
        fetchEvents();
      } else {
        toast.error('Error deleting the event.');
      }
    } catch (error) {
      toast.error('Error deleting the event.');
    }
  };

  return (
    <div className="upcoming-event-container">
      

      <div className="new-event-form">
      <h2>Add Upcoming Event</h2>
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={formData.name}
          onChange={handleChange}
        />
        <label>Event Date : </label>
        <input
          type="date"
          name="date"
          placeholder="Event Date"
          value={formData.date}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          name="registerLink"
          placeholder="Registration Link"
          value={formData.registerLink}
          onChange={handleChange}
        />
        <label>Registration last date : </label>
        <input
          type="date"
          name="lastDate"
          placeholder="Last Date for register"
          value={formData.lastDate}
          onChange={handleChange}
        />
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSubmit}>
           Create Upcoming Event
        </button>
      </div>

      <div className="new-event-list">
        <h2>Upcoming Events : </h2>
        {events.length > 0 ? (
          events.map((event) => (
            <div className="new-event-card" key={event._id}>
              <img src={event.photo} alt={event.name} />
              <h3>{event.name}</h3>
              <p>{event.description}</p>
              <p>Event Date : {new Date(event.date).toDateString()}</p>
              <a href={event.registerLink} target="_blank" rel="noopener noreferrer">
                Register Here
              </a>
              <p>Event Register last date: {new Date(event.lastDate).toDateString()}</p>
              <button onClick={() => setEditingEvent(event)}>Edit</button>
              <button onClick={() => handleDelete(event._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No upcoming events available.</p>
        )}
      </div>

      {editingEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Event</h3>
            <input
              type="text"
              name="name"
              placeholder="Event Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="date"
              name="date"
              placeholder="Event Date"
              value={formData.date}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleChange}
            />
            <input
              type="text"
              name="registerLink"
              placeholder="Registration Link"
              value={formData.registerLink}
              onChange={handleChange}
            />
            <input
          type="date"
          name="lastDate"
          placeholder="Last Date for register"
          value={formData.lastDate}
          onChange={handleChange}
        />
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleSubmit}>
              Update Event
            </button>
            <button onClick={() => setEditingEvent(null)} className='red'>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvent;
