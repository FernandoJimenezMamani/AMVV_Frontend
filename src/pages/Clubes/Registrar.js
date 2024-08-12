import React, { useState } from 'react';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import Modal from 'react-modal';
import Slider from '@mui/material/Slider';
import { getCroppedImg } from '../RecortarImagen.js';
import '../../assets/css/Registro.css'; 

const RegistroClub = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    user_id: 1
  });

  const [image, setImage] = useState(null);
  const [tempImage, setTempImage] = useState(null); 
  const [imagePreview, setImagePreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      const response = await axios.post('http://localhost:5002/api/club/post_club', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      alert('Club creado exitosamente');
    } catch (error) {
      console.error('Error al crear el club:', error);
      alert('Error al crear el club');
    }
  };

  const handleCropConfirm = async () => {
    try {
      const croppedImage = await getCroppedImg(imagePreview, croppedAreaPixels, 200, 200);
      setCroppedImage(croppedImage);
      setImage(URL.createObjectURL(croppedImage));
      setImagePreview(URL.createObjectURL(croppedImage));
      setModalIsOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = () => {
    setModalIsOpen(false);
    setTempImage(null);
    setImagePreview(null); 
    document.getElementById('image').value = ''; 
  };

  return (
    <div className="registro-campeonato">
      <h2>Registrar Club</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Descripción"
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
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
          <label htmlFor="image" className="file-label">
            <span className="file-button"><i className="fa fa-image"></i></span>
            <span className="file-name">{imagePreview ? "Archivo seleccionado" : "Sin archivos seleccionados"}</span>
          </label>
        </div>
        {imagePreview && (
          <div className="form-group">
            <img src={imagePreview} alt="Vista previa de la imagen" className="image-preview" />
          </div>
        )}
        <div className="form-group">
          <button id="RegCampBtn" type="submit">Registrar</button>
        </div>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCancel}
        contentLabel="Crop Image"
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
          <button className='bottonsImageCancel' onClick={handleCancel}>Cancelar</button>
          <button className='bottonsImage' onClick={handleCropConfirm}>Aplicar</button>
        </div>
      </Modal>
    </div>
  );
};

export default RegistroClub;
