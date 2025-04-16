import React, { useState, useEffect } from 'react';
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

const RegistroDelegado = ({ isOpen, onClose, onDelegadoCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    ci: '',
    direccion: '',
    correo: '',
    genero: 'V', // Valor inicial por defecto
    roles: [roleNames.DelegadoClub],
    club_delegado_id: null,
  });

  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [clubesPresidente, setClubesPresidente] = useState([]);
  const [croppedImage, setCroppedImage] = useState(null);
  const [loadingClubesPresidente, setLoadingClubesPresidente] = useState(true);
  const [clubes, setClubes] = useState([]);
  const [loadingClubes, setLoadingClubes] = useState(true);
  const fileInputRef = React.createRef();

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

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      fecha_nacimiento: '',
      ci: '',
      direccion: '',
      correo: '',
      genero: 'V',
      roles: [roleNames.DelegadoClub],
      club_delegado_id: null,
    });
    setErrors({});
    setImage(null);
    setTempImage(null);
    setImagePreview(null);
    setCroppedImage(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = 'El campo nombre es obligatorio';
    if (!formData.apellido) newErrors.apellido = 'El campo apellido es obligatorio';
    if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = 'El campo fecha de nacimiento es obligatorio';
    if (!formData.ci) newErrors.ci = 'El campo cédula de identidad es obligatorio';
    if (!formData.direccion) newErrors.direccion = 'El campo dirección es obligatorio';
    if (!formData.correo) newErrors.correo = 'El campo correo es obligatorio';
    if (!formData.club_delegado_id) newErrors.club_delegado_id = 'Debe seleccionar un club';
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: '',
    }));
  };

  const handleClubChange = (value) => {
    setFormData({
      ...formData,
      club_delegado_id: value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      club_delegado_id: '',
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    data.append('club_delegado_id', formData.club_delegado_id);

    if (croppedImage) {
      data.append('image', croppedImage);
    } else if (image) {
      data.append('image', image);
    }

    try {
      await axios.post(`${API_BASE_URL}/persona/post_persona`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Jugador registrado con éxito');
      onClose();
      resetForm();
      onDelegadoCreated();
    } catch (error) {
      toast.error('Error al registrar jugador');
      console.error('Error al registrar jugador:', error);
    }
  };

  const handleGeneroChange = (value) => {
    setFormData({
      ...formData,
      genero: value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      genero: '',
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Registrar Jugador"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="modal-title">Registrar Presidente de Club</h2>
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
              <span className="upload-text">Seleccionar foto <ImageIcon /></span>
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
          {errors.nombre && <span className="error-message">{errors.nombre}</span>}
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
          {errors.apellido && <span className="error-message">{errors.apellido}</span>}
        </div>

        <div className="form-group">
          <input
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
            className="input-field-u"
          />
          {errors.fecha_nacimiento && <span className="error-message">{errors.fecha_nacimiento}</span>}
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
          {errors.ci && <span className="error-message">{errors.ci}</span>}
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
          {errors.direccion && <span className="error-message">{errors.direccion}</span>}
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
          {errors.correo && <span className="error-message">{errors.correo}</span>}
        </div>

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

        <div className="form-buttons">
          <button type="button" className="button button-cancel" onClick={()=>{resetForm(); onClose();}}>
            Cancelar
          </button>
          <button type="submit" className="button button-primary">
            Registrar
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

export default RegistroDelegado;
