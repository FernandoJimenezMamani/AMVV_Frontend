import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/css/Campeonato.css'; // Usamos el mismo archivo CSS

const RegistroClub = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    user_id: 1
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/api/club/post_club', formData);
      console.log(response.data);
      alert('Club creado exitosamente');
    } catch (error) {
      console.error('Error al crear el club:', error);
      alert('Error al crear el club');
    }
  };

  return (
    <div className="registro-campeonato">
      <h2>Registrar Club</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Descripción"
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <button id="RegCampBtn" type="submit">Registrar</button>
        </div>
      </form>
    </div>
  );
};

export default RegistroClub;
