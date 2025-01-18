import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
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
  const [position, setPosition] = useState([latitud || -17.3935, longitud || -66.1570]);
  const [address, setAddress] = useState('');
  const mapRef = useRef(null);  // Referencia al mapa

  useEffect(() => {
    if (latitud && longitud) {
      setPosition([latitud, longitud]);
      reverseGeocode(latitud, longitud);
    }
  }, [latitud, longitud]);

  useEffect(() => {
    // Esperar a que el mapa esté listo para centrarlo correctamente
    if (mapRef.current && latitud && longitud) {
      mapRef.current.setView([latitud, longitud], 13);
    }
  }, [isOpen]);  // Cuando el modal se abre, centramos el mapa

  // Geocodificación inversa para obtener la dirección
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const address = response.data.display_name;
      setAddress(address);
      onLocationSelect(lat, lng, address);  // Pasar dirección al padre
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      setAddress('Dirección no disponible');
    }
  };

  const MapClickHandler = () => {
    const map = useMap();

    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        reverseGeocode(lat, lng);
        map.setView([lat, lng], map.getZoom());
      },
    });
    return position ? <Marker position={position}></Marker> : null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Seleccionar Ubicación"
      className="map-modal"
      overlayClassName="overlay"
    >
      <h2 className="map-title">Seleccionar Ubicación</h2>

      <div className="map-container">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          whenCreated={(mapInstance) => (mapRef.current = mapInstance)}  // Asignar referencia
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler />
        </MapContainer>
      </div>

      <div className="address-display">
        <p><strong>Dirección:</strong> {address || 'Selecciona una ubicación en el mapa'}</p>
      </div>

      <div className="form-buttons">
        <button className="button button-cancel" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default MapModal;
