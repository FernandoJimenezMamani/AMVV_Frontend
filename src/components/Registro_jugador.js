import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/Registro_jugador.css';

const Registro_jugador = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    ci: '',
    direccion: '',
    usuario: '',
    contraseña: '',
    correo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/api/jugadores/post_player', formData);
      console.log(response.data);
      alert('Jugador creado con éxito');
    } catch (error) {
      console.error('Error al crear el jugador:', error);
      alert('Error al crear el jugador');
    }
  };

  return (
    <div className="registro-container">
      <h1>Registrar jugador</h1>
      <form onSubmit={handleSubmit} className="registro-form">
        <div className="form-group">
          <label>Nombre:</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Apellido:</label>
          <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Fecha de Nacimiento:</label>
          <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>CI:</label>
          <input type="text" name="ci" value={formData.ci} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Dirección:</label>
          <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Usuario:</label>
          <input type="text" name="usuario" value={formData.usuario} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Correo:</label>
          <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
        </div>
        <button type="submit" className="submit-button">Crear Jugador</button>
      </form>
    </div>
  );
};

export default Registro_jugador;