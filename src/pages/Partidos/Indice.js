import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/css/Partidos/IndicePartido.css';

const PartidosList = () => {
  const { campeonatoId, categoriaId } = useParams();
  const [partidos, setPartidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/partidos/select/${categoriaId}`);
        setPartidos(response.data);
      } catch (error) {
        console.error('Error al obtener los partidos:', error);
      }
    };

    fetchPartidos();
  }, [categoriaId]);

  const handleRegistrarPartido = () => {
    navigate(`/partidos/registrar/${campeonatoId}/${categoriaId}`);
  };

  const handleVerTabla = () => {
    navigate(`/tablaposiciones/${categoriaId}/${campeonatoId}`);
  };

  const formatDate = (fecha) => {
    const now = new Date();
    const partidoDate = new Date(fecha);
    const currentWeek = now.getWeek(); // Custom function to get the week number
    const partidoWeek = partidoDate.getWeek();

    if (currentWeek === partidoWeek) {
      return partidoDate.toLocaleDateString('es-ES', { weekday: 'long' });
    } else {
      return partidoDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    }
  };

  // Adding getWeek method to Date prototype
  Date.prototype.getWeek = function () {
    const firstDayOfYear = new Date(this.getFullYear(), 0, 1);
    const pastDaysOfYear = (this - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  return (
    <div className="all-matches-container">
    <h2 className="all-matches-titulo">Partidos</h2>
    <button className="all-matches-registrar-button" onClick={handleRegistrarPartido}>
      Registrar Partido
    </button>
  
    <button className="all-matches-ver-tabla-button" onClick={handleVerTabla}>
      Ver tabla
    </button>
    <div className="all-matches-grid">
      {partidos.map((partido) => (
        <div key={partido.id} className="all-matches-card">
          <div className="all-matches-team-info">
            <div className="all-matches-team">
              <img src={partido.equipo_local_imagen} alt={partido.equipo_local_nombre} className="all-matches-team-logo"/>
              <p className="all-matches-team-name">{partido.equipo_local_nombre}</p>
            </div>
            <div className="all-matches-vs">VS</div>
            <div className="all-matches-team">
              <img src={partido.equipo_visitante_imagen} alt={partido.equipo_visitante_nombre} className="all-matches-team-logo"/>
              <p className="all-matches-team-name">{partido.equipo_visitante_nombre}</p>
            </div>
          </div>
          <div className="all-matches-info">
            <p className="all-matches-date">{formatDate(partido.fecha)}</p>
            <p className="all-matches-time">{new Date(partido.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default PartidosList;
