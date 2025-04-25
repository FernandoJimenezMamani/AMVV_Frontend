import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import ImageCropperModal from '../../components/ImageCropperModal';
import '../../assets/css/registroModal.css';
import { toast } from 'react-toastify';
import { Select } from 'antd';
import { useSession } from '../../context/SessionContext';
import rolMapping from '../../constants/roles';

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EditarJugador = ({ isOpen, onClose, jugadorId, onJugadorUpdated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    ci: '',
    direccion: '',
    correo: '',
    genero: 'V',
    roles: [],
    club_jugador_id: null,
    club_presidente_id: null,
    club_delegado_id: null,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [clubes, setClubes] = useState([]);
  const fileInputRef = useRef(null);
  const { user } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchJugador = async () => {
      if (!jugadorId) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/jugador/get_jugadorById/${jugadorId}`);
        const rolesArray = Array.isArray(response.data.roles)
        ? response.data.roles
        : response.data.roles.split(',').map((role) => role.trim());
        
        setFormData({
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          fecha_nacimiento: response.data.fecha_nacimiento.split('T')[0],
          ci: response.data.ci,
          direccion: response.data.direccion,
          correo: response.data.correo,
          genero: response.data.genero,
          roles:rolesArray,
          club_jugador_id: response.data.club_jugador,
          club_presidente_id: response.data.club_presidente,
          club_delegado_id: response.data.club_presidente,
          image: response.data.persona_imagen,
        });
        if (response.data.persona_imagen) {
          setImagePreview(response.data.persona_imagen);
        }
      } catch (error) {
        toast.error('Error al obtener los datos del jugador');
        console.error('Error al obtener los datos del jugador:', error);
      }
    };
    fetchJugador();
  }, [jugadorId]);

  useEffect(() => {
    const fetchClubes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/club/get_club`);
        setClubes(response.data);
      } catch (error) {
        toast.error('Error al obtener los clubes');
        console.error('Error al obtener los clubes:', error);
      }
    };
    fetchClubes();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempImage(file);
      setImagePreview(URL.createObjectURL(file));
      setModalIsOpen(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

  const handleClubChange = (value) => {
    setFormData({
      ...formData,
      club_jugador_id: value,
    });
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    if (croppedImage) {
      formDataToSend.append('image', croppedImage, 'profile_image.jpg');
    }

    try {
      await axios.put(`${API_BASE_URL}/persona/update_persona_with_roles/${jugadorId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Jugador actualizado exitosamente');
      onClose();
      onJugadorUpdated();
    } catch (error) {
      console.error('Error al actualizar el jugador:', error);
      toast.error('Error al actualizar el jugador');
    }finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const hasRole = (...roles) => {
    return user && user.rol && roles.includes(user.rol.nombre);
  }; 

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Editar Jugador"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="modal-title">Editar Jugador</h2>
      <form onSubmit={handleSubmitProfile}>
        <div className="form-group" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
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
        {hasRole(rolMapping.PresidenteAsociacion) && (
          <>
          <div className="select-container-u">
          <Select
            placeholder="Selecciona Club para Jugador"
            value={formData.club_jugador_id}
            onChange={handleClubChange}
            style={{ width: '100%' }}
            className="custom-ant-select-u"
          >
            {clubes.map((club) => (
              <Option key={club.id} value={club.id}>
                {club.nombre}
              </Option>
            ))}
          </Select>
        </div>
          </>
          
        )}
        

        <div className="form-buttons">
          <button type="button" className="button button-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="button button-primary" disabled={isLoading}>
              {isLoading ? <span className="spinner"></span> : "Guardar Cambios"}
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

export default EditarJugador;
