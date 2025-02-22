import React, { useEffect, useState } from 'react';
import { useParams,useNavigate ,useLocation} from 'react-router-dom';
import axios from 'axios';
import '../../assets/css/PartidoDetalle.css';
import { toast } from 'react-toastify';
import MapView from '../../components/MapView';
import ReactModal from 'react-modal';
import defaultUserIcon from '../../assets/img/user-icon.png';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';
import MapaDetalle from '../../components/MapaDetalle';

ReactModal.setAppElement('#root');
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PartidoDetalle = () => {
  const { partidoId } = useParams(); 
  const [partido, setPartido] = useState(null);
  const [jugadoresLocal, setJugadoresLocal] = useState([]);
  const [jugadoresVisitante, setJugadoresVisitante] = useState([]);
  const [arbitros, setArbitros] = useState([]);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { campeonatoId, categoriaId } = location.state || {};

  useEffect(() => {
    const fetchPartido = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/partidos/get_partido_completo/${partidoId}`);
        setPartido(response.data);
      } catch (error) {
        toast.error('Error al obtener los detalles del partido');
        console.error('Error al obtener los detalles del partido:', error);
      }
    };
  
    const fetchArbitros = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/partidos/get_arbitros/${partidoId}`);
        setArbitros(response.data);
      } catch (error) {
        toast.error('Error al obtener los árbitros del partido');
        console.error('Error al obtener los árbitros del partido:', error);
      }
    };
  
    fetchPartido();
    fetchArbitros();
  }, [partidoId]);

  useEffect(() => {
    if (partido) {
      const fetchJugadoresLocal = async (equipoId) => {
        try {
          const response = await axios.get(`${API_BASE_URL}/partidos/get_jugadores/${equipoId}`);
          setJugadoresLocal(response.data);
        } catch (error) {
          toast.error('Error al obtener los jugadores del equipo local');
          console.error('Error al obtener los jugadores del equipo local:', error);
        }
      };
  
      const fetchJugadoresVisitante = async (equipoId) => {
        try {
          const response = await axios.get(`${API_BASE_URL}/partidos/get_jugadores/${equipoId}`);
          setJugadoresVisitante(response.data);
        } catch (error) {
          toast.error('Error al obtener los jugadores del equipo visitante');
          console.error('Error al obtener los jugadores del equipo visitante:', error);
        }
      };
  
      fetchJugadoresLocal(partido.equipo_local_id);
      fetchJugadoresVisitante(partido.equipo_visitante_id);
    }
  }, [partido]);

  if (!partido) {
    return <div>Cargando detalles del partido...</div>;
  }

  const handlePartidoClick = (partidoId) => {
    navigate(`/partidos/registrarResultado/${partidoId}`, {
      state: { campeonatoId, categoriaId },
    });
  };

  const formatTime = (fecha) => {
    const partidoDate = new Date(fecha); 
  
    return partidoDate.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, 
      timeZone: 'UTC', 
    });
  };

  const formatDate = (fecha) => {
    const partidoDate = new Date(fecha);
    
    return partidoDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getImagenPerfil = (arbitro) => {
    if (arbitro.persona_imagen) {
      return arbitro.persona_imagen; 
    }
    return arbitro.arbitro_genero === 'V' ? defaultUserMenIcon : defaultUserWomenIcon; 
  };
  
  return (
    <div className="partido-detalle-container">
    <h1 className="titulo-partido">Detalles del Partido</h1>
    <div className="resultado-button-container">
      <button className="resultado-button" onClick={() => handlePartidoClick(partidoId)}>
        Registrar Resultado <AssignmentIcon/>
      </button>
    </div>

    <div className="partido-info">
      <p><strong>Fecha:</strong> {formatDate(partido.fecha)} , {formatTime(partido.fecha)}</p>
      <p>
        <strong>Lugar del encuentro:</strong> {partido.lugar_nombre}
        <button className="map-button-inline" onClick={() => setIsMapModalOpen(true)}>
          <LocationOnIcon/>
        </button>
      </p>
    </div>
  
    <div className="partido-teams">
      <div className="partido-team">
        <img src={partido.equipo_local_imagen} alt="Logo equipo local" className="partido-team-logo" />
        <p className="partido-team-name">{partido.equipo_local_nombre}</p>
        <h4 className="jugadores-title" >Jugadores</h4>
        <ul className="jugadores-list">
          {jugadoresLocal.length > 0 ? (
            jugadoresLocal.map(jugador => (
              <li key={jugador.jugador_id}>{jugador.jugador_nombre} {jugador.jugador_apellido}</li>
            ))
          ) : (
            <p>No hay jugadores registrados para este equipo.</p>
          )}
        </ul>
      </div>
      
      <div className="vs-container">
        <h2>VS</h2>
      </div>
  
      <div className="partido-team">
        <img src={partido.equipo_visitante_imagen} alt="Logo equipo visitante" className="partido-team-logo" />
        <p className="partido-team-name">{partido.equipo_visitante_nombre}</p>
        <h4 className="jugadores-title">Jugadores</h4>
        <ul className="jugadores-list">
          {jugadoresVisitante.length > 0 ? (
            jugadoresVisitante.map(jugador => (
              <li key={jugador.jugador_id}>{jugador.jugador_nombre} {jugador.jugador_apellido}</li>
            ))
          ) : (
            <p>No hay jugadores registrados para este equipo.</p>
          )}
        </ul>
      </div>
    </div>
  
    <h2 className="titulo-arbitros">Árbitros</h2>
    <ul className="arbitros-list">
      {arbitros.map(arbitro => (
        <li key={arbitro.arbitro_id} className="arbitro-item">
        <img 
          src={getImagenPerfil(arbitro)} 
          alt="Foto del árbitro" 
          className="arbitro-foto" 
        />
        <span>{arbitro.arbitro_nombre} {arbitro.arbitro_apellido}</span>
      </li>
      
      ))}
    </ul>
  
    <MapaDetalle 
      isOpen={isMapModalOpen}
      onClose={() => setIsMapModalOpen(false)}
      lat={partido.lugar_latitud}
      lng={partido.lugar_longitud}
    />
  </div>
  

  );
};

export default PartidoDetalle;
