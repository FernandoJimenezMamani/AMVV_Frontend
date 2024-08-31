import React, { useState } from 'react';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import Modal from 'react-modal';
import Slider from '@mui/material/Slider';
import { getCroppedImg } from '../RecortarImagen.js';
import '../../assets/css/Registro.css';
 
const RegistroPersona = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    ci: '',
    direccion: '',
    contrasena: '',
    correo: ''
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
    data.append('apellido', formData.apellido);
    data.append('fecha_nacimiento', formData.fecha_nacimiento);
    data.append('ci', formData.ci);
    data.append('direccion', formData.direccion);
    data.append('contrasena', formData.contrasena);
    data.append('correo', formData.correo);
    if (croppedImage) {
      data.append('image', croppedImage);
    } else if (image) {
      data.append('image', image);
    }
 
    try {
      const response = await axios.post('http://localhost:5002/api/persona/post_persona', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      alert('Persona creada exitosamente');
    } catch (error) {
      console.error('Error al crear la persona:', error);
      alert('Error al crear la persona');
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
      <h2>Registrar Persona</h2>
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
            placeholder="Apellido"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            placeholder="Fecha de Nacimiento"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Cédula de Identidad"
            id="ci"
            name="ci"
            value={formData.ci}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Dirección"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Correo"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Contraseña"
            id="contrasena"
            name="contrasena"
            value={formData.contrasena}
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
 
export default RegistroPersona;