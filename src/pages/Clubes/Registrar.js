import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/registroModal.css';
import ImageCropperModal from '../../components/ImageCropperModal';

Modal.setAppElement('#root'); // Necesario para accesibilidad
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RegistroClub = ({ isOpen, onClose, onClubCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    user_id: 1
  });

  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [formModalIsOpen, setFormModalIsOpen] = useState(false); // Nuevo modal para el formulario
  const navigate = useNavigate();

  // Función para abrir el modal del formulario
  const openFormModal = () => setFormModalIsOpen(true);
  const closeFormModal = () => setFormModalIsOpen(false);

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre) {
      newErrors.nombre = 'El nombre del club es obligatorio';
    }
    if (!formData.descripcion) {
      newErrors.descripcion = 'La descripción del club es obligatoria';
    }
    return newErrors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempImage(file);
      setImagePreview(URL.createObjectURL(file));
      setModalIsOpen(true);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
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
    data.append('descripcion', formData.descripcion);
    data.append('user_id', formData.user_id);
    if (croppedImage) {
      data.append('image', croppedImage);
    } else if (image) {
      data.append('image', image);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/club/post_club`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response.data);
      toast.success('Registrado con éxito');
      onClose(); 
      onClubCreated();
    } catch (error) {
      toast.error('Error al registrar');
      console.error('Error al crear el club:', error);
    }
  };

  const handleCropConfirm = (cropped) => {
    setCroppedImage(cropped);
    setImagePreview(URL.createObjectURL(cropped));
  };

  return (
    <div>
      <Modal
        isOpen={isOpen} 
        onRequestClose={closeFormModal}
        contentLabel="Registrar Club"
        className="modal"
        overlayClassName="overlay"
        
      >
        <h2 className="modal-title">Registrar Club</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <input
              type="text"
              placeholder="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            className="file-input"
          />
          <label htmlFor="image" className={`file-label ${imagePreview ? 'has-file' : ''}`}>
            <span className="file-name">
              {imagePreview ? "Archivo seleccionado" : "Sin archivos seleccionados"}
            </span>
          </label>

          {/* Vista previa de la imagen */}
          {imagePreview && (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Vista previa" className="image-preview" />
            </div>
          )}
        </div>


          {/* Botones lado a lado */}
          <div className="form-buttons">
          <button type="button" className="button button-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="button button-primary">Registrar</button>
            
          </div>
        </form>
      </Modal>

      {/* Modal para recortar la imagen */}
      <ImageCropperModal
          isOpen={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          image={imagePreview}
          onCropConfirm={handleCropConfirm}
        />
    </div>
  );
};

export default RegistroClub;
