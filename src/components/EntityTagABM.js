// src/components/EntityTagABM.js
import React, { useState, useEffect } from 'react';

function EntityTagABM() {
  const [entityTagData, setEntityTagData] = useState({
    id: '',
    active: 1,
    fInsert: new Date().toISOString(),
    userName: 'RPablo',
    version: 1,
    fUpdate: new Date().toISOString(),
    userNameUpdate: 'RPablo',
    code: '',
    entityId: '',
    tagId: '',
  });
  const [entityTagList, setEntityTagList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEntityTags();
  }, []);

  const fetchEntityTags = async () => {
    try {
      const response = await fetch('https://localhost:5002/api/v1/EntityTag/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch EntityTags');
      }

      const data = await response.json();
      setEntityTagList(data.data || []);
    } catch (error) {
      console.error("Error fetching EntityTags:", error);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`https://localhost:5002/api/v1/EntityTag/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const entityTag = result.data;
        alert(`
          Code: ${entityTag.code}
          Entity ID: ${entityTag.entityId}
          Tag ID: ${entityTag.tagId}
        `);
      } else {
        alert("Failed to fetch EntityTag details");
      }
    } catch (error) {
      console.error("Error fetching EntityTag details:", error);
      alert("An error occurred while fetching EntityTag details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntityTagData({ ...entityTagData, [name]: value });
  };

  const handleCreate = async (e) => {
    const dataToSend = { ...entityTagData };
    if (dataToSend.id === "") {
      delete dataToSend.id;
    }

    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/EntityTag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("EntityTag created successfully");
        resetForm();
        fetchEntityTags();
      } else {
        alert("Failed to create EntityTag");
      }
    } catch (error) {
      console.error("Error creating EntityTag:", error);
      alert("An error occurred while creating EntityTag");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/EntityTag', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({
          ...entityTagData,
          fUpdate: new Date().toISOString(),
          userNameUpdate: 'RPablo',
        }),
      });

      if (response.ok) {
        alert("EntityTag updated successfully");
        resetForm();
        fetchEntityTags();
      } else {
        alert("Failed to update EntityTag");
      }
    } catch (error) {
      console.error("Error updating EntityTag:", error);
      alert("An error occurred while updating EntityTag");
    }
  };

  const handleEdit = (entityTag) => {
    setEntityTagData(entityTag);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this EntityTag?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:5002/api/v1/EntityTag/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("EntityTag deleted successfully");
        fetchEntityTags();
      } else {
        alert("Failed to delete EntityTag");
      }
    } catch (error) {
      console.error("Error deleting EntityTag:", error);
      alert("An error occurred while deleting EntityTag");
    }
  };

  const resetForm = () => {
    setEntityTagData({
      id: '',
      active: 1,
      fInsert: new Date().toISOString(),
      userName: 'RPablo',
      version: 1,
      fUpdate: new Date().toISOString(),
      userNameUpdate: 'RPablo',
      code: '',
      entityId: '',
      tagId: '',
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h2>{isEditing ? "Edit EntityTag" : "Create EntityTag"}</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label>ID: {entityTagData.id}</label>
        </div>
        <div>
          <label>Code:</label>
          <input type="text" name="code" value={entityTagData.code} onChange={handleChange} required />
        </div>
        <div>
          <label>Entity ID:</label>
          <input type="text" name="entityId" value={entityTagData.entityId} onChange={handleChange} required />
        </div>
        <div>
          <label>Tag ID:</label>
          <input type="text" name="tagId" value={entityTagData.tagId} onChange={handleChange} required />
        </div>
        <button type="submit">{isEditing ? "Update EntityTag" : "Create EntityTag"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>EntityTag List</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Entity ID</th>
            <th>Tag ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entityTagList.map((entityTag) => (
            <tr key={entityTag.id}>
              <td>{entityTag.code}</td>
              <td>{entityTag.entityId}</td>
              <td>{entityTag.tagId}</td>
              <td>
                <button onClick={() => handleEdit(entityTag)}>Edit</button>
                <button onClick={() => handleDelete(entityTag.id)}>Delete</button>
                <button onClick={() => handleViewDetails(entityTag.id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EntityTagABM;
