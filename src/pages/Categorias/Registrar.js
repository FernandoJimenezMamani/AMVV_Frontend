import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/css/registroModal.css'; 
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { Select } from 'antd';

const { Option } = Select;

Modal.setAppElement('#root');
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const RegistroCategoria = ({ isOpen, onClose, onCategoriaCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    genero: 'V', // valor predeterminado
    division: 'MY', // valor predeterminado para división
    edad_minima: '', // Nueva columna
    edad_maxima: '', // Nueva columna
    costo_traspaso: '', // Nuevo campo para el costo de traspaso
    user_id: 1
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar errores cuando se cambia el valor de un campo
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre) {
      newErrors.nombre = 'El campo nombre es obligatorio';
    }
    if (formData.edad_minima && isNaN(formData.edad_minima)) {
      newErrors.edad_minima = 'La edad mínima debe ser un número';
    }
    if (formData.edad_maxima && isNaN(formData.edad_maxima)) {
      newErrors.edad_maxima = 'La edad máxima debe ser un número';
    }
    if (formData.edad_minima && formData.edad_maxima && Number(formData.edad_minima) > Number(formData.edad_maxima)) {
      newErrors.edad_minima = 'La edad mínima no puede ser mayor que la edad máxima';
    }
    if (!formData.costo_traspaso || isNaN(formData.costo_traspaso) || Number(formData.costo_traspaso) < 0) {
      newErrors.costo_traspaso = 'El costo de traspaso debe ser un número mayor o igual a 0';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      console.log(formData); // Agregar esta línea antes de hacer la petición
      const response = await axios.post(`${API_BASE_URL}/categoria/post_categoria`, formData);
      console.log(response.data);
      toast.success('Registrado con éxito');
      onClose(); 
      onCategoriaCreated();
    } catch (error) {
      toast.error('Error al registrar');
      console.error('Error al crear la categoría:', error);
    }
  };

  const handleGeneroChange = (value) => {
    setFormData({
      ...formData,
      genero: value
    });
  };

  const handleDivisionChange = (value) => {
    setFormData({
      ...formData,
      division: value
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Registrar Categoría"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="modal-title">Registrar Categoría</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="input-field"
          />
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
        </div>

        <div className="select-container">
          <Select
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleGeneroChange}
            placeholder="Seleccione Género"
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
            onChange={handleDivisionChange}
            placeholder="Seleccione División"
            style={{ width: '100%' }}
          >
            <Option value="MY">Mayores</Option>
            <Option value="MN">Menores</Option>
          </Select>
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="Edad Mínima (opcional)"
            id="edad_minima"
            name="edad_minima"
            value={formData.edad_minima}
            onChange={handleChange}
            className="input-field"
          />
          {errors.edad_minima && <span className="error-message">{errors.edad_minima}</span>}
        </div>

        <div className="form-group">
          <input
            type="number"
            placeholder="Edad Máxima (opcional)"
            id="edad_maxima"
            name="edad_maxima"
            value={formData.edad_maxima}
            onChange={handleChange}
            className="input-field"
          />
          {errors.edad_maxima && <span className="error-message">{errors.edad_maxima}</span>}
        </div>

        <div className="form-group">
          <input
            type="number"
            placeholder="Costo de Traspaso"
            id="costo_traspaso"
            name="costo_traspaso"
            value={formData.costo_traspaso}
            onChange={handleChange}
            className="input-field"
          />
          {errors.costo_traspaso && <span className="error-message">{errors.costo_traspaso}</span>}
        </div>

        <div className="form-buttons">
          <button type="button" className="button button-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="button button-primary">
            Registrar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RegistroCategoria;
