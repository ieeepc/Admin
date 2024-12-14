import React, { useEffect, useState } from 'react';
import './Listmembers.css';
import BASE_URL from '../../service/BaseAddress';
import { toast } from 'react-toastify';

const ListMembers = () => {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [year, setYear] = useState(1); // Default to Year 1

  // Fetch members by year
  const fetchMembers = async () => {
    const token = localStorage.getItem('auth-token');
    try {
      const response = await fetch(`${BASE_URL}/api/members/members-by-year/${year}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }

      const data = await response.json();
      setMembers(data);
    } catch (error) {
      toast.error('Error fetching members.');
      setMembers([]);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [year]);

  const deleteMember = async (id) => {
    const token = localStorage.getItem('auth-token');
    try {
      const response = await fetch(`${BASE_URL}/api/members/delete-member/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data) {
        toast.success('Member deleted successfully!');
        fetchMembers();
      } 
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  const openModal = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { _id, name, usn, year, linkedin, github, post } = selectedMember;
    const token = localStorage.getItem('auth-token');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('usn', usn);
    formData.append('year', year);
    formData.append('linkedin', linkedin);
    formData.append('github', github);
    formData.append('post', post);

    if (selectedMember.photo) {
      formData.append('photo', selectedMember.photo);
    }

    try {
      const response = await fetch(`${BASE_URL}/api/members/update-member/${_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.message === 'Member Details updated successfully!') {
        toast.success('Member updated successfully');
        closeModal();
        fetchMembers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to update member');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedMember((prev) => ({ ...prev, photo: file }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedMember((prev) => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="list-members">
      <p>Select members year wise: </p>
      <div className="year-buttons-container">
  <button className="year-button" id="year-1" onClick={() => setYear(1)}>Year 1</button>
  <button className="year-button" id="year-2" onClick={() => setYear(2)}>Year 2</button>
  <button className="year-button" id="year-3" onClick={() => setYear(3)}>Year 3</button>
  <button className="year-button" id="year-4" onClick={() => setYear(4)}>Year 4</button>
</div>

      <div className="members-header">
        <p className="member-photo">Photo</p>
        <p className="member-name">Name</p>
        <p className="member-usn">USN</p>
        <p className="member-year">Year</p>
        <p className="member-github">Github URL</p>
        <p className='member-linkedin'>linkedin URL</p>
        <p className='post'>Post</p>
        <p className="member-actions">Actions</p>
      </div>
      <hr />
      <div className="member-list">
        {members.length > 0 ? (
          members.map((member) => (
            <React.Fragment key={member._id}>
              <div className="member-item">
              <div className="member-photo">
                  {member.photo?
                  <img src={member.photo} alt={member.name} className="photo-thumbnail" />
                  : <p>No photo</p>
                  }
                </div>
                <div className="member-name">{member.name}</div>
                <div className="member-usn">{member.usn}</div>
                <div className="member-year">{member.year}</div>
                <div className='member-github'>{member.github ?<a href={member.github}>Link</a>: "NA"}</div>
                <div className='member-linkedin'>{member.linkedin ?<a href={member.linkedin}>Link</a>: "NA"}</div>
                <div className='member-post'>{member.post || "NA"}</div>
                <div className="member-actions">
                  <button className="edit-button" onClick={() => openModal(member)}>Edit</button>
                  <button className="delete-button" onClick={() => deleteMember(member._id)}>Delete</button>
                </div>
              </div>
              <hr />
            </React.Fragment>
          ))
        ) : (
          <div className="no-members">No Members in {year} year</div> // Display "No Members" if array is empty
        )}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Member</h3>
            <form onSubmit={handleEditSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={selectedMember.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                USN:
                <input
                  type="text"
                  name="usn"
                  value={selectedMember.usn}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Year:
                <select
                  name="year"
                  value={selectedMember.year}
                  onChange={handleInputChange}
                  required
                >
                  <option value={1}>Year 1</option>
                  <option value={2}>Year 2</option>
                  <option value={3}>Year 3</option>
                  <option value={4}>Year 4</option>
                </select>
              </label>
              <label>
                LinkedIn:
                <input
                  type="text"
                  name="linkedin"
                  value={selectedMember.linkedin}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                GitHub:
                <input
                  type="text"
                  name="github"
                  value={selectedMember.github}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Post:
                <input
                  type="text"
                  name="post"
                  value={selectedMember.post}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Photo:
                <input
                  type="file"
                  name="photo"
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

export default ListMembers;
