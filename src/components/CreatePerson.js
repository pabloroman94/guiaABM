// src/components/CreatePerson.js
import React, { useState, useEffect } from 'react';

function CreatePerson() {
  const [personData, setPersonData] = useState({
    id: '',
    entityId: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    cuit: '',
    idNumber: '',
    shortDescription: '',
    longDescription: '',
    active: 1,
    userName: 'RPablo',
    version: 1,
    code: 'string',
  });
  const [peopleList, setPeopleList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const response = await fetch('https://localhost:5002/api/v1/Person/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch people');
      }

      const data = await response.json();
      setPeopleList(data.data || []);
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  // Fetch person details by ID and display in an alert
  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`https://localhost:5002/api/v1/Person/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const person = result.data; // Accedemos a los datos de la persona dentro de "data"
      alert(`
        First Name: ${person.firstName}
        Last Name: ${person.lastName}
        Birth Date: ${person.birthDate}
        CUIT: ${person.cuit}
        ID Number: ${person.idNumber}
        Short Description: ${person.shortDescription}
        Long Description: ${person.longDescription}
      `);
      } else {
        alert("Failed to fetch person details");
      }
    } catch (error) {
      console.error("Error fetching person details:", error);
      alert("An error occurred while fetching person details");
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonData({ ...personData, [name]: value });
  };

  // Submit the form to create a person
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Person', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(personData),
      });

      if (response.ok) {
        alert("Person created successfully");
        resetForm();
        fetchPeople();
      } else {
        alert("Failed to create person");
      }
    } catch (error) {
      console.error("Error creating person:", error);
      alert("An error occurred while creating person");
    }
  };

  // Submit the form to update a person
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Person', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({
          ...personData,
          fUpdate: new Date().toISOString(),
          userNameUpdate: 'RPablo',
        }),
      });

      if (response.ok) {
        alert("Person updated successfully");
        resetForm();
        fetchPeople();
      } else {
        alert("Failed to update person");
      }
    } catch (error) {
      console.error("Error updating person:", error);
      alert("An error occurred while updating person");
    }
  };

  // Load selected person's data into the form for editing
  const handleEdit = (person) => {
    setPersonData(person);
    setIsEditing(true);
  };

  // Delete a person
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this person?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:5002/api/v1/Person/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("Person deleted successfully");
        fetchPeople();
      } else {
        alert("Failed to delete person");
      }
    } catch (error) {
      console.error("Error deleting person:", error);
      alert("An error occurred while deleting person");
    }
  };

  // Reset the form and cancel editing mode
  const resetForm = () => {
    setPersonData({
      id: '',
      entityId: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      cuit: '',
      idNumber: '',
      shortDescription: '',
      longDescription: '',
      active: 1,
      userName: 'RPablo',
      version: 1,
      code: 'string',
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Person" : "Create Person"}</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label>ID: {personData.id} </label>
          {/* <input type="text" value={personData.id} onChange={handleChange} required /> */}
        </div>
        <div>
          <label>Entity ID:</label>
          <input type="text" name="entityId" value={personData.entityId} onChange={handleChange} required />
        </div>
        <div>
          <label>First Name:</label>
          <input type="text" name="firstName" value={personData.firstName} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="lastName" value={personData.lastName} onChange={handleChange} required />
        </div>
        <div>
          <label>Birth Date:</label>
          <input type="date" name="birthDate" value={personData.birthDate} onChange={handleChange} />
        </div>
        <div>
          <label>CUIT:</label>
          <input type="text" name="cuit" value={personData.cuit} onChange={handleChange} />
        </div>
        <div>
          <label>ID Number:</label>
          <input type="text" name="idNumber" value={personData.idNumber} onChange={handleChange} />
        </div>
        <div>
          <label>Short Description:</label>
          <input type="text" name="shortDescription" value={personData.shortDescription} onChange={handleChange} />
        </div>
        <div>
          <label>Long Description:</label>
          <textarea name="longDescription" value={personData.longDescription} onChange={handleChange} />
        </div>
        <button type="submit">{isEditing ? "Update Person" : "Create Person"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>People List</h2>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>CUIT</th>
            <th>ID Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {peopleList.map((person) => (
            <tr key={person.id}>
              <td>{person.firstName}</td>
              <td>{person.lastName}</td>
              <td>{person.cuit}</td>
              <td>{person.idNumber}</td>
              <td>
                <button onClick={() => handleEdit(person)}>Edit</button>
                <button onClick={() => handleDelete(person.id)}>Delete</button>
                <button onClick={() => handleViewDetails(person.id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CreatePerson;
