
import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/Inicio_de_sesion.css';  
import logo from '../assets/img/logo.png';

const InicioDeSesion = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    usuario: '',
    contraseña: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/api/sesion/login', formData);
      console.log(response.data);
      alert('Inicio de sesión exitoso');
      onLoginSuccess();
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
      <img src={logo} alt="Login Image" className="login-image" />
        <h1>INICIO DE SESION</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input type="text" name="usuario" placeholder="Nombre de usuario o correo" value={formData.usuario} onChange={handleChange} required />
          </div>
          <div className="input-container">
            <input type="password" name="contraseña" placeholder="Contraseña" value={formData.contraseña} onChange={handleChange} required />
          </div>
          <div className="forgot-password">
            <a href="#">¿Olvidó su contraseña?</a>
          </div>
          <button type="submit" className="login-button">Iniciar sesion</button>
        </form>
      </div>
    </div>
  );
};

export default InicioDeSesion;