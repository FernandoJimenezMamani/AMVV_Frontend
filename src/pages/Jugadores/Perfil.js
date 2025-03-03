import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../../assets/css/modalPerfil.css';
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';

Modal.setAppElement('#root');
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PerfilJugadorModal = ({ isOpen, onClose, jugadorId }) => {
    console.log(jugadorId);
  const [jugador, setJugador] = useState(null);
  const [clubes, setClubes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && jugadorId) {
      fetchJugadorData(jugadorId);
      fetchClubesPrevios(jugadorId);
    }
  }, [isOpen, jugadorId]);

  const fetchJugadorData = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jugador/get_jugadorById/${id}`);
      setJugador(response.data);
    } catch (error) {
      console.error('Error al obtener datos del jugador:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubesPrevios = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jugador/ObtenerJugadoresPreviousClubs/${id}`);
      setClubes(response.data);
    } catch (error) {
      console.error('Error al obtener clubes previos del jugador:', error);
    }
  };

  const getImagenPerfil = () => {
    if (jugador?.persona_imagen) {
      return jugador.persona_imagen;
    }
    return jugador?.genero === 'V' ? defaultUserMenIcon : defaultUserWomenIcon;
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
  const clubesActivos = clubes.filter(club => club.estadoclub === 1);
  const clubesInactivos = clubes.filter(club => club.estadoclub !== 1);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Perfil del Jugador"
      className="modal-perfil"
      overlayClassName="overlay"
    >
      {loading ? (
        <div className="modal-perfil-loading">Cargando...</div>
      ) : (
        <div className="modal-perfil-content">
          <h2 className="modal-perfil-title">Perfil del Jugador</h2>
          <div className="modal-perfil-header">
            <img src={getImagenPerfil()} alt="Jugador" className="modal-perfil-avatar" />
            <div className="modal-perfil-info">
              <p><strong>Nombre:</strong> {jugador?.nombre} {jugador?.apellido}</p>
              <p><strong>Fecha de Nacimiento:</strong> {jugador?.fecha_nacimiento}</p>
              <p><strong>Edad:</strong> {calcularEdad(jugador?.fecha_nacimiento)} años</p>
              <p><strong>Correo:</strong> {jugador?.correo}</p>
              <p><strong>Cédula de Identidad:</strong> {jugador?.ci}</p>
              <p><strong>Dirección:</strong> {jugador?.direccion}</p>
            </div>
          </div>
          <div className="modal-perfil-clubes">
          <h3>Clubes Actuales</h3>
            <div className="modal-perfil-club-box">
              {clubesActivos.length > 0 ? (
                <ul className="modal-perfil-clubes-list">
                  {clubesActivos.map((club, index) => (
                    <li key={index} className="modal-perfil-clubes-item">
                      <img src={club.club_imagen || defaultUserMenIcon} alt={club.club_nombre} className="modal-perfil-clubes-icon" />
                      <div className="modal-perfil-clubes-details">
                        <strong className="modal-perfil-clubes-nombre">{club.club_nombre}</strong>
                        <span className="modal-perfil-clubes-equipos">Equipo {club.equipos_jugador}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="modal-perfil-clubes-empty">No tiene clubes activos.</p>
              )}
            </div>

            <h3>Clubes Previos</h3>
            <div className="modal-perfil-club-box">
              {clubesInactivos.length > 0 ? (
                <ul className="modal-perfil-clubes-list">
                  {clubesInactivos.map((club, index) => (
                    <li key={index} className="modal-perfil-clubes-item">
                      <img src={club.club_imagen || defaultUserMenIcon} alt={club.club_nombre} className="modal-perfil-clubes-icon" />
                      <div className="modal-perfil-clubes-details">
                        <strong className="modal-perfil-clubes-nombre">{club.club_nombre}</strong>
                        <span className="modal-perfil-clubes-equipos">{club.equipos_jugador}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="modal-perfil-clubes-empty">No tiene clubes previos registrados.</p>
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

export default PerfilJugadorModal;
