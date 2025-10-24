import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/css/registroModal.css';
import MapView from '../../components/MapView';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import MapModal from '../../components/MapModal';
import PlaceIcon from '@mui/icons-material/Place';

Modal.setAppElement('#root'); 
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RegistroComplejo = ({ isOpen, onClose, onComplejoCreated }) => {
    const [nombre, setNombre] = useState('');
    const [longitud, setLongitud] = useState('');
    const [latitud, setLatitud] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [direccion, setDireccion] = useState('');
    const [mapModalOpen, setMapModalOpen] = useState(false); 
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');
  
      if (!nombre || !longitud || !latitud || !direccion) {
        setError('Todos los campos deben ser proporcionados');
        return;
      }
  
      try {
        const response = await axios.post(`${API_BASE_URL}/lugar/insert`, {
          nombre,
          longitud: parseFloat(longitud),
          latitud: parseFloat(latitud),
          direccion
        });
        toast.success('Registrado con éxito');
        setNombre('');
        setLongitud('');
        setLatitud('');
        setDireccion('');
        onClose();  // Cerrar modal tras éxito
        onComplejoCreated(); 
      } catch (err) {
        setError('Error al crear el Lugar');
        console.error(err.message);
      }
    };
  
    const openMapModal = () => setMapModalOpen(true);
    const closeMapModal = () => setMapModalOpen(false);

    const handleLocationSelect = (lat, lng, address) => {
      setLatitud(lat);
      setLongitud(lng);
      setDireccion(address);
    };
  
    return (
      <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Registrar Complejo"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="modal-header">
        <h2 className="modal-title">Registrar Complejo Deportivo</h2>
      </div>

      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del complejo"
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <textarea
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Seleccionar desde el mapa"
            readOnly
            required
            className="input-field"
          />
          <button type="button" className="map-button" onClick={openMapModal}>
            Seleccionar en el Mapa<PlaceIcon/>
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="form-buttons">
          <button type="button" className="button button-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="button button-primary">Registrar</button>
        </div>
      </form>

      {/* Modal de Mapa */}
      <MapModal
        isOpen={mapModalOpen}
        onClose={closeMapModal}
        onLocationSelect={handleLocationSelect}
        latitud={latitud}
        longitud={longitud}
      />
    </Modal>
    );
  };
  
  export default RegistroComplejo;
