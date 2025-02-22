import React, { useState, useEffect , useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { getCroppedImg } from '../RecortarImagen.js';  
import ImageCropperModal from '../../components/ImageCropperModal';
import '../../assets/css/registroModal.css';
import { useSession } from '../../context/SessionContext'; 
import { toast } from 'react-toastify';
import { Select } from 'antd'; 
import roleNames from '../../constants/roles'

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EditarPerfilPersona = ({ isOpen, onClose, personaId, onPersonaUpdated }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    ci: '',
    direccion: '',
    user_id: 2,
    genero: 'V',  
    roles: [],
    club_jugador_id: null,
    club_presidente_id: null,
    club_delegado_id: null,
    image: null
  }); 
  const [imagePreview, setImagePreview] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [clubesPresidente, setClubesPresidente] = useState([]);
  const [loadingClubesPresidente, setLoadingClubesPresidente] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const fileInputRef = useRef(null);
  const [clubes, setClubes] = useState([]);
  const [loadingClubes, setLoadingClubes] = useState(true);
  const [disabledRoles, setDisabledRoles] = useState([]);
 
  const { user } = useSession(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersona = async () => {
      if (!personaId) return; 
      try {
        const response = await axios.get(`${API_BASE_URL}/persona/get_personaById/${personaId}`);
        const rolesArray = Array.isArray(response.data.roles)
        ? response.data.roles 
        : response.data.roles.split(',').map((role) => role.trim());

        setFormData({
          id: response.data.id,
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          fecha_nacimiento: response.data.fecha_nacimiento.split('T')[0], 
          ci: response.data.ci,
          direccion: response.data.direccion,
          genero: response.data.genero ,  
          user_id: response.data.user_id,
          correo: response.data.correo,
          roles: rolesArray,
          club_jugador_id: response.data.club_jugador,
          club_presidente_id: response.data.club_presidente,
          club_delegado_id: response.data.club_presidente,
          image: response.data.persona_imagen

        });
        
        if (response.data.persona_imagen) {
          setImagePreview(response.data.persona_imagen);
        }
      } catch (error) {
        toast.error('Error al obtener la persona');
        console.error('Error al obtener la persona:', error);
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

  useEffect(() => {
    const fetchClubes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/club/get_club`);
        
        setClubes(response.data);
        console.log(clubes,'clubes obtenidos')
        setLoadingClubes(false);
      } catch (error) {
        toast.error('Error al obtener los clubes');
        console.error('Error al obtener los clubes:', error);
      }
    };

    fetchClubes();
  }, []);

  useEffect(() => {
    // Carga de clubes específicos para presidente
    const fetchClubesPresidente = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/club/get_clubWithoutPresident`);
        setClubesPresidente(response.data);
        setLoadingClubesPresidente(false);
      } catch (error) {
        toast.error('Error al obtener los clubes para presidente');
        console.error('Error al obtener los clubes para presidente:', error);
      }
    };

    fetchClubesPresidente();
  }, []);
 
  const handleCropConfirm = (cropped) => {
    setCroppedImage(cropped);
    setImagePreview(URL.createObjectURL(cropped));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGeneroChange = (value) => {
    setFormData({
      ...formData,
      genero: value
    });
  };

  const handleClubChange = (value, role) => {
    if (role === roleNames.PresidenteClub) {
      const selectedClub = clubesPresidente.find((club) => club.id === value);
      if (selectedClub.presidente_asignado === 'S') {
        toast.error('Este club ya tiene un presidente asignado.');
        return; // No actualiza el estado si el club tiene presidente
      }
      setFormData({ ...formData, club_presidente_id: value });
    } else if (role === roleNames.Jugador) {
      setFormData({ ...formData, club_jugador_id: value });
    } else if (role === roleNames.DelegadoClub) {
      setFormData({ ...formData, club_delegado_id: value });
    }
  };
 
  const handleSubmitProfile = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
  
    // Añadir campos de texto al formData
    Object.keys(formData).forEach((key) => {
      // Solo agrega JSON.stringify si los roles no son un array
      if (key === "roles" && Array.isArray(formData[key])) {
        formDataToSend.append(key, formData[key].join(", ")); // Convierte a una cadena separada por comas
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
    
  
    // Añadir imagen recortada al formData si existe
    if (croppedImage) {
      formDataToSend.append("image", croppedImage, "profile_image.jpg");
    }
  
    // Mostrar los datos que se enviarán
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }
  
    try {
      await axios.put(`${API_BASE_URL}/persona/update_persona_with_roles/${personaId}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      toast.success("Persona actualizada exitosamente");
      onClose();
      onPersonaUpdated();
    } catch (error) {
      console.error("Error al actualizar la persona:", error);
      toast.error("Error al actualizar la persona");
    }
  };
  

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleRoleChange = (selectedRoles) => {
    let updatedRoles = [...selectedRoles];
  
    // Si selecciona Presidente de Club, elimina Delegado de Club
    if (updatedRoles.includes(roleNames.PresidenteClub)) {
      updatedRoles = updatedRoles.filter((role) => role !== roleNames.DelegadoClub);
      setDisabledRoles([roleNames.DelegadoClub]); // Deshabilita Delegado de Club
    }
    // Si selecciona Delegado de Club, elimina Presidente de Club
    else if (updatedRoles.includes(roleNames.DelegadoClub)) {
      updatedRoles = updatedRoles.filter((role) => role !== roleNames.PresidenteClub);
      setDisabledRoles([roleNames.PresidenteClub]); // Deshabilita Presidente de Club
    } else {
      // Si ninguno está seleccionado, habilita ambas opciones
      setDisabledRoles([]);
    }
  
    setFormData({
      ...formData,
      roles: updatedRoles,
    });
  };
  
 
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Editar Persona"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="modal-title">Editar Persona</h2>

      <form onSubmit={handleSubmitProfile}>
        <div className="form-group" onClick={handleImageClick} style={{ cursor: 'pointer' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="file-input"
            style={{ display: 'none' }}  // Ocultar el input
          />
          <label htmlFor="image" className="custom-file-upload">
            {imagePreview ? (
              <img src={imagePreview} alt="Vista previa" className="image-preview" />
            ) : (
              <span className="upload-text">Seleccionar foto para usuario</span>
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
         {/* Select para género */}
         <div className="select-container-u">
                  <Select
                    id="genero"
                    name="genero"
                    value={formData.genero}
                    onChange={handleGeneroChange}
                    placeholder="Seleccione Género"
                    className={`custom-ant-select-u`}
                    style={{ width: '100%' }}
                  >
                    <Option value="V">Varon</Option>
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
                <div  className="select-container-u">
        <Select
          mode="multiple"
          placeholder="Selecciona Roles"
          value={formData.roles}
          onChange={handleRoleChange}
          onSelect={() => document.activeElement.blur()}  // Cierra el menú después de seleccionar
          style={{ width: '100%' ,display: 'none'  }}
          className={`custom-ant-select-u`}
          
        >
          <Option value={(roleNames.Arbitro)}>Árbitro</Option>
          <Option value={(roleNames.Jugador)}>Jugador</Option>
          <Option
            value={roleNames.PresidenteClub}
            disabled={disabledRoles.includes(roleNames.PresidenteClub)}
          >
            Presidente de club
          </Option>
          <Option
            value={roleNames.DelegadoClub}
            disabled={disabledRoles.includes(roleNames.DelegadoClub)}
          >
            Delegado de club
          </Option>
          <Option value={(roleNames.Tesorero)}>Tesorero</Option>
          <Option value={(roleNames.PresidenteArbitro)}>Presidente de arbitros</Option>
        </Select>
        </div>

        {formData.roles.includes(roleNames.Jugador) && (
          <div className="select-container-u">
            <Select
              placeholder="Selecciona Club para jugador"
              value={formData.club_jugador_id}
              onChange={(value) => handleClubChange(value, roleNames.Jugador)}
              style={{ width: '100%' ,display: 'none' }}
              className={`custom-ant-select-u`}
            >
              {clubes.map((club) => (
                <Option key={club.id} value={club.id}>
                  {club.nombre}
                </Option>
              ))}
            </Select>
          </div>
        )}

        {formData.roles.includes(roleNames.PresidenteClub) && (
            <div className="select-container-u">
              <Select
                placeholder="Selecciona Club para Presidente"
                value={formData.club_presidente_id}
                onChange={(value) => handleClubChange(value,  roleNames.PresidenteClub)}
                style={{ width: '100%' ,display: 'none' }}
                className="custom-ant-select-u"
                >
               {clubes.map((club) => (
                <Option
                key={club.id}
                value={club.id}
                disabled={club.presidente_asignado === 'S'} 
              >
                {club.nombre}
              </Option>
            ))}
            </Select>
          </div>
        )}

        {formData.roles.includes(roleNames.DelegadoClub) && (
            <div className="select-container-u">
              <Select
                placeholder="Selecciona Club para Presidente"
                value={formData.club_presidente_id}
                onChange={(value) => handleClubChange(value, roleNames.DelegadoClub)}
                style={{ width: '100%' ,display: 'none' }}
                className="custom-ant-select-u"

                >
               {clubes.map((club) => (
               <Option key={club.id} value={club.id}>
               {club.nombre}
              </Option>
            ))}
            </Select>
          </div>
        )}

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
 
export default EditarPerfilPersona;
