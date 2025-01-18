import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ImageCropperModal from '../../components/ImageCropperModal';
import '../../assets/css/registroModal.css';
import { toast } from 'react-toastify';
import { Select } from 'antd';
import roleNames from '../../constants/roles';

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EditarArbitro = ({ isOpen, onClose, personaId, onPersonaUpdated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    ci: '',
    direccion: '',
    correo: '',
    genero: 'V', // Valor inicial por defecto
    roles: [], // Mantendrá todos los roles actuales del usuario
    club_jugador_id: null,
    club_presidente_id: null,
    club_delegado_id: null,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [disabledRoles, setDisabledRoles] = useState([]);
  const [clubes, setClubes] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchPersona = async () => {
      if (!personaId) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/arbitro/get_arbitroById/${personaId}`);
        const rolesArray = Array.isArray(response.data.roles)
          ? response.data.roles
          : response.data.roles.split(',').map((role) => role.trim());

        setFormData({
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          fecha_nacimiento: response.data.fecha_nacimiento.split('T')[0],
          ci: response.data.ci,
          direccion: response.data.direccion,
          genero: response.data.genero,
          correo: response.data.correo,
          roles: rolesArray, // Mantener todos los roles actuales
          club_jugador_id: response.data.club_jugador || null,
          club_presidente_id: response.data.club_presidente || null,
          club_delegado_id: response.data.club_presidente || null,
          image: response.data.persona_imagen,
        });

        if (response.data.persona_imagen) {
          setImagePreview(response.data.persona_imagen);
        }
      } catch (error) {
        toast.error('Error al obtener los datos del árbitro');
        console.error('Error al obtener los datos del árbitro:', error);
      }
    };

    fetchPersona();
  }, [personaId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempImage(file);
      setImagePreview(URL.createObjectURL(file));
      setModalIsOpen(true);
    }
  };

  const handleCropConfirm = (cropped) => {
    setCroppedImage(cropped);
    setImagePreview(URL.createObjectURL(cropped));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGeneroChange = (value) => {
    setFormData({
      ...formData,
      genero: value,
    });
  };

  const handleClubChange = (value, role) => {
    if (role === roleNames.Jugador) {
      setFormData({ ...formData, club_jugador_id: value });
    } else if (role === roleNames.PresidenteClub) {
      setFormData({ ...formData, club_presidente_id: value });
    } else if (role === roleNames.DelegadoClub) {
      setFormData({ ...formData, club_delegado_id: value });
    }
  };

  const handleRoleChange = (selectedRoles) => {
    setFormData({
      ...formData,
      roles: selectedRoles,
    });
  };
  

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    
    console.log('Datos del formulario antes de procesar:', formData);
    const formDataToSend = new FormData();

    // Añadir campos al formData
    Object.keys(formData).forEach((key) => {
        // Solo agrega JSON.stringify si los roles no son un array
        if (key === "roles" && Array.isArray(formData[key])) {
          formDataToSend.append(key, formData[key].join(", ")); // Convierte a una cadena separada por comas
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

    if (croppedImage) {
      formDataToSend.append('image', croppedImage, 'profile_image.jpg');
    }

    // Mostrar datos que se enviarán
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await axios.put(`${API_BASE_URL}/persona/update_persona_with_roles/${personaId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Árbitro actualizado exitosamente');
      onClose();
      onPersonaUpdated();
    } catch (error) {
      console.error('Error al actualizar el árbitro:', error);
      toast.error('Error al actualizar el árbitro');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Editar Árbitro"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="modal-title">Editar Árbitro</h2>

      <form onSubmit={handleSubmitProfile}>
        <div className="form-group" onClick={() => fileInputRef.current.click()} style={{ cursor: 'pointer' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="file-input"
            style={{ display: 'none' }}
          />
          <label htmlFor="image" className="custom-file-upload">
            {imagePreview ? (
              <img src={imagePreview} alt="Vista previa" className="image-preview" />
            ) : (
              <span className="upload-text">Seleccionar foto</span>
            )}
          </label>
        </div>

        <div className="form-group">
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="input-field-u"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            className="input-field-u"
          />
        </div>

        <div className="form-group">
          <input
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            className="input-field-u"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Cédula de Identidad"
            name="ci"
            value={formData.ci}
            onChange={handleChange}
            className="input-field-u"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="input-field-u"
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="input-field-u"
          />
        </div>

        <div className="select-container-u">
          <Select
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleGeneroChange}
            placeholder="Seleccione Género"
            className="custom-ant-select-u"
            style={{ width: '100%' }}
          >
            <Option value="V">Varón</Option>
            <Option value="D">Dama</Option>
          </Select>
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

      <ImageCropperModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        image={imagePreview}
        onCropConfirm={handleCropConfirm}
      />
    </Modal>
  );
};

export default EditarArbitro;
