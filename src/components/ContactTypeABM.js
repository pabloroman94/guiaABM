// src/components/ContactTypeABM.js
import React, { useState, useEffect } from 'react';

function ContactTypeABM() {
  const [contactTypeData, setContactTypeData] = useState({
    id: '',
    active: 0,
    fInsert: new Date().toISOString(),
    userName: 'RPablo',
    version: 1,
    fUpdate: new Date().toISOString(),
    userNameUpdate: 'RPablo',
    code: '',
    typeName: '',
    description: '',
  });
  const [contactTypeList, setContactTypeList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchContactTypes();
  }, []);

  const fetchContactTypes = async () => {
    try {
      const response = await fetch('https://localhost:5002/api/v1/ContactType/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ContactTypes');
      }

      const data = await response.json();
      setContactTypeList(data.data || []);
    } catch (error) {
      console.error("Error fetching ContactTypes:", error);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`https://localhost:5002/api/v1/ContactType/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const contactType = result.data;
        alert(`
          Code: ${contactType.code}
          Type Name: ${contactType.typeName}
          Description: ${contactType.description}
        `);
      } else {
        alert("Failed to fetch ContactType details");
      }
    } catch (error) {
      console.error("Error fetching ContactType details:", error);
      alert("An error occurred while fetching ContactType details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactTypeData({ ...contactTypeData, [name]: value });
  };

  const handleCreate = async (e) => {
    const dataToSend = { ...contactTypeData };
    if (dataToSend.id === "") {
      delete dataToSend.id;
    }

    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/ContactType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("ContactType created successfully");
        resetForm();
        fetchContactTypes();
      } else {
        alert("Failed to create ContactType");
      }
    } catch (error) {
      console.error("Error creating ContactType:", error);
      alert("An error occurred while creating ContactType");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/ContactType', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({
          ...contactTypeData,
          fUpdate: new Date().toISOString(),
          userNameUpdate: 'RPablo',
        }),
      });

      if (response.ok) {
        alert("ContactType updated successfully");
        resetForm();
        fetchContactTypes();
      } else {
        alert("Failed to update ContactType");
      }
    } catch (error) {
      console.error("Error updating ContactType:", error);
      alert("An error occurred while updating ContactType");
    }
  };

  const handleEdit = (contactType) => {
    setContactTypeData(contactType);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this ContactType?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:5002/api/v1/ContactType/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("ContactType deleted successfully");
        fetchContactTypes();
      } else {
        alert("Failed to delete ContactType");
      }
    } catch (error) {
      console.error("Error deleting ContactType:", error);
      alert("An error occurred while deleting ContactType");
    }
  };

  const resetForm = () => {
    setContactTypeData({
      id: '',
      active: 0,
      fInsert: new Date().toISOString(),
      userName: 'RPablo',
      version: 1,
      fUpdate: new Date().toISOString(),
      userNameUpdate: 'RPablo',
      code: '',
      typeName: '',
      description: '',
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h2>{isEditing ? "Edit ContactType" : "Create ContactType"}</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label>ID: {contactTypeData.id}</label>
        </div>
        <div>
          <label>Code:</label>
          <input type="text" name="code" value={contactTypeData.code} onChange={handleChange} required />
        </div>
        <div>
          <label>Type Name:</label>
          <input type="text" name="typeName" value={contactTypeData.typeName} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={contactTypeData.description} onChange={handleChange} />
        </div>
        <button type="submit">{isEditing ? "Update ContactType" : "Create ContactType"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>ContactType List</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Type Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contactTypeList.map((contactType) => (
            <tr key={contactType.id}>
              <td>{contactType.code}</td>
              <td>{contactType.typeName}</td>
              <td>{contactType.description}</td>
              <td>
                <button onClick={() => handleEdit(contactType)}>Edit</button>
                <button onClick={() => handleDelete(contactType.id)}>Delete</button>
                <button onClick={() => handleViewDetails(contactType.id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContactTypeABM;
