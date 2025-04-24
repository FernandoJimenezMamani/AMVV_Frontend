import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import '../../assets/css/registroModal.css';
import ImageCropperModal from '../../components/ImageCropperModal';
import { Select } from 'antd';
import ImageIcon from '@mui/icons-material/Image';
import roleNames from '../../constants/roles';

const { Option } = Select;

Modal.setAppElement('#root');
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RegistroArbitro = ({ isOpen, onClose, onPersonaCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    ci: '',
    direccion: '',
    correo: '',
    genero: 'V', // Valor inicial por defecto
    roles: [roleNames.Arbitro], // Solo el rol de Árbitro
    club_jugador_id: null,
    club_presidente_id: null,
    club_delegado_id: null,
  });

  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const fileInputRef = React.createRef();
  const [isLoading, setIsLoading] = useState(false);
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
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCropConfirm = (cropped) => {
    setCroppedImage(cropped);
    setImagePreview(URL.createObjectURL(cropped));
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      fecha_nacimiento: '',
      ci: '',
      direccion: '',
      correo: '',
      genero: 'V',
      roles: [roleNames.Arbitro],
      club_jugador_id: null,
      club_presidente_id: null,
      club_delegado_id: null,
    });
    setErrors({});
    setImage(null);
    setTempImage(null);
    setImagePreview(null);
    setCroppedImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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

    // Campos de clubes enviados como null
    data.append('club_jugador_id', formData.club_jugador_id);
    data.append('club_presidente_id', formData.club_presidente_id);
    data.append('club_delegado_id', formData.club_delegado_id);

    if (croppedImage) {
      data.append('image', croppedImage);
    } else if (image) {
      data.append('image', image);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/persona/post_persona`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Datos enviados al backend:', Object.fromEntries(data.entries()));
      toast.success('Árbitro registrado con éxito');
      resetForm();
      onPersonaCreated();
      onClose();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // ahora sí muestra los mensajes 400
      } else if (error.response && error.response.data && error.response.data.mensaje) {
        toast.error(error.response.data.mensaje); // para el caso del CI duplicado (409)
      } else {
        toast.error('Error al registrar árbitro');
      }
      console.error('Error al crear árbitro:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Registrar Árbitro"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="modal-title">Registrar Árbitro</h2>
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
              <span className="upload-text">Seleccionar foto para árbitro <ImageIcon /></span>
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

        <div className="form-buttons">
          <button type="button" className="button button-cancel" onClick={()=>{resetForm(); onClose();}}>
            Cancelar
          </button>
          <button type="submit" className="button button-primary" disabled={isLoading}>
            {isLoading ? <span className="spinner"></span> : "Registrar"}
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

export default RegistroArbitro;
