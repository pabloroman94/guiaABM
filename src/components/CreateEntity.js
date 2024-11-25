// src/components/ManageEntity.js
import React, { useState, useEffect } from 'react';

function ManageEntity() {
  const [entityData, setEntityData] = useState({
    active: 0,
    fInsert: new Date().toISOString(),
    userName: 'RPablo',
    version: 1,
    fUpdate: new Date().toISOString(),
    userNameUpdate: 'RPablo',
    code: 'string',
    entityType: 'Person',
    profilePhotoUrl: '',
  });
  const [entityList, setEntityList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      const response = await fetch('https://localhost:5002/api/v1/Entity/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch entities');
      }

      const data = await response.json();
      setEntityList(data.data || []);
    } catch (error) {
      console.error("Error fetching entities:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntityData({ ...entityData, [name]: value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Entity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(entityData),
      });

      if (response.ok) {
        alert("Entity created successfully");
        resetForm();
        fetchEntities();
      } else {
        alert("Failed to create entity");
      }
    } catch (error) {
      console.error("Error creating entity:", error);
      alert("An error occurred while creating the entity");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://localhost:5002/api/v1/Entity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({
          ...entityData,
          fUpdate: new Date().toISOString(),
          userNameUpdate: 'RPablo',
        }),
      });

      if (response.ok) {
        alert("Entity updated successfully");
        resetForm();
        fetchEntities();
      } else {
        alert("Failed to update entity");
      }
    } catch (error) {
      console.error("Error updating entity:", error);
      alert("An error occurred while updating the entity");
    }
  };

  const handleEdit = (entity) => {
    setEntityData(entity);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this entity?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:5002/api/v1/Entity/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("Entity deleted successfully");
        fetchEntities();
      } else {
        alert("Failed to delete entity");
      }
    } catch (error) {
      console.error("Error deleting entity:", error);
      alert("An error occurred while deleting the entity");
    }
  };

  const resetForm = () => {
    setEntityData({
      active: 0,
      fInsert: new Date().toISOString(),
      userName: 'RPablo',
      version: 1,
      fUpdate: new Date().toISOString(),
      userNameUpdate: 'RPablo',
      code: 'string',
      entityType: 'Person',
      profilePhotoUrl: '',
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Entity" : "Create Entity"}</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label>Active:</label>
          <input type="number" name="active" value={entityData.active} onChange={handleChange} />
        </div>
        <div>
          <label>Code:</label>
          <input type="text" name="code" value={entityData.code} onChange={handleChange} required />
        </div>
        <div>
          <label>Entity Type:</label>
          <input type="text" name="entityType" value={entityData.entityType} onChange={handleChange} required />
        </div>
        <div>
          <label>Profile Photo URL:</label>
          <input type="text" name="profilePhotoUrl" value={entityData.profilePhotoUrl} onChange={handleChange} />
        </div>
        <button type="submit">{isEditing ? "Update Entity" : "Create Entity"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>Entity List</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Entity Type</th>
            <th>Profile Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entityList.map((entity) => (
            <tr key={entity.id}>
              <td>{entity.code}</td>
              <td>{entity.entityType}</td>
              <td><img src={entity.profilePhotoUrl} alt="Profile" width="50" /></td>
              <td>
                <button onClick={() => handleEdit(entity)}>Edit</button>
                <button onClick={() => handleDelete(entity.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageEntity;
