import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/css/Registro.css';
import { toast } from 'react-toastify';

const RegistroCategoria = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    genero: 'V', // valor predeterminado
    division: 'MY', // valor predeterminado para división
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
            className={errors.nombre ? 'error' : ''}
          />
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
        </div>

        {/* Select para Género */}
        <div className="select-container">
          <select
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
          >
            <option value="V">Varones</option>
            <option value="D">Damas</option>
            <option value="M">Mixto</option>
          </select>
        </div>

        {/* Select para División */}
        <div className="select-container">
          <label htmlFor="division">División</label>
          <select
            id="division"
            name="division"
            value={formData.division}
            onChange={handleChange}
          >
            <option value="MY">Mayores</option>
            <option value="MN">Menores</option>
          </select>
        </div>

        <div className="form-group">
          <button id="RegCampBtn" type="submit">Registrar</button>
        </div>
      </form>
    </div>
  );
};

export default RegistroCategoria;
