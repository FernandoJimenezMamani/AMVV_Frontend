import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../../assets/css/registroModal.css';
import { toast } from 'react-toastify';
import MapModal from '../../components/MapModal';
import PlaceIcon from '@mui/icons-material/Place';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EditarComplejo = ({ isOpen, onClose, complejoId, onComplejoUpdated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    latitud: '',
    longitud: '',
    user_id: 2,
  });

  const [mapModalOpen, setMapModalOpen] = useState(false);

  useEffect(() => {
    const fetchComplejo = async () => {
      if (!complejoId) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/lugar/${complejoId}`);
        const {nombre,latitud,longitud,direccion} = response.data;

        setFormData({
          nombre: nombre,
          direccion: direccion,
          latitud: latitud,
          longitud: longitud,
          user_id:  2,
        });
        console.log(formData);
      } catch (error) {
        toast.error('Error al obtener los datos del complejo');
        console.error('Error al obtener el complejo:', error);
      }
    };

    fetchComplejo();
  }, [complejoId]);

  const handleLocationSelect = (lat, lng, address) => {
    setFormData((prevData) => ({
      ...prevData,
      latitud: lat,
      longitud: lng,
      direccion: address,
    }));
    closeMapModal();
  };

  const openMapModal = () => setMapModalOpen(true);
  const closeMapModal = () => setMapModalOpen(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.direccion || !formData.latitud || !formData.longitud) {
      toast.error('Todos los campos deben ser completados');
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/lugar/edit/${complejoId}`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      toast.success('Complejo actualizado exitosamente');
      onClose();
      onComplejoUpdated();
    } catch (error) {
      toast.error('Error al actualizar el complejo');
      console.error('Error al actualizar el complejo:', error);
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Editar Complejo"
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="modal-title">Editar Complejo Deportivo</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre del complejo"
              required
              className="input-field"
            />
          </div>

          <div className="form-group">
            <textarea
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Seleccionar desde el mapa"
              required
              className="input-field"
              readOnly
            />
            <button type="button" className="map-button" onClick={openMapModal}>
              Seleccionar en el Mapa <PlaceIcon />
            </button>
          </div>
          <div className="form-buttons">
            <button type="button" className="button button-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="button button-primary">Guardar Cambios</button>
          </div>
        </form>
      </Modal>

      <MapModal
        isOpen={mapModalOpen}
        onClose={closeMapModal}
        onLocationSelect={handleLocationSelect}
        latitud={formData.latitud}  // Pasamos latitud al modal
        longitud={formData.longitud}  // Pasamos longitud al modal
        />
    </div>
  );
};

export default EditarComplejo;
