import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import Modal from 'react-modal';
import Slider from '@mui/material/Slider';
import { getCroppedImg } from '../RecortarImagen.js';  
import '../../assets/css/Editar.css';
import { useSession } from '../../context/SessionContext'; // Asegúrate de que esto esté configurado correctamente en tu proyecto
import { toast } from 'react-toastify';

const EditarPersona = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    ci: '',
    direccion: '',
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
 
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
 
  const { user } = useSession(); // Obtener el usuario actual desde el contexto
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchPersona = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/persona/get_persona/${id}`);
        setFormData({
          id: response.data.id,
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          fecha_nacimiento: response.data.fecha_nacimiento.split('T')[0], // Para manejar el formato de la fecha
          ci: response.data.ci,
          direccion: response.data.direccion,
          user_id: response.data.user_id
        });
        if (response.data.persona_imagen) {
          setImagePreview(response.data.persona_imagen);
        }
      } catch (error) {
        console.error('Error al obtener la persona:', error);
      }
    };
 
    fetchPersona();
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
 
      const response = await axios.put(`http://localhost:5002/api/persona/update_persona_image/${id}`, formDataToSend, {
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
 
  const handleSubmitProfile = async (e) => {
    e.preventDefault();
 
    const dataToSend = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      fecha_nacimiento: formData.fecha_nacimiento,
      ci: formData.ci,
      direccion: formData.direccion,
      user_id: 1 // Usar la variable de sesión correspondiente
    };
 
    try {
      await axios.put(`http://localhost:5002/api/persona/update_persona/${id}`, dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('Persona actualizada exitosamente');
      navigate('/personas/indice');
    } catch (error) {
      console.error('Error al actualizar la persona:', error);
      alert('Error al actualizar la persona');
    }
  };
 
  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
 
    if (newPassword !== confirmPassword) {
      alert('La nueva contraseña y la confirmación de la contraseña no coinciden');
      return;
    }
 
    const dataToSend = {
      currentPassword,
      newPassword,
      confirmPassword
    };
 
    try {
      await axios.put('http://localhost:5002/api/sesion/change-password', dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('Contraseña actualizada exitosamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      alert('Error al cambiar la contraseña');
    }
  };
 
 
  return (
    <div className="editar-persona">

     
      {/* Sección para editar la foto de perfil */}
      <div className="editar-seccion">
        <h3>Editar Foto de Perfil</h3>
        <div className="form-group">
          <input
            className="file-inputP"
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
          <label className="label-edit">Nombre</label>
          <div className="form-group">
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingrese el nombre"
            />
          </div>
          <label className="label-edit">Apellido</label>
          <div className="form-group">
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Ingrese el apellido"
            />
          </div>
          <label className="label-edit">Fecha de Nacimiento</label>
          <div className="form-group">
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              placeholder="Seleccione la fecha de nacimiento"
            />
          </div>
          <label className="label-edit">CI</label>
          <div className="form-group">
            <input
              type="text"
              id="ci"
              name="ci"
              value={formData.ci}
              onChange={handleChange}
              placeholder="Ingrese el CI"
            />
          </div>
          <label className="label-edit">Dirección</label>
          <div className="form-group">
            <textarea
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Ingrese la dirección"
              rows="4"
            />
          </div>
          <div className="form-group">
            <button id="edit-profile-btn" type="submit">Guardar Cambios</button>
          </div>
        </form>
      </div>
 
      {/* Solo mostrar "Ajustes de Sesión" si el usuario autenticado es el dueño del perfil */}
      {user && formData.id === user.id && (
        <div className="editar-seccion">
          <h3>Ajustes de Sesión </h3>
          <form onSubmit={handleSubmitPasswordChange}>
            <label className="label-edit">Contraseña Actual</label>
            <div className="form-group">
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ingrese la contraseña actual"
              />
            </div>
            <label className="label-edit">Nueva Contraseña</label>
            <div className="form-group">
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ingrese la nueva contraseña"
              />
            </div>
            <label className="label-edit">Confirmar Nueva Contraseña</label>
            <div className="form-group">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme la nueva contraseña"
              />
            </div>
            <div className="form-group">
              <button id="change-password-btn" type="submit">Cambiar Contraseña</button>
            </div>
          </form>
        </div>
      )}
 
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
 
export default EditarPersona;
