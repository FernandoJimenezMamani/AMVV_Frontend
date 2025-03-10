import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../../assets/css/modalPerfil.css';

import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';

Modal.setAppElement('#root');
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PerfilDelegadoModal = ({ isOpen, onClose, delegadoId }) => {
  const [delegado, setDelegado] = useState(null);
  const [clubActual, setClubActual] = useState(null);
  const [clubesAnteriores, setClubesAnteriores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && delegadoId) {
      fetchDelegadoData(delegadoId);
      fetchClubActual(delegadoId);
      fetchClubesAnteriores(delegadoId);
    }
  }, [isOpen, delegadoId]);

  const fetchDelegadoData = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/presidente_club/get_delegadoById/${id}`);
      setDelegado(response.data);
    } catch (error) {
      console.error('Error al obtener datos del delegado:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubActual = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/presidente_club/clubActualDelegado/${id}`);
      setClubActual(response.data);
    } catch (error) {
      console.error('Error al obtener el club actual del delegado:', error);
    }
  };

  const fetchClubesAnteriores = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/presidente_club/clubesAnterioresDelegado/${id}`);
      setClubesAnteriores(response.data);
    } catch (error) {
      console.error('Error al obtener clubes previos del delegado:', error);
    }
  };

  const getImagenPerfil = () => {
    if (delegado?.persona_imagen) {
      return delegado.persona_imagen;
    }
    return delegado?.genero === 'V' ? defaultUserMenIcon : defaultUserWomenIcon;
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
      contentLabel="Perfil del Delegado"
      className="modal-perfil"
      overlayClassName="overlay"
    >
      {loading ? (
        <div className="modal-perfil-loading">Cargando...</div>
      ) : (
        <div className="modal-perfil-content">
          <h2 className="modal-perfil-title">Perfil del Delegado</h2>
          <div className="modal-perfil-header">
            <img src={getImagenPerfil()} alt="Delegado" className="modal-perfil-avatar" />
            <div className="modal-perfil-info">
              <p><strong>Nombre:</strong> {delegado?.nombre} {delegado?.apellido}</p>
              <p><strong>Fecha de Nacimiento:</strong> {delegado?.fecha_nacimiento}</p>
              <p><strong>Edad:</strong> {calcularEdad(delegado?.fecha_nacimiento)} años</p>
              <p><strong>Correo:</strong> {delegado?.correo}</p>
              <p><strong>Cédula de Identidad:</strong> {delegado?.ci}</p>
              <p><strong>Dirección:</strong> {delegado?.direccion}</p>
            </div>
          </div>

          {/* Club Actual */}
          <div className="modal-perfil-clubes">
            <h3>Club Actual</h3>
            <div className="modal-perfil-club-box">
              {clubActual ? (
                <div className="modal-perfil-clubes-item">
                  <img src={clubActual.club_imagen } alt={clubActual.club_nombre} className="modal-perfil-clubes-icon" />
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
                      <img src={club.club_imagen } alt={club.club_nombre} className="modal-perfil-clubes-icon" />
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

export default PerfilDelegadoModal;
