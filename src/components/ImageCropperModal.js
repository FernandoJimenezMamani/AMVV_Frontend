import React, { useState } from 'react';
import Modal from 'react-modal';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import { getCroppedImg } from '../pages/RecortarImagen.js';
import '../assets/css/registroModal.css'; // Asegúrate de mantener los estilos

Modal.setAppElement('#root');

const ImageCropperModal = ({ isOpen, onClose, image, onCropConfirm }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, 200, 200);
      onCropConfirm(croppedImage);  // Devolver la imagen recortada
      onClose();  // Cerrar el modal después de aplicar
    } catch (e) {
      console.error('Error al recortar la imagen:', e);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCancel}
      contentLabel="Recortar Imagen"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Edita la imagen</h2>
      <div className="crop-container">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <Slider
        value={zoom}
        min={1}
        max={3}
        step={0.1}
        onChange={(e, zoom) => setZoom(zoom)}
      />
      <div className="buttons">
        <button onClick={handleCancel} className="button button-cancel">
          Cancelar
        </button>
        <button onClick={handleCropConfirm} className="button button-primary">
          Aplicar
        </button>
      </div>
    </Modal>
  );
};

export default ImageCropperModal;
