// src/components/TagABM.js
import React, { useState, useEffect } from 'react';

function TagABM() {
  const [tagData, setTagData] = useState({
    id: '',
    active: 0,
    fInsert: new Date().toISOString(),
    userName: 'RPablo',
    version: 1,
    fUpdate: new Date().toISOString(),
    userNameUpdate: 'RPablo',
    code: '',
    tagName: '',
    tagTypeId: '',
  });
  const [tagList, setTagList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('https://localhost:5002/api/v1/Tag/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Tags');
      }

      const data = await response.json();
      setTagList(data.data || []);
    } catch (error) {
      console.error("Error fetching Tags:", error);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`https://localhost:5002/api/v1/Tag/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const tag = result.data;
        alert(`
          Code: ${tag.code}
          Tag Name: ${tag.tagName}
          Tag Type ID: ${tag.tagTypeId}
        `);
      } else {
        alert("Failed to fetch Tag details");
      }
    } catch (error) {
      console.error("Error fetching Tag details:", error);
      alert("An error occurred while fetching Tag details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTagData({ ...tagData, [name]: value });
  };

  const handleCreate = async (e) => {
    const dataToSend = { ...tagData };
    if (dataToSend.id === "") {
      delete dataToSend.id;
    }
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Tag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("Tag created successfully");
        resetForm();
        fetchTags();
      } else {
        alert("Failed to create Tag");
      }
    } catch (error) {
      console.error("Error creating Tag:", error);
      alert("An error occurred while creating Tag");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Tag', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({
          ...tagData,
          fUpdate: new Date().toISOString(),
          userNameUpdate: 'RPablo',
        }),
      });

      if (response.ok) {
        alert("Tag updated successfully");
        resetForm();
        fetchTags();
      } else {
        alert("Failed to update Tag");
      }
    } catch (error) {
      console.error("Error updating Tag:", error);
      alert("An error occurred while updating Tag");
    }
  };

  const handleEdit = (tag) => {
    setTagData(tag);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Tag?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:5002/api/v1/Tag/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("Tag deleted successfully");
        fetchTags();
      } else {
        alert("Failed to delete Tag");
      }
    } catch (error) {
      console.error("Error deleting Tag:", error);
      alert("An error occurred while deleting Tag");
    }
  };

  const resetForm = () => {
    setTagData({
      id: '',
      active: 0,
      fInsert: new Date().toISOString(),
      userName: 'RPablo',
      version: 1,
      fUpdate: new Date().toISOString(),
      userNameUpdate: 'RPablo',
      code: '',
      tagName: '',
      tagTypeId: '',
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Tag" : "Create Tag"}</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label>ID: {tagData.id}</label>
        </div>
        <div>
          <label>Code:</label>
          <input type="text" name="code" value={tagData.code} onChange={handleChange} required />
        </div>
        <div>
          <label>Tag Name:</label>
          <input type="text" name="tagName" value={tagData.tagName} onChange={handleChange} required />
        </div>
        <div>
          <label>Tag Type ID:</label>
          <input type="text" name="tagTypeId" value={tagData.tagTypeId} onChange={handleChange} required />
        </div>
        <button type="submit">{isEditing ? "Update Tag" : "Create Tag"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>Tag List</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Tag Name</th>
            <th>Tag Type ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tagList.map((tag) => (
            <tr key={tag.id}>
              <td>{tag.code}</td>
              <td>{tag.tagName}</td>
              <td>{tag.tagTypeId}</td>
              <td>
                <button onClick={() => handleEdit(tag)}>Edit</button>
                <button onClick={() => handleDelete(tag.id)}>Delete</button>
                <button onClick={() => handleViewDetails(tag.id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TagABM;
