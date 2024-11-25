// src/components/PhotoABM.js
import React, { useState, useEffect } from 'react';

function PhotoABM() {
  const [photoData, setPhotoData] = useState({
    id: '',
    active: 0,
    fInsert: new Date().toISOString(),
    userName: 'RPablo',
    version: 1,
    fUpdate: new Date().toISOString(),
    userNameUpdate: 'RPablo',
    code: '',
    albumId: '',
    photoUrl: '',
    caption: '',
  });
  const [photoList, setPhotoList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('https://localhost:5002/api/v1/Photo/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Photos');
      }

      const data = await response.json();
      setPhotoList(data.data || []);
    } catch (error) {
      console.error("Error fetching Photos:", error);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`https://localhost:5002/api/v1/Photo/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const photo = result.data;
        alert(`
          Code: ${photo.code}
          Album ID: ${photo.albumId}
          Photo URL: ${photo.photoUrl}
          Caption: ${photo.caption}
        `);
      } else {
        alert("Failed to fetch Photo details");
      }
    } catch (error) {
      console.error("Error fetching Photo details:", error);
      alert("An error occurred while fetching Photo details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPhotoData({ ...photoData, [name]: value });
  };

  const handleCreate = async (e) => {
    const dataToSend = { ...photoData };
    if (dataToSend.id === "") {
      delete dataToSend.id;
    }
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("Photo created successfully");
        resetForm();
        fetchPhotos();
      } else {
        alert("Failed to create Photo");
      }
    } catch (error) {
      console.error("Error creating Photo:", error);
      alert("An error occurred while creating Photo");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Photo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({
          ...photoData,
          fUpdate: new Date().toISOString(),
          userNameUpdate: 'RPablo',
        }),
      });

      if (response.ok) {
        alert("Photo updated successfully");
        resetForm();
        fetchPhotos();
      } else {
        alert("Failed to update Photo");
      }
    } catch (error) {
      console.error("Error updating Photo:", error);
      alert("An error occurred while updating Photo");
    }
  };

  const handleEdit = (photo) => {
    setPhotoData(photo);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Photo?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:5002/api/v1/Photo/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("Photo deleted successfully");
        fetchPhotos();
      } else {
        alert("Failed to delete Photo");
      }
    } catch (error) {
      console.error("Error deleting Photo:", error);
      alert("An error occurred while deleting Photo");
    }
  };

  const resetForm = () => {
    setPhotoData({
      id: '',
      active: 0,
      fInsert: new Date().toISOString(),
      userName: 'RPablo',
      version: 1,
      fUpdate: new Date().toISOString(),
      userNameUpdate: 'RPablo',
      code: '',
      albumId: '',
      photoUrl: '',
      caption: '',
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Photo" : "Create Photo"}</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label>ID: {photoData.id}</label>
        </div>
        <div>
          <label>Code:</label>
          <input type="text" name="code" value={photoData.code} onChange={handleChange} required />
        </div>
        <div>
          <label>Album ID:</label>
          <input type="text" name="albumId" value={photoData.albumId} onChange={handleChange} required />
        </div>
        <div>
          <label>Photo URL:</label>
          <input type="text" name="photoUrl" value={photoData.photoUrl} onChange={handleChange} required />
        </div>
        <div>
          <label>Caption:</label>
          <textarea name="caption" value={photoData.caption} onChange={handleChange} />
        </div>
        <button type="submit">{isEditing ? "Update Photo" : "Create Photo"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>Photo List</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Album ID</th>
            <th>Photo URL</th>
            <th>Caption</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {photoList.map((photo) => (
            <tr key={photo.id}>
              <td>{photo.code}</td>
              <td>{photo.albumId}</td>
              <td>{photo.photoUrl}</td>
              <td>{photo.caption}</td>
              <td>
                <button onClick={() => handleEdit(photo)}>Edit</button>
                <button onClick={() => handleDelete(photo.id)}>Delete</button>
                <button onClick={() => handleViewDetails(photo.id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PhotoABM;
