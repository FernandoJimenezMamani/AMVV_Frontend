import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/css/Equipos/EquiposEditar.css'; // Usamos el mismo archivo CSS

const EditarEquipo = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    club_id: '',
    categoria_id: '',
    user_id: 1
  });
  const [clubes, setClubes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipo = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/equipo/get_equipo/${id}`);
        setFormData({
          nombre: response.data.nombre,
          club_id: response.data.club_id,
          categoria_id: response.data.categoria_id,
          user_id: response.data.user_id
        });
      } catch (error) {
        console.error('Error al obtener el equipo:', error);
      }
    };

    const fetchClubes = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/club/get_club');
        setClubes(response.data);
      } catch (error) {
        console.error('Error al obtener los clubes:', error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/categoria/get_categoria');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchEquipo();
    fetchClubes();
    fetchCategorias();
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
      await axios.put(`http://localhost:5002/api/equipo/update_equipo/${id}`, formData);
      alert('Equipo actualizado exitosamente');
      navigate('/equipos/indice');
    } catch (error) {
      console.error('Error al actualizar el equipo:', error);
      alert('Error al actualizar el equipo');
    }
  };

  return (
    <div className="registro-campeonato">
      <h2>Editar Equipo</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre del Equipo"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <select
            id="club_id"
            name="club_id"
            value={formData.club_id}
            onChange={handleChange}
          >
            {clubes.map(club => (
              <option key={club.id} value={club.id}>
                {club.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <select
            id="categoria_id"
            name="categoria_id"
            value={formData.categoria_id}
            onChange={handleChange}
          >
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <button id="RegCampBtn" type="submit">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
};

export default EditarEquipo;
