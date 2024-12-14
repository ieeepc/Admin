import React, { useEffect, useState } from 'react';
import './Listevents.css';
import BASE_URL from '../../service/BaseAddress';
import { toast } from 'react-toastify';

const ListEvents = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

    // Fetch Events
    const fetchEvents = async () => {
      const token = localStorage.getItem('auth-token');
      try {
        const response = await fetch(`${BASE_URL}/api/events/list-events`, {
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

  const deleteEvent = async (id) => {
    const token = localStorage.getItem('auth-token');
    try {
      const response = await fetch(`${BASE_URL}/api/events/delete-event/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.message === 'Event deleted successfully') {
        toast.success('Event deleted successfully');
        fetchEvents();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { _id, name, date, description } = selectedEvent;
    const token = localStorage.getItem('auth-token');
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('date', date);
    formData.append('description', description);
  
    // Add multiple photos to formData
    if (selectedEvent.photos && selectedEvent.photos.length > 0) {
      selectedEvent.photos.forEach((photo) => {
        formData.append('photos', photo);
      });
    }
  
    try {
      const response = await fetch(`${BASE_URL}/api/events/update-event/${_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (data.message === 'Event updated successfully') {
        toast.success('Event updated successfully');
        closeModal();
        fetchEvents();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to update event');
    }
  };
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedEvent((prev) => ({
      ...prev,
      photos: files,
    }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEvent((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="list-events">
    <div className="event-header">
      <p className="event-name">Event Name</p>
      <p className="event-date">Date</p>
      <p className="event-description">Description</p>
      <p className="event-photos">Photos</p>
      <p className="event-actions">Actions</p>
    </div>
    <hr />
    <div className="event-list">
    {events.length > 0 ? ( events.map((event) => (
        <React.Fragment key={event._id}>
          <div className="event-item">
            <div className="event-name">{event.name}</div>
            <div className="event-date">{new Date(event.date).toLocaleDateString()}</div>
            <div className="event-description">{event.description}</div>
            <div className="event-photos">
              {event.photos && event.photos.length > 0 ? (
                <div className="photo-gallery">
                  {event.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo.url}
                      alt={`${event.name} photo ${index + 1}`}
                      className="photo-thumbnail"
                    />
                  ))}
                </div>
              ) : (
                <p>No Photos</p>
              )}
            </div>
            <div className="event-actions">
              <button className="edit-button" onClick={() => openModal(event)}>Edit</button>
              <button className="delete-button" onClick={() => deleteEvent(event._id)}>Delete</button>
            </div>
          </div>
          <hr />
        </React.Fragment>
      ))
    ) : (
      <div className="no-events">No Events</div> // Display "No Events" if events array is empty
    )}
    </div>

    {isModalOpen && (
      <div className="modal">
        <div className="modal-content">
          <h3>Edit Event</h3>
          <form onSubmit={handleEditSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={selectedEvent.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={new Date(selectedEvent.date).toISOString().split('T')[0]}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={selectedEvent.description}
                onChange={handleInputChange}
                required
              ></textarea>
            </label>
            <label>
              Photos:
              <input
                type="file"
                name="photos"
                multiple
                onChange={handleFileChange}
              />
            </label>
            <div className="modal-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);
};

export default ListEvents;
