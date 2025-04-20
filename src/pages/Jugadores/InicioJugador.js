import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../assets/css/inicioPresidente.css';
import Club_defecto from '../../assets/img/Club_defecto.png';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const InicioJugador = ({ jugadorId }) => {
  const [clubActual, setClubActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (jugadorId) {
      fetchClubActual(jugadorId);
    }
  }, [jugadorId]);

  const fetchClubActual = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jugador/clubActual/${id}`);
      setClubActual(response.data);
    } catch (error) {
      console.error('Error al obtener el club actual del presidente:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImagenClub = (club) => {
    if (club.club_imagen) {
      return club.club_imagen; 
    }
    return Club_defecto;
  };

  return (
    <div className="inicio-presidente-container">
      {loading ? (
        <div className="loading">Cargando...</div>
      ) : clubActual ? (
        <div className="club-info-Inicio">
               <h2 className="titulo-mi-club">Mi Club</h2>
          <img src={getImagenClub(clubActual) } alt={clubActual.club_nombre} className="club-logo-Inicio" />
          <h2 className="club-nombre-Inicio ">{clubActual.club_nombre}</h2>
          <button className="btn-ver-club" onClick={() => navigate(`/clubes/Perfil/${clubActual.club_id}`)}>
            Ver Perfil del Club
          </button>
        </div>
      ) : (
        <p className="no-club">No tienes un club activo actualmente.</p>
      )}
    </div>
  );
};

export default InicioJugador;
