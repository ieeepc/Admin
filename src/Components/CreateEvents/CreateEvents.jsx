import React, { useState } from "react";
import "./CreateEvent.css"; 
import BASE_URL from "../../service/BaseAddress"; // Update with your actual base URL
import { toast } from 'react-toastify';

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    description: "",
  });
  const [photos, setPhotos] = useState([]);
  const [preview, setPreview] = useState([]);

  const photoHandler = (e) => {
    const selectedFiles = e.target.files;
    setPhotos([...photos, ...selectedFiles]); // Add new photos to the existing ones
    const previewUrls = Array.from(selectedFiles).map(file =>
      URL.createObjectURL(file)
    );
    setPreview(prevPreview => [...prevPreview, ...previewUrls]); // Add new preview URLs to the existing ones
  };

  const changeHandler = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const createEvent = async () => {
    if (photos.length === 0) {
      toast.error("Please upload at least one photo.");
      return;
    }

    let formData = new FormData();
    formData.append("name", eventData.name);
    formData.append("date", eventData.date);
    formData.append("description", eventData.description);
    for (let i = 0; i < photos.length; i++) {
      formData.append("photos", photos[i]);
    }

    const token = localStorage.getItem('auth-token'); // Get token from localStorage

    try {
      const response = await fetch(`${BASE_URL}/api/events/create`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Authorization": `Bearer ${token}`, // Add token to the header
        },
        body: formData,
      });

      const data = await response.json();
      if (data.message) {
        toast.success("Event created successfully!");
        clearData();
      } else {
        toast.error("Failed to create event.");
      }
    } catch (error) {
      toast.error("An error occurred while creating the event.");
    }
  };

  const clearData = () => {
    setEventData({
      name: "",
      date: "",
      description: "",
    });
    setPhotos([]);
    setPreview([]);
  };

  return (
    <div className="CreateEvent">
      <div className="eventTitle">
        <label htmlFor="name">Event Name * : </label>
        <input
          id="name"
          name="name"
          type="text"
          value={eventData.name}
          onChange={changeHandler}
          placeholder="Enter event name"
          required
        />
      </div>

      <div className="eventDate">
        <label htmlFor="date">Event Date * : </label>
        <input
          id="date"
          name="date"
          type="date"
          value={eventData.date}
          onChange={changeHandler}
          required
        />
      </div>

      <div className="eventDescription">
        <label htmlFor="description">Description * : </label>
        <textarea
          id="description"
          name="description"
          value={eventData.description}
          onChange={changeHandler}
          placeholder="Enter event description"
          required
        />
      </div>

      <div className="image-upload">
        <label htmlFor="photos">Upload Photos (Max 10) : </label>
        <input
          id="photos"
          name="photos"
          type="file"
          multiple
          onChange={photoHandler}
          required
        />
      </div>

      {preview.length > 0 && (
        <div className="photo-preview">
          <h4>Photo Preview:</h4>
          <div className="preview-images">
            {preview.map((url, index) => (
              <img key={index} src={url} alt={`preview-${index}`} className="preview-image" />
            ))}
          </div>
        </div>
      )}

      <div className="create-event-btns">
        <button className="create-event-btn" onClick={createEvent}>
          CREATE EVENT
        </button>
        <button className="clear-event-btn" onClick={clearData}>
          CLEAR
        </button>
      </div>
    </div>
  );
};

export default CreateEvent;
