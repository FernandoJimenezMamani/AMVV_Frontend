import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import Modal from 'react-modal';
import Slider from '@mui/material/Slider';
import { getCroppedImg } from '../RecortarImagen.js';  
import '../../assets/css/Editar.css';
import { toast } from 'react-toastify';

const EditarClub = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    user_id: 2,
    image: null 
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/club/get_club/${id}`);
        setFormData({
          nombre: response.data.nombre,
          descripcion: response.data.descripcion,
          user_id: response.data.user_id
        });
        if (response.data.club_imagen) {
          setImagePreview(response.data.club_imagen);
        }
      } catch (error) {
        console.error('Error al obtener el club:', error);
      }
    };

    fetchClub();
  }, [id]);

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

  const handleUpdateImage = async () => {
    try {
      const croppedImage = await getCroppedImg(imagePreview, croppedAreaPixels, 200, 200);
      setCroppedImage(croppedImage);
      setImagePreview(URL.createObjectURL(croppedImage));
  
      const formDataToSend = new FormData();
      formDataToSend.append('image', croppedImage);
  
      const response = await axios.put(`http://localhost:5002/api/club/update_club_image/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      toast.success('Editado con éxito');
  
      setModalIsOpen(false);
    } catch (e) {
      console.error('Error al recortar la imagen:', e);
      alert('Error al recortar la imagen');
    }
  };

  const handleCancel = () => {
    setModalIsOpen(false);
    setTempImage(null);
    setImagePreview(null);
    document.getElementById('fileInput').value = '';
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
  
    const dataToSend = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      user_id: 1 // Usar la variable de sesión correspondiente
    };
  
    try {
      await axios.put(`http://localhost:5002/api/club/update_club/${id}`, dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('Club actualizado exitosamente');
      navigate('/clubes/indice');
    } catch (error) {
      console.error('Error al actualizar el club:', error);
      alert('Error al actualizar el club');
    }
  };


  return (
    <div className="editar-club">
      <h2>Editar Club</h2>
      
      {/* Sección para editar la foto de perfil */}
      <div className="editar-seccion">
        <h3>Editar Foto de Perfil</h3>
        <div className="form-group">
          <input 
            type="file" 
            id="fileInput" 
            onChange={handleImageChange} 
            accept="image/jpeg, image/png, image/gif"
          />
          {imagePreview && <img src={imagePreview} alt="Vista previa de la imagen" className="image-preview" />}
        </div>
        <button id="edit-image-btn" onClick={handleUpdateImage}>Guardar Imagen</button>
      </div>

      {/* Sección para editar los ajustes del perfil */}
      <div className="editar-seccion">
        <h3>Ajustes de Perfil</h3>
        <form onSubmit={handleSubmitProfile}>
          <label className="label-edit">Nombre del Club</label>
          <div className="form-group">
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingrese el nombre del club"
            />
          </div>
          <label className="label-edit">Descripción</label>
          <div className="form-group">
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Ingrese la descripción del club"
              rows="4"
            />
          </div>
          <div className="form-group">
            <button id="edit-profile-btn" type="submit">Guardar Cambios</button>
          </div>
        </form>
      </div>

      {/* Modal para recortar la imagen */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCancel}
        contentLabel="Recortar Imagen"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Edita la imagen</h2>
        <div className="crop-container">
          <Cropper
            image={imagePreview}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="controls">
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e, zoom) => setZoom(zoom)}
          />
        </div>
        <div className="buttons">
          <button className="bottonsImageCancel" onClick={handleCancel}>Cancelar</button>
          <button className="bottonsImage" onClick={handleUpdateImage}>Actualizar Imagen</button>
        </div>
      </Modal>
    </div>
  );
};

export default EditarClub;
