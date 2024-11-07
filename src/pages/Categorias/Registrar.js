import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/css/Registro.css';
import { toast } from 'react-toastify';
import { Select } from 'antd';

const { Option } = Select;

const RegistroCategoria = () => {
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
      const response = await axios.post('http://localhost:5002/api/categoria/post_categoria', formData);
      console.log(response.data);
      toast.success('Registrado con éxito');
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
            className={errors.nombre ? 'error' : ''}
          />
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
        </div>

        {/* Select para Género usando antd */}
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

        {/* Select para División usando antd */}
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

        {/* Input para Edad Mínima */}
        <div className="form-group">
          <input
            type="number"
            placeholder="Edad Mínima (opcional)"
            id="edad_minima"
            name="edad_minima"
            value={formData.edad_minima}
            onChange={handleChange}
            className={errors.edad_minima ? 'error' : ''}
          />
          {errors.edad_minima && <span className="error-message">{errors.edad_minima}</span>}
        </div>

        {/* Input para Edad Máxima */}
        <div className="form-group">
          <input
            type="number"
            placeholder="Edad Máxima (opcional)"
            id="edad_maxima"
            name="edad_maxima"
            value={formData.edad_maxima}
            onChange={handleChange}
            className={errors.edad_maxima ? 'error' : ''}
          />
          {errors.edad_maxima && <span className="error-message">{errors.edad_maxima}</span>}
        </div>

        {/* Input para Costo de Traspaso */}
        <div className="form-group">
          <input
            type="number"
            placeholder="Costo de Traspaso"
            id="costo_traspaso"
            name="costo_traspaso"
            value={formData.costo_traspaso}
            onChange={handleChange}
            className={errors.costo_traspaso ? 'error' : ''}
          />
          {errors.costo_traspaso && <span className="error-message">{errors.costo_traspaso}</span>}
        </div>

        <div className="form-group">
          <button id="RegCampBtn" type="submit">Registrar</button>
        </div>
      </form>
    </div>
  );
};

export default RegistroCategoria;
