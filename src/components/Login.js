// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /*const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        setError('Credenciales incorrectas');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Guarda el token en localStorage
      navigate('./Dashboard'); // Redirige al dashboard
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };*/

  const handleLogin = async (e) => {
    debugger;
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:5002/api/v1/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      if (!response.ok) {
        setError('Credenciales incorrectas');
        return;
      }
  
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token); // Guarda el token en localStorage
        navigate('/dashboard'); // Redirige al dashboard
      } else {
        setError('Error al guardar el token');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };
  

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      <br></br>
      <li><Link to="/create-entity">1 Crear entity</Link></li>
      <br></br>
      <li><Link to="/create-customer">2 Crear user</Link></li>
    </div>
  );
}

export default Login;
