// src/components/ContactABM.js
import React, { useState, useEffect } from 'react';

function ContactABM() {
  const [contactData, setContactData] = useState({
    id: '',
    active: 0,
    fInsert: new Date().toISOString(),
    userName: 'RPablo',
    version: 1,
    fUpdate: new Date().toISOString(),
    userNameUpdate: 'RPablo',
    code: '',
    entityId: '',
    contactTypeId: '',
    contactValue: '',
    preferred: false,
  });
  const [contactList, setContactList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('https://localhost:5002/api/v1/Contact/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Contacts');
      }

      const data = await response.json();
      setContactList(data.data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`https://localhost:5002/api/v1/Contact/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const contact = result.data;
        alert(`
          Code: ${contact.code}
          Entity ID: ${contact.entityId}
          Contact Type ID: ${contact.contactTypeId}
          Contact Value: ${contact.contactValue}
          Preferred: ${contact.preferred ? "Yes" : "No"}
        `);
      } else {
        alert("Failed to fetch contact details");
      }
    } catch (error) {
      console.error("Error fetching contact details:", error);
      alert("An error occurred while fetching contact details");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContactData({
      ...contactData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCreate = async (e) => {
    const dataToSend = { ...contactData };
    if (dataToSend.id === "") {
      delete dataToSend.id;
    }
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("Contact created successfully");
        resetForm();
        fetchContacts();
      } else {
        alert("Failed to create contact");
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      alert("An error occurred while creating contact");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({
          ...contactData,
          fUpdate: new Date().toISOString(),
          userNameUpdate: 'RPablo',
        }),
      });

      if (response.ok) {
        alert("Contact updated successfully");
        resetForm();
        fetchContacts();
      } else {
        alert("Failed to update contact");
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("An error occurred while updating contact");
    }
  };

  const handleEdit = (contact) => {
    setContactData(contact);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this contact?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:5002/api/v1/Contact/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("Contact deleted successfully");
        fetchContacts();
      } else {
        alert("Failed to delete contact");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("An error occurred while deleting contact");
    }
  };

  const resetForm = () => {
    setContactData({
      id: '',
      active: 0,
      fInsert: new Date().toISOString(),
      userName: 'RPablo',
      version: 1,
      fUpdate: new Date().toISOString(),
      userNameUpdate: 'RPablo',
      code: '',
      entityId: '',
      contactTypeId: '',
      contactValue: '',
      preferred: false,
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Contact" : "Create Contact"}</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label>ID: {contactData.id}</label>
        </div>
        <div>
          <label>Code:</label>
          <input type="text" name="code" value={contactData.code} onChange={handleChange} required />
        </div>
        <div>
          <label>Entity ID:</label>
          <input type="text" name="entityId" value={contactData.entityId} onChange={handleChange} required />
        </div>
        <div>
          <label>Contact Type ID:</label>
          <input type="text" name="contactTypeId" value={contactData.contactTypeId} onChange={handleChange} required />
        </div>
        <div>
          <label>Contact Value:</label>
          <input type="text" name="contactValue" value={contactData.contactValue} onChange={handleChange} required />
        </div>
        <div>
          <label>Preferred:</label>
          <input type="checkbox" name="preferred" checked={contactData.preferred} onChange={handleChange} />
        </div>
        <button type="submit">{isEditing ? "Update Contact" : "Create Contact"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>Contact List</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Entity ID</th>
            <th>Contact Type ID</th>
            <th>Contact Value</th>
            <th>Preferred</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contactList.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.code}</td>
              <td>{contact.entityId}</td>
              <td>{contact.contactTypeId}</td>
              <td>{contact.contactValue}</td>
              <td>{contact.preferred ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleEdit(contact)}>Edit</button>
                <button onClick={() => handleDelete(contact.id)}>Delete</button>
                <button onClick={() => handleViewDetails(contact.id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContactABM;
