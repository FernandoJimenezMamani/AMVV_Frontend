import React, { useEffect, useState } from 'react';
import { useParams,useNavigate ,useLocation} from 'react-router-dom';
import axios from 'axios';
import '../../assets/css/PartidoDetalle.css';
import { toast } from 'react-toastify';
import MapView from '../../components/MapView';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

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
        const response = await axios.get(`http://localhost:5002/api/partidos/get_partido_completo/${partidoId}`);
        setPartido(response.data);
      } catch (error) {
        toast.error('Error al obtener los detalles del partido');
        console.error('Error al obtener los detalles del partido:', error);
      }
    };
  
    const fetchArbitros = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/partidos/get_arbitros/${partidoId}`);
        setArbitros(response.data);
      } catch (error) {
        toast.error('Error al obtener los árbitros del partido');
        console.error('Error al obtener los árbitros del partido:', error);
      }
    };
  
    // Llamar solo una vez cuando cambia el partidoId
    fetchPartido();
    fetchArbitros();
  }, [partidoId]);

  useEffect(() => {
    // Solo cargar jugadores si el partido ya está cargado y tiene los IDs de los equipos
    if (partido) {
      const fetchJugadoresLocal = async (equipoId) => {
        try {
          const response = await axios.get(`http://localhost:5002/api/partidos/get_jugadores/${equipoId}`);
          setJugadoresLocal(response.data);
        } catch (error) {
          toast.error('Error al obtener los jugadores del equipo local');
          console.error('Error al obtener los jugadores del equipo local:', error);
        }
      };
  
      const fetchJugadoresVisitante = async (equipoId) => {
        try {
          const response = await axios.get(`http://localhost:5002/api/partidos/get_jugadores/${equipoId}`);
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

  return (
    <div className="partido-detalle-container">
    <h1 className="titulo-partido">Detalles del Partido</h1>
    
    <div className="partido-info">
      <p><strong>Fecha:</strong> {new Date(partido.fecha).toLocaleString()}</p>
      <p><strong>Lugar:</strong> {partido.lugar_nombre}</p>
      <p><strong>Estado:</strong> {partido.estado || 'Pendiente'}</p>
      <button className="map-button" onClick={() => setIsMapModalOpen(true)}>
        Ver Ubicación en el Mapa
      </button>
      <button className="map-button" onClick={() => handlePartidoClick(partidoId)}>
        Registrar Resultados
      </button>
    </div>
  
    <div className="partido-teams">
      <div className="partido-team">
        <img src={partido.equipo_local_imagen} alt="Logo equipo local" className="partido-team-logo" />
        <p className="partido-team-name">{partido.equipo_local_nombre}</p>
        <h4>Jugadores</h4>
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
        <h4>Jugadores</h4>
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
        <li key={arbitro.arbitro_id}>
          {arbitro.arbitro_nombre} {arbitro.arbitro_apellido} {arbitro.arbitro_activo ? '(Activo)' : '(Inactivo)'}
        </li>
      ))}
    </ul>
  
    <ReactModal 
      isOpen={isMapModalOpen}
      onRequestClose={() => setIsMapModalOpen(false)}
      contentLabel="Mapa del Lugar"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Ubicación del Partido</h2>
      <MapView
        initialLat={partido.lugar_latitud}
        initialLng={partido.lugar_longitud}
        isReadOnly={true}
      />
      <button className="close-map-button" onClick={() => setIsMapModalOpen(false)}>Cerrar</button>
    </ReactModal>
  </div>
  

  );
};

export default PartidoDetalle;
