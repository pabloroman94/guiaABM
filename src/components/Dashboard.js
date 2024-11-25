// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import api from '../axiosConfig';

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await api.get('/protected-endpoint'); // Cambia '/protected-endpoint' por el endpoint real de tu API
        setData(response.data);
      } catch (err) {
        setError("Error al obtener datos protegidos");
        console.error("Error fetching protected data", err);
      }
    };

    fetchProtectedData();
  }, []);

  return (
    <div>
      <h2>Bienvenido al Dashboard</h2>
      {error && <p>{error}</p>}
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Cargando datos...</p>}
      <br></br>
      <li><Link to="/create-person">Crear Persona</Link></li>
      <br></br>
      <li><Link to="/create-company">Crear company</Link></li>
      <button onClick={() => {
        localStorage.removeItem('token'); // Eliminar el token
        navigate('/login'); // Redirigir al login sin recargar la página
      }}>Cerrar Sesión</button>
    </div>
  );
}

export default Dashboard;
