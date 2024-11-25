// src/components/AttachmentABM.js
import React, { useState, useEffect } from 'react';

function AttachmentABM() {
  const [attachmentData, setAttachmentData] = useState({
    id: '',
    active: 0,
    fInsert: new Date().toISOString(),
    userName: 'RPablo',
    version: 1,
    fUpdate: new Date().toISOString(),
    userNameUpdate: 'RPablo',
    code: '',
    entityId: '',
    contactId: '',
    fileName: '',
    fileUrl: '',
    fileType: '',
  });
  const [attachmentList, setAttachmentList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAttachments();
  }, []);

  const fetchAttachments = async () => {
    try {
      const response = await fetch('https://localhost:5002/api/v1/Attachment/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch attachments');
      }

      const data = await response.json();
      setAttachmentList(data.data || []);
    } catch (error) {
      console.error("Error fetching attachments:", error);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`https://localhost:5002/api/v1/Attachment/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const attachment = result.data;
        alert(`
          Code: ${attachment.code}
          Entity ID: ${attachment.entityId}
          Contact ID: ${attachment.contactId}
          File Name: ${attachment.fileName}
          File URL: ${attachment.fileUrl}
          File Type: ${attachment.fileType}
        `);
      } else {
        alert("Failed to fetch attachment details");
      }
    } catch (error) {
      console.error("Error fetching attachment details:", error);
      alert("An error occurred while fetching attachment details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAttachmentData({ ...attachmentData, [name]: value });
  };

  const handleCreate = async (e) => {
    const dataToSend = { ...attachmentData };
    if (dataToSend.id === "") {
      delete dataToSend.id;
    }
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Attachment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("Attachment created successfully");
        resetForm();
        fetchAttachments();
      } else {
        alert("Failed to create attachment");
      }
    } catch (error) {
      console.error("Error creating attachment:", error);
      alert("An error occurred while creating attachment");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Attachment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({
          ...attachmentData,
          fUpdate: new Date().toISOString(),
          userNameUpdate: 'RPablo',
        }),
      });

      if (response.ok) {
        alert("Attachment updated successfully");
        resetForm();
        fetchAttachments();
      } else {
        alert("Failed to update attachment");
      }
    } catch (error) {
      console.error("Error updating attachment:", error);
      alert("An error occurred while updating attachment");
    }
  };

  const handleEdit = (attachment) => {
    setAttachmentData(attachment);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this attachment?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:5002/api/v1/Attachment/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("Attachment deleted successfully");
        fetchAttachments();
      } else {
        alert("Failed to delete attachment");
      }
    } catch (error) {
      console.error("Error deleting attachment:", error);
      alert("An error occurred while deleting attachment");
    }
  };

  const resetForm = () => {
    setAttachmentData({
      id: '',
      active: 0,
      fInsert: new Date().toISOString(),
      userName: 'RPablo',
      version: 1,
      fUpdate: new Date().toISOString(),
      userNameUpdate: 'RPablo',
      code: '',
      entityId: '',
      contactId: '',
      fileName: '',
      fileUrl: '',
      fileType: '',
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Attachment" : "Create Attachment"}</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label>ID: {attachmentData.id}</label>
        </div>
        <div>
          <label>Code:</label>
          <input type="text" name="code" value={attachmentData.code} onChange={handleChange} required />
        </div>
        <div>
          <label>Entity ID:</label>
          <input type="text" name="entityId" value={attachmentData.entityId} onChange={handleChange} required />
        </div>
        <div>
          <label>Contact ID:</label>
          <input type="text" name="contactId" value={attachmentData.contactId} onChange={handleChange} />
        </div>
        <div>
          <label>File Name:</label>
          <input type="text" name="fileName" value={attachmentData.fileName} onChange={handleChange} required />
        </div>
        <div>
          <label>File URL:</label>
          <input type="text" name="fileUrl" value={attachmentData.fileUrl} onChange={handleChange} required />
        </div>
        <div>
          <label>File Type:</label>
          <input type="text" name="fileType" value={attachmentData.fileType} onChange={handleChange} />
        </div>
        <button type="submit">{isEditing ? "Update Attachment" : "Create Attachment"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>Attachment List</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>File Name</th>
            <th>File URL</th>
            <th>File Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attachmentList.map((attachment) => (
            <tr key={attachment.id}>
              <td>{attachment.code}</td>
              <td>{attachment.fileName}</td>
              <td>{attachment.fileUrl}</td>
              <td>{attachment.fileType}</td>
              <td>
                <button onClick={() => handleEdit(attachment)}>Edit</button>
                <button onClick={() => handleDelete(attachment.id)}>Delete</button>
                <button onClick={() => handleViewDetails(attachment.id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttachmentABM;
