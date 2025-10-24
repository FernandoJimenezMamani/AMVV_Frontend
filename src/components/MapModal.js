import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import '../assets/css/RegistroModalMap.css';

// Corrección de íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

Modal.setAppElement('#root');

const MapModal = ({ isOpen, onClose, onLocationSelect, latitud, longitud }) => {
  const defaultLat = -17.396019;
  const defaultLng = -66.155891;
 
  const [position, setPosition] = useState([defaultLat, defaultLng]);
  const [address, setAddress] = useState('');
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);

  const parseCoordinate = (value, fallback) => {
    if (value === null || value === undefined || value === '') return fallback;
    const num = parseFloat(value);
    return isNaN(num) ? fallback : num;
  };


  useEffect(() => {
    if (isOpen) {
      const initialLat = parseCoordinate(latitud, defaultLat);
      const initialLng = parseCoordinate(longitud, defaultLng);
      setPosition([initialLat, initialLng]);

      if (latitud && longitud) {
        reverseGeocode(initialLat, initialLng);
      }
    }
  }, [isOpen, latitud, longitud]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'Accept-Language': 'es',
          },
          timeout: 10000
        }
      );
      const address = response.data.display_name;
      setAddress(address);
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      setAddress('Dirección no disponible');
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
      },
    });
    return null;
  };

  const handleConfirmLocation = () => {
    if (position[0] && position[1]) {
      onLocationSelect(position[0], position[1], address);
      onClose();
    }
  };

  const handleClose = () => {
    setMapReady(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Seleccionar Ubicación"
      className="map-modal"
      overlayClassName="overlay"
      shouldCloseOnOverlayClick={true}
    >
      <h2 className="map-title">Seleccionar Ubicación</h2>


      <div className="map-container">
        {isOpen && (
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            whenReady={() => setMapReady(true)}
            key={JSON.stringify(position)} // Forzar re-render cuando cambia la posición
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler />
            {position && <Marker position={position} />}
          </MapContainer>
        )}
      </div>


      <div className="address-display">
        <p><strong>Dirección:</strong> {address || 'Selecciona una ubicación en el mapa'}</p>
        <p><strong>Coordenadas:</strong> {position[0]?.toFixed(6)}, {position[1]?.toFixed(6)}</p>
      </div>


      <div className="form-buttons">
        <button type="button" className="button button-cancel" onClick={handleClose}>
          Cancelar
        </button>
        <button
          type="button"
          className="button button-primary"
          onClick={handleConfirmLocation}
          disabled={!position[0] || !position[1]}
        >
          Confirmar Ubicación
        </button>
      </div>
    </Modal>
  );
};

export default MapModal;