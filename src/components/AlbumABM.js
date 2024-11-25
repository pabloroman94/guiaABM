// src/components/AlbumABM.js
import React, { useState, useEffect } from 'react';

function AlbumABM() {
  const [albumData, setAlbumData] = useState({
    id: '',
    active: 0,
    fInsert: new Date().toISOString(),
    userName: 'RPablo',
    version: 1,
    fUpdate: new Date().toISOString(),
    userNameUpdate: 'RPablo',
    code: '',
    entityId: '',
    albumName: '',
    description: '',
  });
  const [albumList, setAlbumList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await fetch('https://localhost:5002/api/v1/Album/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch albums');
      }

      const data = await response.json();
      setAlbumList(data.data || []);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`https://localhost:5002/api/v1/Album/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const album = result.data;
        alert(`
          Code: ${album.code}
          Album Name: ${album.albumName}
          Description: ${album.description}
        `);
      } else {
        alert("Failed to fetch album details");
      }
    } catch (error) {
      console.error("Error fetching album details:", error);
      alert("An error occurred while fetching album details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlbumData({ ...albumData, [name]: value });
  };

  const handleCreate = async (e) => {
    const dataToSend = { ...albumData };
    if (dataToSend.id === "") {
      delete dataToSend.id;
    }
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Album', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("Album created successfully");
        resetForm();
        fetchAlbums();
      } else {
        alert("Failed to create album");
      }
    } catch (error) {
      console.error("Error creating album:", error);
      alert("An error occurred while creating album");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Album', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({
          ...albumData,
          fUpdate: new Date().toISOString(),
          userNameUpdate: 'RPablo',
        }),
      });

      if (response.ok) {
        alert("Album updated successfully");
        resetForm();
        fetchAlbums();
      } else {
        alert("Failed to update album");
      }
    } catch (error) {
      console.error("Error updating album:", error);
      alert("An error occurred while updating album");
    }
  };

  const handleEdit = (album) => {
    setAlbumData(album);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this album?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:5002/api/v1/Album/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("Album deleted successfully");
        fetchAlbums();
      } else {
        alert("Failed to delete album");
      }
    } catch (error) {
      console.error("Error deleting album:", error);
      alert("An error occurred while deleting album");
    }
  };

  const resetForm = () => {
    setAlbumData({
      id: '',
      active: 0,
      fInsert: new Date().toISOString(),
      userName: 'RPablo',
      version: 1,
      fUpdate: new Date().toISOString(),
      userNameUpdate: 'RPablo',
      code: '',
      entityId: '',
      albumName: '',
      description: '',
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Album" : "Create Album"}</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label>ID: {albumData.id}</label>
        </div>
        <div>
          <label>Code:</label>
          <input type="text" name="code" value={albumData.code} onChange={handleChange} required />
        </div>
        <div>
          <label>Entity ID:</label>
          <input type="text" name="entityId" value={albumData.entityId} onChange={handleChange} required />
        </div>
        <div>
          <label>Album Name:</label>
          <input type="text" name="albumName" value={albumData.albumName} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={albumData.description} onChange={handleChange} />
        </div>
        <button type="submit">{isEditing ? "Update Album" : "Create Album"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>Album List</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Album Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {albumList.map((album) => (
            <tr key={album.id}>
              <td>{album.code}</td>
              <td>{album.albumName}</td>
              <td>{album.description}</td>
              <td>
                <button onClick={() => handleEdit(album)}>Edit</button>
                <button onClick={() => handleDelete(album.id)}>Delete</button>
                <button onClick={() => handleViewDetails(album.id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AlbumABM;
