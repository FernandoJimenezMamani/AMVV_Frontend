import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/css/Registro.css';
import { toast } from 'react-toastify';

const RegistroCategoria = () => {
  const [formData, setFormData] = useState({
    nombre: '',
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
      const response = await axios.post('http://localhost:5002/api/categoria/post_categoria', formData);
      console.log(response.data);
      toast.success('Registrado con éxito');
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      alert('Error al crear la categoría');
    }
  };

  return (
    <div className="registro-campeonato">
      <h2>Registrar Categoría</h2>
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
          <button id="RegCampBtn" type="submit">Registrar</button>
        </div>
      </form>
    </div>
  );
};

export default RegistroCategoria;
