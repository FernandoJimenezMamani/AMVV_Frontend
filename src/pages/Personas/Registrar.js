import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import '../../assets/css/registroModal.css';
import ImageCropperModal from '../../components/ImageCropperModal';
import { Select } from 'antd';
import ImageIcon from '@mui/icons-material/Image';
import roleNames from '../../constants/roles'
const { Option } = Select;

Modal.setAppElement('#root'); // Necesario para accesibilidad
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RegistroPersona = ({ isOpen, onClose, onPersonaCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    ci: '',
    direccion: '',
    correo: '',
    genero: 'V',  // Valor inicial por defecto
    roles: [],
    club_jugador_id: null,
    club_presidente_id: null,
    club_delegado_id: null
  });

  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [clubes, setClubes] = useState([]);
  const [clubesPresidente, setClubesPresidente] = useState([]);
  const [loadingClubes, setLoadingClubes] = useState(true);
  const [loadingClubesPresidente, setLoadingClubesPresidente] = useState(true);
  const [clubJugador, setClubJugador] = useState(null);
  const [clubPresidente, setClubPresidente] = useState(null);
  const [clubDelegado, setClubDelegado] = useState(null);
  const [disabledRoles, setDisabledRoles] = useState([]);
  const [roleError, setRoleError] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const fileInputRef = React.createRef();

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

  // Manejo del cambio en el Select del género
  const handleGeneroChange = (value) => {
    setFormData({
      ...formData,
      genero: value
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      genero: ''
    }));
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      fecha_nacimiento: '',
      ci: '',
      direccion: '',
      correo: '',
      genero: '',
      roles: [],
      club_jugador_id: null,
      club_presidente_id: null,
      club_delegado_id: null
    });
    setErrors({});
    setImage(null);
    setTempImage(null);
    setImagePreview(null);
    setCroppedImage(null);
    setClubJugador(null);
    setClubPresidente(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = 'El campo nombre es obligatorio';
    if (!formData.apellido) newErrors.apellido = 'El campo apellido es obligatorio';
    if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = 'El campo fecha de nacimiento es obligatorio';
    if (!formData.ci) newErrors.ci = 'El campo cédula de identidad es obligatorio';
    if (!formData.direccion) newErrors.direccion = 'El campo dirección es obligatorio';
    if (!formData.correo) newErrors.correo = 'El campo correo es obligatorio';
    return newErrors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempImage(file);
      setImagePreview(URL.createObjectURL(file));
      setModalIsOpen(true);
  
      // Reinicia el valor del input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  

  useEffect(() => {
    const fetchClubes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/club/get_club`);
        setClubes(response.data);
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

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();

    if (formData.roles.length === 0) {
      setRoleError(true); // Activar el estado de error si no hay roles seleccionados
      return;
    }
    setRoleError(false);
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const data = new FormData();
    data.append('nombre', formData.nombre);
    data.append('apellido', formData.apellido);
    data.append('fecha_nacimiento', formData.fecha_nacimiento);
    data.append('ci', formData.ci);
    data.append('direccion', formData.direccion);
    data.append('correo', formData.correo);
    data.append('genero', formData.genero);
    data.append('roles', JSON.stringify(formData.roles));

    if (formData.roles.includes(roleNames.Jugador) && !clubJugador) {
      toast.error('Debe seleccionar un club para el rol de jugador');
      return;
    }
    if (formData.roles.includes(roleNames.PresidenteClub) && !clubPresidente) {
      toast.error('Debe seleccionar un club para el rol de presidente');
      return;
    }
    if (formData.roles.includes(roleNames.DelegadoClub) && !clubDelegado) {
      toast.error('Debe seleccionar un club para el rol de Delegado');
      return;
    }
    
    // Añadir clubes específicos según el rol
    if (formData.roles.includes(roleNames.Jugador) && clubJugador) {
      data.append('club_jugador_id', clubJugador);
    }
    if (formData.roles.includes(roleNames.PresidenteClub) && clubPresidente) {
      data.append('club_presidente_id', clubPresidente);
    }
    if (formData.roles.includes(roleNames.DelegadoClub) && clubDelegado) {
      data.append('club_delegado_id', clubDelegado);
    }

    if (croppedImage) {
      data.append('image', croppedImage);
    } else if (image) {
      data.append('image', image);
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/persona/post_persona`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(data);
      toast.success('Persona registrada con éxito');
      onClose();
      resetForm();
      onPersonaCreated();
    } catch (error) {
      console.error('Respuesta del error:', error.response);
      if (error.response) {
        // Capturamos el mensaje de error del backend
        const errorMessage = error.response.data.message;
  
        // Mostramos el mensaje en un toast
        toast.error(errorMessage);
      } else {
        // Error inesperado
        toast.error('Ocurrió un error al registrar la persona. Inténtelo nuevamente.');
      }
    }
  };

  const handleCropConfirm = (cropped) => {
    setCroppedImage(cropped);
    setImagePreview(URL.createObjectURL(cropped));
  };

  const handleRoleChange = (selectedRoles) => {
    // Si selecciona Presidente de Club, deshabilita Delegado de Club
    setRoleError(false); 
    if (selectedRoles.includes(roleNames.PresidenteClub)) {
      setDisabledRoles([roleNames.DelegadoClub]);
    } 
    // Si selecciona Delegado de Club, deshabilita Presidente de Club
    else if (selectedRoles.includes(roleNames.DelegadoClub)) {
      setDisabledRoles([roleNames.PresidenteClub]);
    } 
    // Si ninguno de los dos está seleccionado, habilita ambas opciones
    else {
      setDisabledRoles([]);
    }
  
    setFormData({
      ...formData,
      roles: selectedRoles,
    });
  };

  const handleClubChange = (value, role) => {
    if (role === roleNames.Jugador) {
      setClubJugador(value);
    } else if (role === roleNames.PresidenteClub) {
      setClubPresidente(value);
    }else if (role === roleNames.DelegadoClub) {
      setClubDelegado(value);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Registrar Persona"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="modal-title">Registrar Usuario</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="form-group">
        <input
          type="file"
          id="image"
          ref={fileInputRef} 
          name="image"
          onChange={handleImageChange}
          className="file-input"
        />
        <label htmlFor="image" className="custom-file-upload">
          {imagePreview ? (
            <img src={imagePreview} alt="Vista previa" className="image-preview" />
          ) : (
            <span className="upload-text">Seleccionar foto para usuario <ImageIcon/></span>
          )}
        </label>
      </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="input-field-u"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
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
          {errors.genero && <span className="error-message">{errors.genero}</span>}
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
          onChange={handleRoleChange}
          onSelect={() => document.activeElement.blur()}  // Cierra el menú después de seleccionar
          style={{ width: '100%' }}
          className={`custom-ant-select-u ${roleError ? 'error-select' : ''}`}
          
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
        {roleError && <p className="error-message">Debe seleccionar al menos un rol.</p>}
        </div>

        {formData.roles.includes(roleNames.Jugador) && (
          <div className="select-container-u">
            <Select
              placeholder="Selecciona Club para Jugador"
              onChange={(value) => handleClubChange(value, roleNames.Jugador)}
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
        )}

        {formData.roles.includes(roleNames.PresidenteClub) && (
          <div className="select-container-u">
            <Select
              placeholder="Selecciona Club para Presidente"
              onChange={(value) => handleClubChange(value, roleNames.PresidenteClub)}
              style={{ width: '100%' }}
              className="custom-ant-select-u"
              loading={loadingClubesPresidente}
            >
              {clubesPresidente.map((club) => (
                <Option key={club.id} value={club.id}>
                  {club.nombre}
                </Option>
              ))}
            </Select>
          </div>
        )}

        {formData.roles.includes(roleNames.DelegadoClub) && (
          <div className="select-container-u">
            <Select
              placeholder="Selecciona Club para Delegado"
              onChange={(value) => handleClubChange(value, roleNames.DelegadoClub)}
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
        )}

        <div className="form-buttons">
          <button type="button" className="button button-cancel" onClick={handleClose}>
            Cancelar
          </button>
          <button type="submit" className="button button-primary">Registrar</button>
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

export default RegistroPersona;