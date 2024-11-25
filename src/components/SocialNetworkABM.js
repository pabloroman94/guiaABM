// src/components/SocialNetworkABM.js
import React, { useState, useEffect } from 'react';

function SocialNetworkABM() {
  const [socialNetworkData, setSocialNetworkData] = useState({
    id: '',
    active: 0,
    fInsert: new Date().toISOString(),
    userName: 'RPablo',
    version: 1,
    fUpdate: new Date().toISOString(),
    userNameUpdate: 'RPablo',
    code: '',
    contactId: '',
    platform: '',
    profileUrl: '',
  });
  const [socialNetworkList, setSocialNetworkList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchSocialNetworks();
  }, []);

  const fetchSocialNetworks = async () => {
    try {
      const response = await fetch('https://localhost:5002/api/v1/SocialNetwork/GetAll', {
        method: 'GET',
        headers: {
          'Accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch SocialNetworks');
      }

      const data = await response.json();
      setSocialNetworkList(data.data || []);
    } catch (error) {
      console.error("Error fetching SocialNetworks:", error);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`https://localhost:5002/api/v1/SocialNetwork/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const socialNetwork = result.data;
        alert(`Code: ${socialNetwork.code}\nPlatform: ${socialNetwork.platform}\nProfile URL: ${socialNetwork.profileUrl}`);
      } else {
        alert("Failed to fetch SocialNetwork details");
      }
    } catch (error) {
      console.error("Error fetching SocialNetwork details:", error);
      alert("An error occurred while fetching SocialNetwork details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocialNetworkData({ ...socialNetworkData, [name]: value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const dataToSend = { ...socialNetworkData };
    if (dataToSend.id === "") {
      delete dataToSend.id;
    }

    try {
      const response = await fetch('https://localhost:5002/api/v1/SocialNetwork', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("SocialNetwork created successfully");
        resetForm();
        fetchSocialNetworks();
      } else {
        alert("Failed to create SocialNetwork");
      }
    } catch (error) {
      console.error("Error creating SocialNetwork:", error);
      alert("An error occurred while creating SocialNetwork");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/SocialNetwork', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({
          ...socialNetworkData,
          fUpdate: new Date().toISOString(),
          userNameUpdate: 'RPablo',
        }),
      });

      if (response.ok) {
        alert("SocialNetwork updated successfully");
        resetForm();
        fetchSocialNetworks();
      } else {
        alert("Failed to update SocialNetwork");
      }
    } catch (error) {
      console.error("Error updating SocialNetwork:", error);
      alert("An error occurred while updating SocialNetwork");
    }
  };

  const handleEdit = (socialNetwork) => {
    setSocialNetworkData(socialNetwork);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this SocialNetwork?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:5002/api/v1/SocialNetwork/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("SocialNetwork deleted successfully");
        fetchSocialNetworks();
      } else {
        alert("Failed to delete SocialNetwork");
      }
    } catch (error) {
      console.error("Error deleting SocialNetwork:", error);
      alert("An error occurred while deleting SocialNetwork");
    }
  };

  const resetForm = () => {
    setSocialNetworkData({
      id: '',
      active: 0,
      fInsert: new Date().toISOString(),
      userName: 'RPablo',
      version: 1,
      fUpdate: new Date().toISOString(),
      userNameUpdate: 'RPablo',
      code: '',
      contactId: '',
      platform: '',
      profileUrl: '',
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h2>{isEditing ? "Edit SocialNetwork" : "Create SocialNetwork"}</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label>ID: {socialNetworkData.id}</label>
        </div>
        <div>
          <label>Code:</label>
          <input type="text" name="code" value={socialNetworkData.code} onChange={handleChange} required />
        </div>
        <div>
          <label>Contact ID:</label>
          <input type="text" name="contactId" value={socialNetworkData.contactId} onChange={handleChange} required />
        </div>
        <div>
          <label>Platform:</label>
          <input type="text" name="platform" value={socialNetworkData.platform} onChange={handleChange} required />
        </div>
        <div>
          <label>Profile URL:</label>
          <input type="text" name="profileUrl" value={socialNetworkData.profileUrl} onChange={handleChange} required />
        </div>
        <button type="submit">{isEditing ? "Update SocialNetwork" : "Create SocialNetwork"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>SocialNetwork List</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Contact ID</th>
            <th>Platform</th>
            <th>Profile URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {socialNetworkList.map((socialNetwork) => (
            <tr key={socialNetwork.id}>
              <td>{socialNetwork.code}</td>
              <td>{socialNetwork.contactId}</td>
              <td>{socialNetwork.platform}</td>
              <td>{socialNetwork.profileUrl}</td>
              <td>
                <button onClick={() => handleEdit(socialNetwork)}>Edit</button>
                <button onClick={() => handleDelete(socialNetwork.id)}>Delete</button>
                <button onClick={() => handleViewDetails(socialNetwork.id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SocialNetworkABM;
