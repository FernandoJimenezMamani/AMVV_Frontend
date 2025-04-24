import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { Select } from 'antd';
import '../../assets/css/registroModal.css';

Modal.setAppElement('#root');
const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EditarEquipoModal = ({ isOpen, onClose, equipoId, onEquipoUpdated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    club_id: null,
    categoria_id: null,
    user_id: 1,
  });

  const [clubes, setClubes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});
  const [esAscenso, setEsAscenso] = useState(null);

  useEffect(() => {
    const fetchEquipo = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/equipo/get_equipo/${equipoId}`);
        const data = response.data;
        setFormData({
          nombre: data.equipo_nombre,
          club_id: data.club_id,
          categoria_id: data.categoria_id,
          user_id: 1,
        });
        setEsAscenso(data.es_ascenso);
      } catch (error) {
        toast.error('Error al obtener los datos del equipo.');
      }
    };

    if (equipoId) {
      fetchEquipo();
    }
  }, [equipoId]);

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const [clubRes, catRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/club/get_club`),
          axios.get(`${API_BASE_URL}/categoria/get_categoria`)
        ]);
        setClubes(clubRes.data);
        setCategorias(catRes.data);
      } catch (err) {
        toast.error("Error al cargar datos");
      }
    };
    fetchSelectData();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = 'El campo nombre es obligatorio';
    if (!formData.categoria_id) newErrors.categoria_id = 'Debe seleccionar una categoría';
    if (!formData.club_id) newErrors.club_id = 'Debe seleccionar un club';
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
      const res = await axios.put(`${API_BASE_URL}/equipo/update_equipo/${equipoId}`, formData);
  
      // ✅ Verificá que realmente llegó hasta aquí sin excepciones
      toast.success('Equipo actualizado con éxito');
      onEquipoUpdated();
      onClose(); // <-- Puede lanzar error si algo está mal
    } catch (error) {
      console.error("Error en actualización:", error); // DEBUG
      const mensaje = error.response?.data?.error || "Error inesperado";
      toast.error(mensaje);
    }
  };
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Editar Equipo"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="modal-title">Editar Equipo</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre del Equipo"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="input-field"
          />
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
        </div>

        <div className="select-container">
          <Select
            placeholder="Seleccione un Club"
            value={formData.club_id}
            onChange={(value) => handleSelectChange('club_id', value)}
            style={{ width: '100%' }}
            allowClear
            disabled
          >
            {clubes.map(club => (
              <Option key={club.id} value={club.id}>{club.nombre}</Option>
            ))}
          </Select>
          {errors.club_id && <span className="error-message">{errors.club_id}</span>}
        </div>

        <div className="select-container">
          <Select
            placeholder="Seleccione una Categoría"
            value={formData.categoria_id}
            onChange={(value) => handleSelectChange('categoria_id', value)}
            style={{ width: '100%' }}
            allowClear
            disabled
            
          >
            {categorias.map(cat => {
              const generoText = cat.genero === 'V' ? 'masculino' : 'femenino';
              return (
                <Option key={cat.id} value={cat.id}>
                  {`${cat.nombre} - ${generoText}`}
                </Option>
              );
            })}
          </Select>
          {errors.categoria_id && <span className="error-message">{errors.categoria_id}</span>}
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

export default EditarEquipoModal;