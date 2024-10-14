import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/Registro.css';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const RegistroEquipo = () => {
  const { clubId } = useParams(); // Obtener el clubId desde los parámetros de la URL
  const [formData, setFormData] = useState({
    nombre: '',
    club_id: clubId, // Ahora tomamos el club_id de los parámetros
    categoria_id: null, // Mantiene el valor predeterminado
    user_id: 1
  });
  const [clubName, setClubName] = useState('Cargando...'); // Valor inicial como "Cargando..."
  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchClubName = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/club/get_club/${clubId}`);
        if (response.data && response.data.length > 0 && response.data[0].nombre) {
          setClubName(response.data[0].nombre); // Accede al nombre del club en la posición 0
        } else {
          setClubName('Club no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener el nombre del club:', error);
        toast.error('Error al cargar el club');
        setClubName('Error al cargar el nombre del club');
      }
    };

    // Obtener las categorías
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/categoria/get_categoria');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchClubName();
    fetchCategorias();
  }, [clubId]);

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
    if (!formData.categoria_id) {
      newErrors.categoria_id = 'Debe seleccionar una categoría';
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
      const response = await axios.post('http://localhost:5002/api/equipo/post_equipo', formData);
      console.log(response.data);
      toast.success('Equipo registrado con éxito');
    } catch (error) {
      console.error('Error al registrar el equipo:', error);
      alert('Error al registrar el equipo');
    }
  };

  return (
    <div className="registro-campeonato">
      <h2>Registrar Equipo</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Equipo:</label>
          <input
            type="text"
            placeholder="Nombre del Equipo"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={errors.nombre ? 'error' : ''}
          />
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
        </div>

        <div className="form-group">
          <label>Nombre del Club:</label>
          <input
            type="text"
            value={clubName} // Mostrar el nombre del club o "Cargando..."
            disabled // Campo no editable
          />
        </div>

        <div className="select-container">
          <select
            id="categoria_id"
            name="categoria_id"
            value={formData.categoria_id}
            onChange={handleChange}
            className={errors.categoria_id ? 'error' : ''}
          >
            <option value="">Seleccione una Categoría</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          {errors.categoria_id && <span className="error-message">{errors.categoria_id}</span>}
        </div>

        <div className="form-group">
          <button id="RegCampBtn" type="submit">Registrar</button>
        </div>
      </form>
    </div>
  );
};

export default RegistroEquipo;
