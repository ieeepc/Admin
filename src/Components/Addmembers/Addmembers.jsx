import React, { useState } from "react";
import "./Addmembers.css"; // Ensure styles are applied correctly
import BASE_URL from "../../service/BaseAddress"; // Update with your base URL
import { toast } from 'react-toastify';

const AddMember = () => {
  const [memberData, setMemberData] = useState({
    name: "",
    usn: "",
    year: "",
    linkedin: "",
    github: "",
    post: "",
    password: "",
  });
  const [photo, setPhoto] = useState(null);

  const photoHandler = (e) => {
    setPhoto(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setMemberData({ ...memberData, [e.target.name]: e.target.value });
  };

  const addMember = async () => {
    if (!memberData.password) {
      toast.error("Please enter password.");
      return;
    }
  
    let formData = new FormData();
    formData.append("photo", photo);
    formData.append("name", memberData.name);
    formData.append("usn", memberData.usn);
    formData.append("year", memberData.year);
    formData.append("linkedin", memberData.linkedin);
    formData.append("github", memberData.github);
    formData.append("post", memberData.post);
    formData.append("password", memberData.password);
  
    const token = localStorage.getItem('auth-token'); // Get token from localStorage

    try {
      const response = await fetch(`${BASE_URL}/api/members/add-member`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Authorization": `Bearer ${token}`, // Add token to the header
        },
        body: formData,
      });

      const data = await response.json();
      if (data.message) {
        toast.success("Member added successfully!");
        clearData();
      } else {
        toast.error("Failed to add member.");
      }
    } catch (error) {
      toast.error("An error occurred while adding the member.");
    }
  };

  const clearData = () => {
    setMemberData({
      name: "",
      usn: "",
      year: "",
      linkedin: "",
      github: "",
      post: "",
      password: "",
    });
    setPhoto(null);
  };

  return (
    <div className="addmembers">
      {/* Member Name */}
      <p>Areas mentioned with * are required</p>
      <div>
        <label htmlFor="name">Member Name * : </label>
        <input
          id="name"
          name="name"
          type="text"
          value={memberData.name}
          onChange={changeHandler}
          placeholder="Enter member name"
          required
        />
      </div>

      {/* USN */}
      <div>
        <label htmlFor="usn">USN * : </label>
        <input
          id="usn"
          name="usn"
          type="text"
          value={memberData.usn}
          onChange={changeHandler}
          placeholder="Enter USN"
          required
        />
      </div>

      {/* Year */}
      <div>
        <label htmlFor="year">Year * : </label>
        <input
          id="year"
          name="year"
          type="number"
          value={memberData.year}
          onChange={changeHandler}
          placeholder="Enter Year"
          required
          min="1"
          max="4"      
        />
      </div>

      {/* LinkedIn and GitHub */}
      <div className="social-links">
        <label htmlFor="linkedin">LinkedIn : </label>
        <input
          id="linkedin"
          name="linkedin"
          type="url"
          value={memberData.linkedin}
          onChange={changeHandler}
          placeholder="Enter LinkedIn URL"
          required
        />
        <label htmlFor="github">GitHub : </label>
        <input
          id="github"
          name="github"
          type="url"
          value={memberData.github}
          onChange={changeHandler}
          placeholder="Enter GitHub URL"
          required
        />
      </div>

      {/* Post */}
      <div>
        <label htmlFor="post">Post : </label>
        <input
          id="post"
          name="post"
          type="text"
          value={memberData.post}
          onChange={changeHandler}
          placeholder="Enter Post"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password">Password * : </label>
        <input
          id="password"
          name="password"
          type="password"
          value={memberData.password}
          onChange={changeHandler}
          placeholder="Enter Password"
          required
        />
      </div>

      {/* Photo Upload */}
      <div className="image-upload">
        <p>
          {photo === null ? (
            <>
              <label htmlFor="photo">Upload Photo </label>
              <input
                id="photo"
                type="file"
                onChange={photoHandler}
                hidden
              />
            </>
          ) : (
            <img src={URL.createObjectURL(photo)} alt="Uploaded Preview" />
          )}
        </p>
      </div>

      {/* Buttons */}
      <div className="addmember-btns">
        <button className="addmember-btn" onClick={addMember}>
          ADD MEMBER
        </button>
        <button className="clrproduct-btn" onClick={clearData}>
          CLEAR
        </button>
      </div>
    </div>
  );
};

export default AddMember;
