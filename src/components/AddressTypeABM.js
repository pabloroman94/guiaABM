// src/components/AddressTypeABM.js
import React, { useState, useEffect } from 'react';

function AddressTypeABM() {
  const [addressTypeData, setAddressTypeData] = useState({
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
  const [addressTypeList, setAddressTypeList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAddressTypes();
  }, []);

  const fetchAddressTypes = async () => {
    try {
      const response = await fetch('https://localhost:5002/api/v1/AddressType/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AddressTypes');
      }

      const data = await response.json();
      setAddressTypeList(data.data || []);
    } catch (error) {
      console.error("Error fetching AddressTypes:", error);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`https://localhost:5002/api/v1/AddressType/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const addressType = result.data;
        alert(`
          Code: ${addressType.code}
          Type Name: ${addressType.typeName}
          Description: ${addressType.description}
        `);
      } else {
        alert("Failed to fetch AddressType details");
      }
    } catch (error) {
      console.error("Error fetching AddressType details:", error);
      alert("An error occurred while fetching AddressType details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressTypeData({ ...addressTypeData, [name]: value });
  };

  const handleCreate = async (e) => {
    const dataToSend = { ...addressTypeData };
    if (dataToSend.id === "") {
      delete dataToSend.id;
    }

    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/AddressType', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("AddressType created successfully");
        resetForm();
        fetchAddressTypes();
      } else {
        alert("Failed to create AddressType");
      }
    } catch (error) {
      console.error("Error creating AddressType:", error);
      alert("An error occurred while creating AddressType");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/AddressType', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({
          ...addressTypeData,
          fUpdate: new Date().toISOString(),
          userNameUpdate: 'RPablo',
        }),
      });

      if (response.ok) {
        alert("AddressType updated successfully");
        resetForm();
        fetchAddressTypes();
      } else {
        alert("Failed to update AddressType");
      }
    } catch (error) {
      console.error("Error updating AddressType:", error);
      alert("An error occurred while updating AddressType");
    }
  };

  const handleEdit = (addressType) => {
    setAddressTypeData(addressType);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this AddressType?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:5002/api/v1/AddressType/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("AddressType deleted successfully");
        fetchAddressTypes();
      } else {
        alert("Failed to delete AddressType");
      }
    } catch (error) {
      console.error("Error deleting AddressType:", error);
      alert("An error occurred while deleting AddressType");
    }
  };

  const resetForm = () => {
    setAddressTypeData({
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
      <h2>{isEditing ? "Edit AddressType" : "Create AddressType"}</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label>ID: {addressTypeData.id}</label>
        </div>
        <div>
          <label>Code:</label>
          <input type="text" name="code" value={addressTypeData.code} onChange={handleChange} required />
        </div>
        <div>
          <label>Type Name:</label>
          <input type="text" name="typeName" value={addressTypeData.typeName} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={addressTypeData.description} onChange={handleChange} />
        </div>
        <button type="submit">{isEditing ? "Update AddressType" : "Create AddressType"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>AddressType List</h2>
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
          {addressTypeList.map((addressType) => (
            <tr key={addressType.id}>
              <td>{addressType.code}</td>
              <td>{addressType.typeName}</td>
              <td>{addressType.description}</td>
              <td>
                <button onClick={() => handleEdit(addressType)}>Edit</button>
                <button onClick={() => handleDelete(addressType.id)}>Delete</button>
                <button onClick={() => handleViewDetails(addressType.id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AddressTypeABM;
