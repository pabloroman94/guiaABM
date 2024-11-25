// src/components/AddressABM.js
import React, { useState, useEffect } from 'react';

function AddressABM() {
  const [addressData, setAddressData] = useState({
    id: '',
    active: 0,
    fInsert: new Date().toISOString(),
    userName: 'RPablo',
    version: 1,
    fUpdate: new Date().toISOString(),
    userNameUpdate: 'RPablo',
    code: '',
    entityId: '',
    addressTypeId: '',
    street: '',
    number: '',
    floor: '',
    door: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    latitude: 0,
    longitude: 0,
  });
  const [addressList, setAddressList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await fetch('https://localhost:5002/api/v1/Address/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      const data = await response.json();
      setAddressList(data.data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`https://localhost:5002/api/v1/Address/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const address = result.data;
        alert(`
          Code: ${address.code}
          Entity ID: ${address.entityId}
          Address Type ID: ${address.addressTypeId}
          Street: ${address.street}
          Number: ${address.number}
          Floor: ${address.floor}
          Door: ${address.door}
          City: ${address.city}
          State: ${address.state}
          Country: ${address.country}
          Zip Code: ${address.zipCode}
          Latitude: ${address.latitude}
          Longitude: ${address.longitude}
        `);
      } else {
        alert("Failed to fetch address details");
      }
    } catch (error) {
      console.error("Error fetching address details:", error);
      alert("An error occurred while fetching address details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData({ ...addressData, [name]: value });
  };

  const handleCreate = async (e) => {
    const dataToSend = { ...addressData };
    if (dataToSend.id === "") {
      delete dataToSend.id;
    }

    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("Address created successfully");
        resetForm();
        fetchAddresses();
      } else {
        alert("Failed to create address");
      }
    } catch (error) {
      console.error("Error creating address:", error);
      alert("An error occurred while creating address");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Address', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({
          ...addressData,
          fUpdate: new Date().toISOString(),
          userNameUpdate: 'RPablo',
        }),
      });

      if (response.ok) {
        alert("Address updated successfully");
        resetForm();
        fetchAddresses();
      } else {
        alert("Failed to update address");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      alert("An error occurred while updating address");
    }
  };

  const handleEdit = (address) => {
    setAddressData(address);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this address?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:5002/api/v1/Address/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("Address deleted successfully");
        fetchAddresses();
      } else {
        alert("Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("An error occurred while deleting address");
    }
  };

  const resetForm = () => {
    setAddressData({
      id: '',
      active: 0,
      fInsert: new Date().toISOString(),
      userName: 'RPablo',
      version: 1,
      fUpdate: new Date().toISOString(),
      userNameUpdate: 'RPablo',
      code: '',
      entityId: '',
      addressTypeId: '',
      street: '',
      number: '',
      floor: '',
      door: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      latitude: 0,
      longitude: 0,
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Address" : "Create Address"}</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label>Code:</label>
          <input type="text" name="code" value={addressData.code} onChange={handleChange} required />
        </div>
        <div>
          <label>Entity ID:</label>
          <input type="text" name="entityId" value={addressData.entityId} onChange={handleChange} required />
        </div>
        <div>
          <label>Address Type ID:</label>
          <input type="text" name="addressTypeId" value={addressData.addressTypeId} onChange={handleChange} required />
        </div>
        <div>
          <label>Street:</label>
          <input type="text" name="street" value={addressData.street} onChange={handleChange} />
        </div>
        <div>
          <label>Number:</label>
          <input type="text" name="number" value={addressData.number} onChange={handleChange} />
        </div>
        <div>
          <label>Floor:</label>
          <input type="text" name="floor" value={addressData.floor} onChange={handleChange} />
        </div>
        <div>
          <label>Door:</label>
          <input type="text" name="door" value={addressData.door} onChange={handleChange} />
        </div>
        <div>
          <label>City:</label>
          <input type="text" name="city" value={addressData.city} onChange={handleChange} />
        </div>
        <div>
          <label>State:</label>
          <input type="text" name="state" value={addressData.state} onChange={handleChange} />
        </div>
        <div>
          <label>Country:</label>
          <input type="text" name="country" value={addressData.country} onChange={handleChange} />
        </div>
        <div>
          <label>Zip Code:</label>
          <input type="text" name="zipCode" value={addressData.zipCode} onChange={handleChange} />
        </div>
        <div>
          <label>Latitude:</label>
          <input type="number" name="latitude" value={addressData.latitude} onChange={handleChange} />
        </div>
        <div>
          <label>Longitude:</label>
          <input type="number" name="longitude" value={addressData.longitude} onChange={handleChange} />
        </div>
        <button type="submit">{isEditing ? "Update Address" : "Create Address"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>Address List</h2>
      <table>
        <thead>
          <tr>
            <th>Street</th>
            <th>Number</th>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {addressList.map((address) => (
            <tr key={address.id}>
              <td>{address.street}</td>
              <td>{address.number}</td>
              <td>{address.city}</td>
              <td>{address.state}</td>
              <td>{address.country}</td>
              <td>
                <button onClick={() => handleEdit(address)}>Edit</button>
                <button onClick={() => handleDelete(address.id)}>Delete</button>
                <button onClick={() => handleViewDetails(address.id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AddressABM;
