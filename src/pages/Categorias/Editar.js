import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/css/Editar.css';

const EditarCategoria = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    user_id: 2
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/categoria/get_categoria/${id}`);
        setFormData({
          nombre: response.data.nombre,
          user_id: response.data.user_id
        });
      } catch (error) {
        console.error('Error al obtener la categoría:', error);
      }
    };

    fetchCategoria();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5002/api/categoria/update_categoria/${id}`, formData);
      alert('Categoría actualizada exitosamente');
      navigate('/categorias/indice');
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
      alert('Error al actualizar la categoría');
    }
  };

  return (
    <div className="editar-club">
      <h2>Editar Categoría</h2>
      <form onSubmit={handleSubmit}>
      <label className="label-edit">Nombre de la Categoría</label>
        <div className="form-group">
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre de la categoría"
          />
        </div>
        <div className="form-group">
      <button id="edit-club-btn" type="submit">Guardar Cambios</button>
      </div>
      </form>
    </div>
  );
};

export default EditarCategoria;
