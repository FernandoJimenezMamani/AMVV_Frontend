import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../../assets/css/modalPerfil.css';
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';
import Club_defecto from '../../assets/img/Club_defecto.png';
import { useSession } from '../../context/SessionContext';
import rolMapping from '../../constants/roles';
Modal.setAppElement('#root');
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PerfilPresidenteModal = ({ isOpen, onClose, presidenteId }) => {
  const [presidente, setPresidente] = useState(null);
  const [clubActual, setClubActual] = useState(null);
  const [clubesAnteriores, setClubesAnteriores] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSession();
  
  useEffect(() => {
    if (isOpen && presidenteId) {
      fetchPresidenteData(presidenteId);
      fetchClubActual(presidenteId);
      fetchClubesAnteriores(presidenteId);
    }
  }, [isOpen, presidenteId]);

  const fetchPresidenteData = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/presidente_club/get_presidenteById/${id}`);
      setPresidente(response.data);
    } catch (error) {
      console.error('Error al obtener datos del presidente:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubActual = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/presidente_club/clubActual/${id}`);
      setClubActual(response.data);
    } catch (error) {
      console.error('Error al obtener el club actual del presidente:', error);
    }
  };

  const fetchClubesAnteriores = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/presidente_club/clubesAnteriores/${id}`);
      setClubesAnteriores(response.data);
    } catch (error) {
      console.error('Error al obtener clubes previos del presidente:', error);
    }
  };

  const getImagenPerfil = () => {
    if (presidente?.persona_imagen) {
      return presidente.persona_imagen;
    }
    return presidente?.genero === 'V' ? defaultUserMenIcon : defaultUserWomenIcon;
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

    const getImagenClub = (club) => {
      if (club.club_imagen) {
        return club.club_imagen; 
      }
      return Club_defecto;
    };

    const hasRole = (...roles) => {
      return user && user.rol && roles.includes(user.rol.nombre);
    };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Perfil del Presidente"
      className="modal-perfil"
      overlayClassName="overlay"
    >
      {loading ? (
        <div className="modal-perfil-loading">Cargando...</div>
      ) : (
        <div className="modal-perfil-content">
          <h2 className="modal-perfil-title">Perfil del Presidente</h2>
          <div className="modal-perfil-header">
            <img src={getImagenPerfil()} alt="Presidente" className="modal-perfil-avatar" />
            <div className="modal-perfil-info">
              <p><strong>Nombre:</strong> {presidente?.nombre} {presidente?.apellido}</p>
              <p><strong>Fecha de Nacimiento:</strong> {presidente?.fecha_nacimiento}</p>
              <p><strong>Edad:</strong> {calcularEdad(presidente?.fecha_nacimiento)} años</p>
              {hasRole(rolMapping.PresidenteAsociacion) && (
                <>
              <p><strong>Correo:</strong> {presidente?.correo}</p>
              <p><strong>Cédula de Identidad:</strong> {presidente?.ci}</p>
              <p><strong>Dirección:</strong> {presidente?.direccion}</p>
              </>   
            )}
            </div>
          </div>

          {/* Club Actual */}
          <div className="modal-perfil-clubes">
            <h3>Club Actual</h3>
            <div className="modal-perfil-club-box">
              {clubActual ? (
                <div className="modal-perfil-clubes-item">
                  <img src={getImagenClub(clubActual)} alt={clubActual.club_nombre} className="modal-perfil-clubes-icon" />
                  <div className="modal-perfil-clubes-details">
                    <strong className="modal-perfil-clubes-nombre">{clubActual.club_nombre}</strong>
                    <p className="modal-perfil-clubes-desc">{clubActual.descripcion}</p>
                  </div>
                </div>
              ) : (
                <p className="modal-perfil-clubes-empty">No tiene un club activo actualmente.</p>
              )}
            </div>

            {/* Clubes Anteriores */}
            <h3>Clubes Anteriores</h3>
            <div className="modal-perfil-club-box">
              {clubesAnteriores.length > 0 ? (
                <ul className="modal-perfil-clubes-list">
                  {clubesAnteriores.map((club, index) => (
                    <li key={index} className="modal-perfil-clubes-item">
                      <img src={getImagenClub(club)} alt={club.club_nombre} className="modal-perfil-clubes-icon" />
                      <div className="modal-perfil-clubes-details">
                        <strong className="modal-perfil-clubes-nombre">{club.club_nombre}</strong>
                        <p className="modal-perfil-clubes-desc">{club.descripcion}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="modal-perfil-clubes-empty">No tiene clubes anteriores registrados.</p>
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

export default PerfilPresidenteModal;
