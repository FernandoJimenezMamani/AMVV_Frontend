import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { useParams } from 'react-router-dom';
import { Select } from 'antd';
import '../../assets/css/registroModal.css';
import { useSession } from '../../context/SessionContext';
import rolMapping from '../../constants/roles';

Modal.setAppElement('#root'); 
const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RegistroEquipo = ({ isOpen, onClose, onTeamCreated , clubId }) => { 
  const [formData, setFormData] = useState({
    nombre: '',
    club_id: clubId, // Ahora tomamos el club_id de los parámetros
    categoria_id: null, // Mantiene el valor predeterminado
    user_id: 1
  });
  const [clubName, setClubName] = useState('Cargando...'); // Valor inicial como "Cargando..."
  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});
  const [formModalIsOpen, setFormModalIsOpen] = useState(false); 
  const closeFormModal = () => setFormModalIsOpen(false);
  const { user } = useSession();
  useEffect(() => {
    const fetchClubName = async () => {
      if(!clubId) return; // Asegúrate de que clubId esté definido antes de hacer la solicitud
      try {
        const response = await axios.get(`${API_BASE_URL}/club/get_club/${clubId}`);
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

    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categoria/get_categoria`);
        setCategorias(response.data);
      } catch (error) {
        toast.error('error')
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchClubName();
    fetchCategorias();
  }, [clubId]);

  // Manejar el cambio en los campos de texto
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: ''
    }));
  };

  // Manejar el cambio en el Select de Categoría
  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      categoria_id: value
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      categoria_id: ''
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
      const response = await axios.post(`${API_BASE_URL}/equipo/post_equipo`, formData);
      console.log(response.data);
      toast.success('Equipo registrado con éxito');
      onClose(); 
      onTeamCreated();
    } catch (error) {
      const mensaje = error.response?.data?.error || "Error inesperado";
      toast.error(mensaje);
    }
  };

  const hasRole = (...roles) => {
    return user && user.rol && roles.includes(user.rol.nombre);
  }; 

  return (
    <div>
      <Modal
              isOpen={isOpen} 
              onRequestClose={closeFormModal}
              contentLabel="Registrar Club"
              className="modal"
              overlayClassName="overlay">
      <h2 className="modal-title">Registrar Equipo</h2>
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <input
            type="text"
            value={clubName} // Mostrar el nombre del club o "Cargando..."
            disabled // Campo no editable
            className="input-field"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre del Equipo"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="input-field"
          />
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
        </div>

        <div className="select-container">
          {hasRole(rolMapping.PresidenteAsociacion) ? (
            <>
              <Select
                placeholder="Seleccione una categoría de ascenso"
                value={formData.categoria_id}
                onChange={handleSelectChange}
                style={{ width: '100%' }}
                allowClear
              >
                {categorias
                  .filter(c => c.es_ascenso === 'S')
                  .map(c => (
                    <Option key={c.id} value={c.id}>
                      {`${c.nombre} - ${c.genero === 'V' ? 'masculino' : 'femenino'}`}
                    </Option>
                  ))}
              </Select>
            </>
          ) : (
            <>
              <Select
                placeholder="Seleccione una categoría"
                value={formData.categoria_id}
                onChange={handleSelectChange}
                style={{ width: '100%' }}
                allowClear
              >
                {categorias
                  .filter(c => c.es_ascenso === null)
                  .map(c => (
                    <Option key={c.id} value={c.id}>
                      {`${c.nombre} - ${c.genero === 'V' ? 'masculino' : 'femenino'}`}
                    </Option>
                  ))}
              </Select>
            </>
          )}

          {errors.categoria_id && <span className="error-message">{errors.categoria_id}</span>}
        </div>


        <div className="form-buttons">
          <button type="button" className="button button-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="button button-primary" type="submit">
            Registrar
          </button>
        </div>
      </form>
     </Modal>
    </div>
  );
};

export default RegistroEquipo;
