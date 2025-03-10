import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../../assets/css/modalPerfil.css';
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';

Modal.setAppElement('#root');
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PerfilArbitroModal = ({ isOpen, onClose, arbitroId }) => {
  const [arbitro, setArbitro] = useState(null);
  const [totalPartidos, setTotalPartidos] = useState(0);
  const [campeonatos, setCampeonatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && arbitroId) {
      fetchArbitroData(arbitroId);
      fetchTotalPartidos(arbitroId);
      fetchCampeonatos(arbitroId);
    }
  }, [isOpen, arbitroId]);

  const fetchArbitroData = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/arbitro/get_arbitroById/${id}`);
      setArbitro(response.data);
    } catch (error) {
      console.error('Error al obtener datos del árbitro:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalPartidos = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/arbitro/matchesTotal/${id}`);
      setTotalPartidos(response.data.total_partidos_arbitrados || 0);
    } catch (error) {
      console.error('Error al obtener la cantidad de partidos arbitrados:', error);
    }
  };

  const fetchCampeonatos = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/arbitro/campeonatos/${id}`);
      setCampeonatos(response.data);
    } catch (error) {
      console.error('Error al obtener los campeonatos del árbitro:', error);
    }
  };

  const getImagenPerfil = () => {
    if (arbitro?.persona_imagen) {
      return arbitro.persona_imagen;
    }
    return arbitro?.genero === 'V' ? defaultUserMenIcon : defaultUserWomenIcon;
  };

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Perfil del Árbitro"
      className="modal-perfil"
      overlayClassName="overlay"
    >
      {loading ? (
        <div className="modal-perfil-loading">Cargando...</div>
      ) : (
        <div className="modal-perfil-content">
          <h2 className="modal-perfil-title">Perfil del Árbitro</h2>
          <div className="modal-perfil-header">
            <img src={getImagenPerfil()} alt="Árbitro" className="modal-perfil-avatar" />
            <div className="modal-perfil-info">
              <p><strong>Nombre:</strong> {arbitro?.nombre} {arbitro?.apellido}</p>
              <p><strong>Fecha de Nacimiento:</strong> {arbitro?.fecha_nacimiento}</p>
              <p><strong>Edad:</strong> {calcularEdad(arbitro?.fecha_nacimiento)} años</p>
              <p><strong>Correo:</strong> {arbitro?.correo}</p>
              <p><strong>Cédula de Identidad:</strong> {arbitro?.ci}</p>
              <p><strong>Dirección:</strong> {arbitro?.direccion}</p>
            </div>
          </div>

          {/* Cantidad de partidos arbitrados */}
          <div className="modal-perfil-clubes">
            <h3>Partidos Arbitrados</h3>
            <div className="modal-perfil-club-box">
              <p className="modal-perfil-clubes-total"><strong>{totalPartidos} partidos</strong></p>
            </div>

            {/* Campeonatos en los que participó */}
            <h3>Campeonatos Participados</h3>
            <div className="modal-perfil-club-box">
              {campeonatos.length > 0 ? (
                <ul className="modal-perfil-clubes-list">
                  {campeonatos.map((camp, index) => (
                    <li key={index} className="modal-perfil-clubes-item">
                      <strong className="modal-perfil-clubes-nombre">{camp.campeonato_nombre}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="modal-perfil-clubes-empty">No ha participado en campeonatos.</p>
              )}
            </div>
          </div>

          <div className="modal-perfil-buttons">
            <button className="button button-cancel" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PerfilArbitroModal;
