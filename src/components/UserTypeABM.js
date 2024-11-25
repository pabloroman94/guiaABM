// src/components/UserTypeABM.js
import React, { useState, useEffect } from 'react';

function UserTypeABM() {
  const [userTypeData, setUserTypeData] = useState({
    id: '',
    active: 0,
    fInsert: new Date().toISOString(),
    userName: 'RPablo',
    version: 1,
    fUpdate: new Date().toISOString(),
    userNameUpdate: 'RPablo',
    code: '',
    description: '',
  });
  const [userTypeList, setUserTypeList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUserTypes();
  }, []);

  const fetchUserTypes = async () => {
    try {
      const response = await fetch('https://localhost:5002/api/v1/UserType/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch UserTypes');
      }

      const data = await response.json();
      setUserTypeList(data.data || []);
    } catch (error) {
      console.error("Error fetching UserTypes:", error);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`https://localhost:5002/api/v1/UserType/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const userType = result.data;
        alert(`
          Code: ${userType.code}
          Description: ${userType.description}
          Active: ${userType.active ? 'Yes' : 'No'}
        `);
      } else {
        alert("Failed to fetch UserType details");
      }
    } catch (error) {
      console.error("Error fetching UserType details:", error);
      alert("An error occurred while fetching UserType details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserTypeData({ ...userTypeData, [name]: value });
  };

  const handleCreate = async (e) => {
    const dataToSend = { ...userTypeData };
    if (dataToSend.id === "") {
      delete dataToSend.id;
    }
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/UserType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("UserType created successfully");
        resetForm();
        fetchUserTypes();
      } else {
        alert("Failed to create UserType");
      }
    } catch (error) {
      console.error("Error creating UserType:", error);
      alert("An error occurred while creating UserType");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/UserType', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({
          ...userTypeData,
          fUpdate: new Date().toISOString(),
          userNameUpdate: 'RPablo',
        }),
      });

      if (response.ok) {
        alert("UserType updated successfully");
        resetForm();
        fetchUserTypes();
      } else {
        alert("Failed to update UserType");
      }
    } catch (error) {
      console.error("Error updating UserType:", error);
      alert("An error occurred while updating UserType");
    }
  };

  const handleEdit = (userType) => {
    setUserTypeData(userType);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this UserType?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:5002/api/v1/UserType/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("UserType deleted successfully");
        fetchUserTypes();
      } else {
        alert("Failed to delete UserType");
      }
    } catch (error) {
      console.error("Error deleting UserType:", error);
      alert("An error occurred while deleting UserType");
    }
  };

  const resetForm = () => {
    setUserTypeData({
      id: '',
      active: 0,
      fInsert: new Date().toISOString(),
      userName: 'RPablo',
      version: 1,
      fUpdate: new Date().toISOString(),
      userNameUpdate: 'RPablo',
      code: '',
      description: '',
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h2>{isEditing ? "Edit UserType" : "Create UserType"}</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label>ID: {userTypeData.id}</label>
        </div>
        <div>
          <label>Code:</label>
          <input type="text" name="code" value={userTypeData.code} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={userTypeData.description} onChange={handleChange} />
        </div>
        <div>
          <label>Active:</label>
          <select name="active" value={userTypeData.active} onChange={handleChange}>
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </select>
        </div>
        <button type="submit">{isEditing ? "Update UserType" : "Create UserType"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>UserType List</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userTypeList.map((userType) => (
            <tr key={userType.id}>
              <td>{userType.code}</td>
              <td>{userType.description}</td>
              <td>{userType.active ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleEdit(userType)}>Edit</button>
                <button onClick={() => handleDelete(userType.id)}>Delete</button>
                <button onClick={() => handleViewDetails(userType.id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTypeABM;
