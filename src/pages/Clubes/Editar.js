import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../../assets/css/registroModal.css';
import { toast } from 'react-toastify';
import ImageCropperModal from '../../components/ImageCropperModal';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EditarClub = ({ isOpen, onClose, clubId ,onClubUpdated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    user_id: 2,
    image: null 
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      if (!clubId) return; 
      try {
        const response = await axios.get(`${API_BASE_URL}/club/get_club/${clubId}`);
        console.log('Response data:', response.data);
        
        const newFormData = {
          nombre: response.data[0]?.nombre ,
          descripcion: response.data[0]?.descripcion ,
          user_id: response.data[0]?.user_id
        };
        
        
        setFormData(newFormData);
        console.log('FormData after setting:', newFormData);
  
        if (response.data[0]?.club_imagen) {
          setImagePreview(response.data[0].club_imagen);
        }
        
      } catch (error) {
        toast.error('Error al obtener el club');
        console.error('Error al obtener el club:', error);
      }
    };
  
    fetchClub();
  }, [clubId]);
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempImage(file);
      setImagePreview(URL.createObjectURL(file)); // Vista previa temporal
      setModalIsOpen(true);
    }
  };

  const handleCropConfirm = (cropped) => {
    setCroppedImage(cropped);
    setImagePreview(URL.createObjectURL(cropped));
  };

  const handleUpdateImage = async () => {
    if (!croppedImage) {
      toast.error('Por favor, recorta la imagen antes de continuar.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('image', croppedImage);

    try {
      await axios.put(`${API_BASE_URL}/club/update_club_image/${clubId}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setModalIsOpen(false);
    } catch (e) {
      toast.error('Error al actualizar la imagen');
      console.error('Error al actualizar la imagen:', e);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({
        ...formData,
        image: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();

    if (tempImage && !croppedImage) {
      toast.error('Por favor, recorta la imagen antes de guardar.');
      return;
    }

    const dataToSend = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      user_id: 1
    };

    try {
      await axios.put(`${API_BASE_URL}/club/update_club/${clubId}`, dataToSend, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Si hay una imagen recortada, actualízala después de guardar
      if (croppedImage) {
        await handleUpdateImage();
      }

      toast.success('Club actualizado exitosamente');
      onClose();
      onClubUpdated();
    } catch (error) {
      toast.error('Error al actualizar el club');
      console.error('Error al actualizar el club:', error);
    }
  };
  
  return (
    <div>
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Editar Club"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="modal-title">Editar Club</h2>

      <form onSubmit={handleSubmitProfile} encType="multipart/form-data">
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
          <textarea
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
        </div>

        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Vista previa" className="image-preview" />
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
    </Modal>

    <ImageCropperModal
          isOpen={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          image={imagePreview}
          onCropConfirm={handleCropConfirm}
        />
    </div>
    
    
  );
};

export default EditarClub;
