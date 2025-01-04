import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/css/registroModal.css'; 
import { toast } from 'react-toastify';
import { Select } from 'antd';
import Modal from 'react-modal';

const { Option } = Select;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EditarCategoria = ({ isOpen, onClose, categoriaId, onCategoriaUpdated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    genero: 'V', // valor predeterminado
    division: 'MY', // valor predeterminado
    edad_minima: '', // Nueva columna
    edad_maxima: '', // Nueva columna
    costo_traspaso: '', // Nueva columna para costo de traspaso
    user_id: 2 // valor predeterminado
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoria = async () => {
      if (!categoriaId) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/categoria/get_categoriaId/${categoriaId}`);
        console.log(formData, 'parea ver nomas')
        setFormData({
          nombre: response.data.nombre,
          genero: response.data.genero,
          division: response.data.division,
          edad_minima: response.data.edad_minima ,
          edad_maxima: response.data.edad_maxima ,
          costo_traspaso: response.data.costo_traspaso ,
          user_id: response.data.user_id
        });
      } catch (error) {
        toast.error('Error al obtener la categoría');
        console.error('Error al obtener la categoría:', error);
      }
    };

    fetchCategoria();
  }, [categoriaId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/categoria/update_categoria/${categoriaId}`, formData);
      toast.success('Editado con éxito');
      onClose();
      onCategoriaUpdated();
    } catch (error) {
      toast.error('Error al actualizar la categoría');
      console.error('Error al actualizar la categoría:', error);
    }
  };

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    contentLabel="Editar Categoría"
    className="modal"
    overlayClassName="overlay"
  >
    <h2 className="modal-title">Editar Categoría</h2>

    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ingrese el nombre de la categoría"
          className="input-field"
        />
      </div>

      <div className="select-container">
        <Select
          id="genero"
          name="genero"
          value={formData.genero}
          onChange={(value) => handleSelectChange('genero', value)}
          style={{ width: '100%' }}
        >
          <Option value="V">Varones</Option>
          <Option value="D">Damas</Option>
          <Option value="M">Mixto</Option>
        </Select>
      </div>

      <div className="select-container">
        <Select
          id="division"
          name="division"
          value={formData.division}
          onChange={(value) => handleSelectChange('division', value)}
          style={{ width: '100%' }}
        >
          <Option value="MY">Mayores</Option>
          <Option value="MN">Menores</Option>
        </Select>
      </div>

      <div className="form-group">
        <input
          type="number"
          id="edad_minima"
          name="edad_minima"
          value={formData.edad_minima}
          onChange={handleChange}
          placeholder="Edad mínima (opcional)"
          className="input-field"
        />
      </div>

      <div className="form-group">
        <input
          type="number"
          id="edad_maxima"
          name="edad_maxima"
          value={formData.edad_maxima}
          onChange={handleChange}
          placeholder="Edad máxima (opcional)"
          className="input-field"
        />
      </div>

      <div className="form-group">
        <input
          type="number"
          id="costo_traspaso"
          name="costo_traspaso"
          value={formData.costo_traspaso}
          onChange={handleChange}
          placeholder="Costo de traspaso"
          className="input-field"
        />
      </div>

      <div className="form-buttons">
        <button type="button" className="button button-cancel" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" className="button button-primary">
          Guardar Cambios
        </button>
      </div>
    </form>
  </Modal>
  );
};

export default EditarCategoria;
