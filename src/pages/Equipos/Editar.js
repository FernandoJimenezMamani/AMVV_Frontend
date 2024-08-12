import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/css/Editar.css';

const { Option } = Select;

const EditarEquipo = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    club_id: null,
    categoria_id: null,
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
          club_id: { value: response.data.club_id, label: response.data.club_nombre },
          categoria_id: { value: response.data.categoria_id, label: response.data.categoria_nombre },
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name, option) => {
    setFormData({
      ...formData,
      [name]: option
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5002/api/equipo/update_equipo/${id}`, {
        ...formData,
        club_id: formData.club_id.value,
        categoria_id: formData.categoria_id.value
      });
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
        <label className="label-edit">Nombre del Equipo</label>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre del Equipo"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
          />
        </div>
        <label className="label-edit">Club</label>
        <div className="select-container">
          <Select
            placeholder="Seleccione un Club"
            value={formData.club_id}
            labelInValue
            onChange={(option) => handleSelectChange('club_id', option)}
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
        <label className="label-edit">Categoría</label>
        <div className="select-container">
          <Select
            placeholder="Seleccione una Categoría"
            value={formData.categoria_id}
            labelInValue
            onChange={(option) => handleSelectChange('categoria_id', option)}
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
          <button id="RegCampBtn" type="primary" htmlType="submit">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
};

export default EditarEquipo;
