// src/components/CreateCustomer.js
import React, { useState, useEffect } from 'react';

function CreateCustomer() {
  const [customerData, setCustomerData] = useState({
    // id: '',
    entityId: '',
    userNameLogin: '',
    password: '',
    userTypeId: '',
    lastLogin: '2024-11-22T19:51:00Z', // Asegúrate de que esté en el mismo formato
    active: 1,
    fInsert: new Date().toISOString(),
    userName: 'RPablo',
    version: 1,
    fUpdate: new Date().toISOString(), // Agrega fUpdate
  userNameUpdate: 'RPablo', // Agrega userNameUpdate
    code: 'string',
  });
  const [customerList, setCustomerList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Obtener todos los clientes
  const fetchCustomers = async () => {
    try {
      const response = await fetch('https://localhost:5002/api/v1/Customer/GetAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data = await response.json();
      setCustomerList(data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  // Ver detalles de un cliente
  const handleViewDetails = async (id) => {
    try {
      const response = await fetch(`https://localhost:5002/api/v1/Customer/${id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const customer = result.data;
        alert(`
          User Name Login: ${customer.userNameLogin}
          Last Login: ${customer.lastLogin}
          Entity ID: ${customer.entityId}
          User Type ID: ${customer.userTypeId}
        `);
      } else {
        alert('Failed to fetch customer details');
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
      alert('An error occurred while fetching customer details');
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  // Crear un nuevo cliente
  const handleCreate = async (e) => {
    debugger;
    e.preventDefault();
    try {
        console.log(customerData); // Verificar los datos antes de enviar la solicitud
      const response = await fetch('https://localhost:5002/api/v1/Customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify(customerData),
      });

      if (response.ok) {
        alert('Customer created successfully');
        resetForm();
        fetchCustomers();
      } else {
        alert('Failed to create customer');
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('An error occurred while creating customer');
    }
  };

  // Actualizar un cliente existente
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Customer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({
          ...customerData,
          fUpdate: new Date().toISOString(),
          userNameUpdate: 'RPablo',
        }),
      });

      if (response.ok) {
        alert('Customer updated successfully');
        resetForm();
        fetchCustomers();
      } else {
        alert('Failed to update customer');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('An error occurred while updating customer');
    }
  };

  // Cargar datos de un cliente para editar
  const handleEdit = (customer) => {
    setCustomerData(customer);
    setIsEditing(true);
  };

  // Eliminar un cliente
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this customer?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:5002/api/v1/Customer/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Customer deleted successfully');
        fetchCustomers();
      } else {
        alert('Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('An error occurred while deleting customer');
    }
  };

  // Resetear el formulario
  const resetForm = () => {
    setCustomerData({
    //   id: '',
      entityId: '',
      userNameLogin: '',
      password: '',
      userTypeId: '',
      lastLogin: '',
      active: 1,
      fInsert: new Date().toISOString(),
      userName: 'RPablo',
      version: 1,
      code: 'string',
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h2>{isEditing ? 'Edit Customer' : 'Create Customer'}</h2>
      <form onSubmit={isEditing ? handleUpdate : handleCreate}>
        {/* <div>
          <label>ID: {customerData.id}</label>
        </div> */}
        <div>
          <label>Entity ID:</label>
          <input type="text" name="entityId" value={customerData.entityId} onChange={handleChange} required />
        </div>
        <div>
          <label>User Name Login:</label>
          <input
            type="text"
            name="userNameLogin"
            value={customerData.userNameLogin}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={customerData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>User Type ID:</label>
          <input type="text" name="userTypeId" value={customerData.userTypeId} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Login:</label>
          <input type="datetime-local" name="lastLogin" value={customerData.lastLogin} onChange={handleChange} />
        </div>
        <button type="submit">{isEditing ? 'Update Customer' : 'Create Customer'}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>Customer List</h2>
      <table>
        <thead>
          <tr>
            <th>User Name Login</th>
            <th>Last Login</th>
            <th>Entity ID</th>
            <th>User Type ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customerList.map((customer) => (
            <tr key={customer.userNameLogin}>
              <td>{customer.userNameLogin}</td>
              <td>{customer.lastLogin}</td>
              <td>{customer.entityId}</td>
              <td>{customer.userTypeId}</td>
              <td>
                <button onClick={() => handleEdit(customer)}>Edit</button>
                <button onClick={() => handleDelete(customer.id)}>Delete</button>
                <button onClick={() => handleViewDetails(customer.id)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CreateCustomer;
