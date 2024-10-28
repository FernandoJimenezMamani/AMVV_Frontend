import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix the default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapView = ({ initialLat, initialLng, onLocationSelect, isReadOnly = false }) => {
  const [position, setPosition] = useState(initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null);

  useEffect(() => {
    // Si hay valores iniciales, establecer la posición
    if (initialLat && initialLng) {
      setPosition({ lat: initialLat, lng: initialLng });
    }
  }, [initialLat, initialLng]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (!isReadOnly) {
          const { lat, lng } = e.latlng;
          setPosition(e.latlng);
          onLocationSelect(lat, lng);
        }
      },
    });
    return position ? <Marker position={position}></Marker> : null;
  };

  return (
    <MapContainer
      center={position || [-17.3935, -66.1570]} // Centro predeterminado si no hay una posición inicial
      zoom={13}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler />
    </MapContainer>
  );
};

export default MapView;
