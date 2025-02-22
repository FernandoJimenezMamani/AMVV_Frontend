import React from 'react';
import ReactModal from 'react-modal';
import MapView from './MapView';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import '../assets/css/MapaDetalle.css';

const MapaDetalle = ({ isOpen, onClose, lat, lng }) => {
  return (
    <ReactModal 
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Mapa del Lugar"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Ubicación del Partido</h2>
      <MapView initialLat={lat} initialLng={lng} isReadOnly={true} />
      <button className="close-map-button" onClick={onClose}>Cerrar</button>
    </ReactModal>
  );
};

export default MapaDetalle;
