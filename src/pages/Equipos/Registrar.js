import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/Campeonato.css'; // Usamos el mismo archivo CSS

const RegistroEquipo = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    club_id: '',
    categoria_id: '',
    user_id: 1
  });
  const [clubes, setClubes] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
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

    fetchClubes();
    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/api/equipo/post_equipo', formData);
      console.log(response.data);
      alert('Equipo creado exitosamente');
    } catch (error) {
      console.error('Error al crear el equipo:', error);
      alert('Error al crear el equipo');
    }
  };

  return (
    <div className="registro-campeonato">
      <h2>Registrar Equipo</h2>
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
            <option value="">Seleccione un Club</option>
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
            <option value="">Seleccione una Categoría</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <button id="RegCampBtn" type="submit">Registrar</button>
        </div>
      </form>
    </div>
  );
};

export default RegistroEquipo;
