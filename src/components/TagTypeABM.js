// src/components/TagTypeABM.js
import React, { useState, useEffect } from 'react';

function TagTypeABM() {
  const [tagTypeData, setTagTypeData] = useState({
    id: '',
    active: 1,
    fInsert: new Date().toISOString(),
    userName: 'RPablo',
    version: 1,
    fUpdate: new Date().toISOString(),
    userNameUpdate: 'RPablo',
    code: '',
    typeName: '',
    description: '',
  });
  const [tagTypeList, setTagTypeList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTagTypes();
  }, []);

  const fetchTagTypes = async () => {
    try {
      const response = await fetch('https://localhost:5002/api/v1/TagType/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch TagTypes');
      }

      const data = await response.json();
      setTagTypeList(data.data || []);
    } catch (error) {
      console.error("Error fetching TagTypes:", error);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`https://localhost:5002/api/v1/TagType/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const tagType = result.data;
        alert(`
          Code: ${tagType.code}
          Type Name: ${tagType.typeName}
          Description: ${tagType.description}
        `);
      } else {
        alert("Failed to fetch TagType details");
      }
    } catch (error) {
      console.error("Error fetching TagType details:", error);
      alert("An error occurred while fetching TagType details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTagTypeData({ ...tagTypeData, [name]: value });
  };

  const handleCreate = async (e) => {
    const dataToSend = { ...tagTypeData };
    if (dataToSend.id === "") {
      delete dataToSend.id;
    }
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/TagType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("TagType created successfully");
        resetForm();
        fetchTagTypes();
      } else {
        alert("Failed to create TagType");
      }
    } catch (error) {
      console.error("Error creating TagType:", error);
      alert("An error occurred while creating TagType");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/TagType', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({
          ...tagTypeData,
          fUpdate: new Date().toISOString(),
          userNameUpdate: 'RPablo',
        }),
      });

      if (response.ok) {
        alert("TagType updated successfully");
        resetForm();
        fetchTagTypes();
      } else {
        alert("Failed to update TagType");
      }
    } catch (error) {
      console.error("Error updating TagType:", error);
      alert("An error occurred while updating TagType");
    }
  };

  const handleEdit = (tagType) => {
    setTagTypeData(tagType);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this TagType?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:5002/api/v1/TagType/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("TagType deleted successfully");
        fetchTagTypes();
      } else {
        alert("Failed to delete TagType");
      }
    } catch (error) {
      console.error("Error deleting TagType:", error);
      alert("An error occurred while deleting TagType");
    }
  };

  const resetForm = () => {
    setTagTypeData({
      id: '',
      active: 1,
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
      <h2>{isEditing ? "Edit TagType" : "Create TagType"}</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label>ID: {tagTypeData.id}</label>
        </div>
        <div>
          <label>Code:</label>
          <input type="text" name="code" value={tagTypeData.code} onChange={handleChange} required />
        </div>
        <div>
          <label>Type Name:</label>
          <input type="text" name="typeName" value={tagTypeData.typeName} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={tagTypeData.description} onChange={handleChange} />
        </div>
        <button type="submit">{isEditing ? "Update TagType" : "Create TagType"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>TagType List</h2>
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
          {tagTypeList.map((tagType) => (
            <tr key={tagType.id}>
              <td>{tagType.code}</td>
              <td>{tagType.typeName}</td>
              <td>{tagType.description}</td>
              <td>
                <button onClick={() => handleEdit(tagType)}>Edit</button>
                <button onClick={() => handleDelete(tagType.id)}>Delete</button>
                <button onClick={() => handleViewDetails(tagType.id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TagTypeABM;
