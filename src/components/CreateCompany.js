// src/components/CreateCompany.js
import React, { useState, useEffect } from 'react';

function CreateCompany() {
  const [companyData, setCompanyData] = useState({
    id: '',
    entityId: '',
    companyName: '',
    cuit: '',
    shortDescription: '',
    longDescription: '',
    active: 1,
    userName: 'RPablo',
    version: 1,
    code: 'string',
    fInsert: "2024-11-11T00:25:53.083Z",
    fUpdate: "2024-11-11T00:25:53.083Z",
    userNameUpdate: 'RPablo',
  });
  const [companyList, setCompanyList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('https://localhost:5002/api/v1/Company/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }

      const data = await response.json();
      setCompanyList(data.data || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`https://localhost:5002/api/v1/Company/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const company = result.data;
        alert(`
          Company Name: ${company.companyName}
          CUIT: ${company.cuit}
          Short Description: ${company.shortDescription}
          Long Description: ${company.longDescription}
        `);
      } else {
        alert("Failed to fetch company details");
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
      alert("An error occurred while fetching company details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
  };

  const handleCreate = async (e) => {
    debugger;
    // console.log("Datos de la compañía:", companyData);

    const dataToSend = { ...companyData };
    if (dataToSend.id === "") {
      delete dataToSend.id;
    }

    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert("Company created successfully");
        resetForm();
        fetchCompanies();
      } else {
        alert("Failed to create company");
      }
    } catch (error) {
      console.error("Error creating company:", error);
      alert("An error occurred while creating company");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Company', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({
          ...companyData,
          fUpdate: new Date().toISOString(),
          userNameUpdate: 'RPablo',
        }),
      });

      if (response.ok) {
        alert("Company updated successfully");
        resetForm();
        fetchCompanies();
      } else {
        alert("Failed to update company");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      alert("An error occurred while updating company");
    }
  };

  const handleEdit = (company) => {
    setCompanyData(company);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this company?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:5002/api/v1/Company/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert("Company deleted successfully");
        fetchCompanies();
      } else {
        alert("Failed to delete company");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      alert("An error occurred while deleting company");
    }
  };

  const resetForm = () => {
    setCompanyData({
      id: '',
      entityId: '',
      companyName: '',
      cuit: '',
      shortDescription: '',
      longDescription: '',
      active: 1,
      userName: 'RPablo',
      version: 1,
      code: 'string',
      fInsert: new Date().toISOString(),
      fUpdate: new Date().toISOString(),
      userNameUpdate: 'RPablo',
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Company" : "Create Company"}</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        <div>
          <label>Entity ID:</label>
          <input type="text" name="entityId" value={companyData.entityId} onChange={handleChange} required />
        </div>
        <div>
          <label>Company Name:</label>
          <input type="text" name="companyName" value={companyData.companyName} onChange={handleChange} required />
        </div>
        <div>
          <label>CUIT:</label>
          <input type="text" name="cuit" value={companyData.cuit} onChange={handleChange} />
        </div>
        <div>
          <label>Short Description:</label>
          <input type="text" name="shortDescription" value={companyData.shortDescription} onChange={handleChange} />
        </div>
        <div>
          <label>Long Description:</label>
          <textarea name="longDescription" value={companyData.longDescription} onChange={handleChange} />
        </div>
        <button type="submit">{isEditing ? "Update Company" : "Create Company"}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>Company List</h2>
      <table>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>CUIT</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companyList.map((company) => (
            <tr key={company.id}>
              <td>{company.companyName}</td>
              <td>{company.cuit}</td>
              <td>
                <button onClick={() => handleEdit(company)}>Edit</button>
                <button onClick={() => handleDelete(company.id)}>Delete</button>
                <button onClick={() => handleViewDetails(company.id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CreateCompany;
