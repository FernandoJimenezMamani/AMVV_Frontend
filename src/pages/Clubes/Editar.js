import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/css/Editar.css';

const EditarClub = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    user_id: 2,
    image: null 
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/club/get_club/${id}`);
        setFormData({
          nombre: response.data.nombre,
          descripcion: response.data.descripcion,
          user_id: response.data.user_id
        });
      } catch (error) {
        console.error('Error al obtener el club:', error);
      }
    };

    fetchClub();
  }, [id]);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({
        ...formData,
        image: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append('nombre', formData.nombre);
    formDataToSend.append('descripcion', formData.descripcion);
    formDataToSend.append('user_id', formData.user_id);
  
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
  
    try {
      await axios.put(`http://localhost:5002/api/club/update_club/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Club actualizado exitosamente');
      navigate('/clubes/indice');
    } catch (error) {
      console.error('Error al actualizar el club:', error);
      alert('Error al actualizar el club');
    }
  };  

  return (
  <div className="editar-club">
  <h2>Editar Club</h2>
  <form onSubmit={handleSubmit}>
  <label className="label-edit">Nombre del Club</label>
    <div className="form-group">
      <input
        type="text"
        id="nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Ingrese el nombre del club"
      />
    </div>
    <label className="label-edit">Descripción</label>
    <div className="form-group">
      <textarea
        id="descripcion"
        name="descripcion"
        value={formData.descripcion}
        onChange={handleChange}
        placeholder="Ingrese la descripción del club"
        rows="4"
      />
    </div>
      <div className="form-group">
      <button id="edit-club-btn" type="submit">Guardar Cambios</button>
      </div>
    
  </form>
</div>
  );  
};

export default EditarClub;
