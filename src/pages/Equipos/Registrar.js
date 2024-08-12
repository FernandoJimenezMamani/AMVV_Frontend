import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select } from 'antd';
import '../../assets/css/Registro.css';

const { Option } = Select;

const RegistroEquipo = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    club_id: null, // Usa null en lugar de una cadena vacía
    categoria_id: null, // Usa null en lugar de una cadena vacía
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

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
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
            onChange={(e) => handleChange('nombre', e.target.value)}
          />
        </div>
        <div className="select-container">
          <Select
            placeholder="Seleccione un Club"
            value={formData.club_id}
            onChange={(value) => handleChange('club_id', value)}
            style={{ width: '100%' }}
            allowClear
          >
            {clubes.map(club => (
              <Option key={club.id} value={club.id}>
                {club.nombre}
              </Option>
            ))}
          </Select>
        </div>
        <div className="select-container">
          <Select
            placeholder="Seleccione una Categoría"
            value={formData.categoria_id}
            onChange={(value) => handleChange('categoria_id', value)}
            style={{ width: '100%' }}
            allowClear
          >
            {categorias.map(categoria => (
              <Option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </Option>
            ))}
          </Select>
        </div>
        <div className="form-group">
          <button id="RegCampBtn" type="primary" htmlType="submit">Registrar</button>
        </div>
      </form>
    </div>
  );
};

export default RegistroEquipo;
