import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../assets/css/Equipos/EquiposPerfil.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';
import PerfilJugadorModal from '../Jugadores/Perfil';
import estadosPartidoCampMapping from '../../constants/estadoPartido';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Select } from 'antd';
import estadosMapping from '../../constants/campeonatoEstados';
import { useSession } from '../../context/SessionContext';
import rolMapping from '../../constants/roles';
import ConfirmModal from '../../components/ConfirmModal';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PerfilEquipo = () => {
  const { id } = useParams();
  const [equipo, setEquipo] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("informacion"); 
  const [showPerfilModal, setShowPerfilModal] = useState(false); 
  const [selectedPersonaId, setSelectedPersonaId] = useState(null); 
  const [partidos, setPartidos] = useState([]);
  const [campeonatos, setCampeonatos] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState(null);
  const [participaciones, setParticipaciones] = useState([]);
  const { user } = useSession();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedJugadorId, setSelectedJugadorId] = useState(null);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    fetchEquipoAndJugadores();
  }, [id]);

  const fetchEquipoAndJugadores = async () => {
    try {
      const equipoResponse = await axios.get(`${API_BASE_URL}/equipo/get_equipo/${id}`);
      setEquipo(equipoResponse.data);
      const jugadoresResponse = await axios.get(`${API_BASE_URL}/jugador/get_jugadores_equipo/${id}`);
      setJugadores(jugadoresResponse.data);
    } catch (error) {
      toast.error('Error al obtener el equipo y jugadores');
      console.error('Error al obtener el equipo y jugadores:', error);
    }
  };

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/campeonatos/select`);
        setCampeonatos(response.data);
        if (response.data.length > 0) {
          setSelectedCampeonato(response.data[0].id); 
        }
      } catch (error) {
        toast.error('Error al obtener campeonatos');
        console.error('Error al obtener campeonatos:', error);
      }
    };
  
    fetchCampeonatos();
  }, []);
  

  useEffect(() => {
    const fetchPartidos = async () => {
      if (!selectedCampeonato) return; 
      try {
        const response = await axios.get(`${API_BASE_URL}/partidos/selectPartidosById/${id}/${selectedCampeonato}`);
        setPartidos(response.data);
      } catch (error) {
        toast.error('Error al obtener los partidos del equipo');
        console.error('Error al obtener los partidos:', error);
      }
    };
  
    if (activeTab === "partidos") {
      fetchPartidos();
    }
  }, [id, activeTab, selectedCampeonato]);

  useEffect(() => {
    const fetchParticipaciones = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/campeonatos/select`);
        const campeonatos = response.data;
        let participacionesTemp = [];
  
        for (const campeonato of campeonatos) {
          try {
            const posicionResponse = await axios.post(`${API_BASE_URL}/campeonatos/obtenerEquipoPosicion`, {
              categoriaId: equipo.categoria_id,
              campeonatoId: campeonato.id,
              equipoId: equipo.id,
            });
  
            if (posicionResponse.data) {
              participacionesTemp.push({
                nombre: campeonato.nombre,
                estado_campeonato : campeonato.estado,
                posicion: posicionResponse.data.posicion
              });
            }
          } catch (error) {
            console.warn(`El equipo no participó en ${campeonato.nombre}`);
          }
        }
  
        setParticipaciones(participacionesTemp);
      } catch (error) {
        console.error("Error al obtener campeonatos:", error);
      }
    };
  
    fetchParticipaciones();
  }, [equipo]);

  const handleDeleteJugador = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/jugador/delete_jugador_equipo/${selectedJugadorId}`);
      toast.success("Jugador eliminado correctamente");
      setJugadores(jugadores.filter(j => j.id !== selectedJugadorId));
      fetchEquipoAndJugadores();
    } catch (error) {
      toast.error("Error al eliminar el jugador");
      console.error("Error al eliminar el jugador:", error);
    } finally {
      setShowConfirmModal(false);
      setSelectedJugadorId(null);
    }
  };  
  
  const confirmDeleteJugador = (jugadorId) => {
    setSelectedJugadorId(jugadorId);
    setShowConfirmModal(true);
  };

  const toggleEliminar = () => {
    setMostrarEliminar(!mostrarEliminar);
  };  
  
  const obtenerGeneroTexto = (genero) => {
    if (genero === 'V') return 'Varones';
    if (genero === 'D') return 'Damas';
    if (genero === 'M') return 'Mixto';
    return 'Desconocido';
  };

  const obtenerDivisionTexto = (division) => {
    if (division === 'MY') return 'Mayores';
    if (division === 'MN') return 'Menores';
    return 'Desconocido';
  };

  const handleVolver = () => {
    navigate(-1); 
  };

  if (!equipo) {
    return <div>Cargando...</div>;
  }
  
  const getImagenPerfil = (jugador) => {
    if (jugador.imagen_persona) {
      return jugador.imagen_persona; 
    }
    return jugador.genero === 'V' ? defaultUserMenIcon : defaultUserWomenIcon; 
  };

  const handleProfileClick = (jugadorId) => {
    setSelectedPersonaId(jugadorId);  
    setShowPerfilModal(true);
  };

  const handleClosePerfilModal = () => {
    setShowPerfilModal(false);
    setSelectedPersonaId(null);  
  };

  const formatDate = (fecha) => {
    const partidoDate = new Date(fecha);
    return partidoDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
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

  const getEstadoPartidoIcono = (fecha, estado) => {
    const ahora = new Date();
    const fechaPartido = new Date(fecha);
  
    if (fechaPartido < ahora && estado === estadosPartidoCampMapping.Confirmado) {
      return { icono: <ErrorIcon />, clase: 'alerta', tooltip: 'Partido vencido, resultados no registrados' };
    }
    if (fechaPartido >= ahora && estado === estadosPartidoCampMapping.Confirmado) {
      return { icono: <PendingIcon />, clase: 'pendiente', tooltip: 'Partido confirmado, en espera' };
    }
    if (estado === estadosPartidoCampMapping.Finalizado) {
      return { icono: <CheckCircleIcon />, clase: 'finalizado', tooltip: 'Partido finalizado' };
    }
    return null;
  };

  const getMedalIcon = (posicion) => {
    if (posicion === 1) {
      return "🏆"; 
    } else if (posicion === 2) {
      return "🥈"; 
    } else if (posicion === 3) {
      return "🥉"; 
    }
    return null; 
  };
  
  const formatPosition = (posicion) => {
    if (posicion === 1) return "1er lugar";
    if (posicion === 2) return "2do lugar";
    if (posicion === 3) return "3er lugar";
    return `${posicion}° lugar`; 
  };  

  const hasRole = (...roles) => {
    return user && user.rol && roles.includes(user.rol.nombre);
  }; 
  
  return (
    <div className="equipoPerfil-container">
    {/* Botón de Volver */}
    <button className="equipoPerfil-volverButton" onClick={() => window.history.back()}>
      <ArrowBackIcon/>
    </button>

    <PerfilJugadorModal
        isOpen={showPerfilModal}
        onClose={handleClosePerfilModal}
        jugadorId={selectedPersonaId}  
      />

    {/* Encabezado */}
    <div className="equipoPerfil-header">
      <div className="equipoPerfil-logoContainer">
        <img
          src={
            equipo.club_imagen && equipo.club_imagen.length > 0
              ? equipo.club_imagen
              : "default-image-url.png"
          }
          alt={`${equipo.nombre} logo`}
          className="equipoPerfil-logo"
        />
      </div>
      <h2 className="equipoPerfil-nombre">{equipo.nombre}</h2>
    </div>

    {/* Botones de navegación */}
    <div className="equipoPerfil-tabs">
      <button
        className={`equipoPerfil-tabButton ${
          activeTab === "informacion" ? "active" : ""
        }`}
        onClick={() => handleTabChange("informacion")}
      >
        Información
      </button>
      <button
        className={`equipoPerfil-tabButton ${
          activeTab === "jugadores" ? "active" : ""
        }`}
        onClick={() => handleTabChange("jugadores")}
      >
        Jugadores
      </button>
      <button
        className={`equipoPerfil-tabButton ${
          activeTab === "partidos" ? "active" : ""
        }`}
        onClick={() => handleTabChange("partidos")}
      >
        Partidos
      </button>
    </div>

    <div className="equipoPerfil-content">
      <div className={`equipoPerfil-panel ${activeTab === "informacion" ? "active" : ""}`}>
        <div className="equipoPerfil-detalles">
          <p>
            <strong>Club:</strong> {equipo.nombre}
          </p>
          <p>
            <strong>Categoría:</strong> {equipo.categoria_nombre}
          </p>
          <p>
            <strong>Género:</strong> {obtenerGeneroTexto(equipo.genero)}
          </p>
          <p>
            <strong>División:</strong> {obtenerDivisionTexto(equipo.division)}
          </p>
          <div className="equipoPerfil-participaciones">
            <h3>Participaciones</h3>
            <div className="equipoPerfil-participacionesGrid">
              {participaciones.length > 0 ? (
                participaciones.map((participacion, index) => (
                  <div key={index} className="equipoPerfil-participacionCard">
                    <h4>
                      {participacion.nombre}
                      {participacion.estado_campeonato !== estadosMapping.campeonatoFinalizado && <span className="equipoPerfil-campeonatoEnCurso"></span>}
                    </h4>
                    {getMedalIcon(participacion.posicion) && (
                      <span className="equipoPerfil-medalla">{getMedalIcon(participacion.posicion)}</span>
                    )}
                    <p>
                    {participacion.estado_campeonato !== estadosMapping.campeonatoFinalizado ? "Posición actual" : "Posición"}:
                    <strong> {formatPosition(participacion.posicion)} </strong>
                  </p>
                  </div>
                ))
              ) : (
                <p>Este equipo no ha participado en ningún campeonato.</p>
              )}
            </div>
          </div>
        </div>
    </div>
  {/* Jugadores */}
  <div className={`equipoPerfil-panel ${activeTab === "jugadores" ? "active" : ""}`}>
    <div className="equipoPerfil-jugadoresWrapper">
      {/* Botón Registrar Jugador */}
      {hasRole(rolMapping.PresidenteAsociacion, rolMapping.PresidenteClub, rolMapping.DelegadoClub) && (
      <div className="equipoPerfil-botones">
      <button
        className="equipoPerfil-registrarButton"
        onClick={() => {
          if (equipo && equipo.club_id && equipo.categoria_id) {
           
            navigate(`/jugadores/indice-equipo`, {
              state: {
                clubId: equipo.club_id,
                categoriaId: equipo.categoria_id,
                equipoId: id
              }
            });
          } else {
            toast.error("No se pudo navegar, faltan datos");
          }
        }}
      >
        +1 Jugador
      </button>
    
      {/* Botón de eliminar jugadores */}
      <button className="equipoPerfil-eliminarButton" onClick={toggleEliminar}>
        {mostrarEliminar ? "Cancelar" : "Eliminar Jugadores"}
      </button>
    </div>
    
      )}

      {/* Cards de jugadores */}
      <div className="equipoPerfil-jugadoresCards">
        {jugadores.map((jugador) => (
          <div key={jugador.jugador_id} className="equipoPerfil-jugadorCard" onClick={() => handleProfileClick(jugador.persona_id)}>
            <img
              src={getImagenPerfil(jugador)}
              alt={`${jugador.nombre_persona} ${jugador.apellido_persona}`}
              className="equipoPerfil-jugadorImagen"
            />
            <div className="equipoPerfil-jugadorInfo">
              <p>
                {jugador.nombre_persona} {jugador.apellido_persona}
              </p>
              <span>Edad: {jugador.edad_jugador} años</span>
            </div>
            
            {mostrarEliminar && <div className="equipoPerfil-jugadorEliminar" onClick={() => confirmDeleteJugador(jugador.jugador_id)}><RemoveCircleOutlineIcon/></div>}
          </div>
        ))}
      </div>

      <ConfirmModal
        visible={showConfirmModal}
        onConfirm={handleDeleteJugador}
        onCancel={() => setShowConfirmModal(false)}
        message="¿Estás seguro de que deseas eliminar a este jugador del equipo?"
      />
    </div>
  </div>

  <div className={`equipoPerfil-panel ${activeTab === "partidos" ? "active" : ""}`}>
      <div className="equipoPerfil-partidosWrapper">
      <div className="equipoPerfil-selectCampeonato">
          <label>Selecciona un campeonato:</label>
          {campeonatos.length > 0 ? (
            <Select
              value={selectedCampeonato || campeonatos[0].id}
              onChange={(value) => setSelectedCampeonato(value)}
              style={{ width: '100%', marginBottom: '15px' }}
            >
              {campeonatos.map((campeonato) => (
                <Select.Option key={campeonato.id} value={campeonato.id}>
                  {campeonato.nombre}
                </Select.Option>
              ))}
            </Select>
          ) : (
            <p>Cargando campeonatos...</p>
          )}
        </div>


        {partidos.length === 0 ? (
          <p className="equipoPerfil-noPartidos">No hay partidos registrados para este equipo en este campeonato.</p>
        ) : (
          <div className="equipoPerfil-partidosGrid">
            {partidos.map((partido) => {
              const estadoPartido = getEstadoPartidoIcono(partido.fecha, partido.estado);
              return (
                <div 
                  key={partido.id} 
                  className="equipoPerfil-partidoCard"
                  onClick={() => navigate(`/partidos/partidoDetalle/${partido.partido_id}`, {
                    state: { campeonatoId : partido.campeonato_id , categoriaId:partido.categoria_id },
                  })
                }
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  {estadoPartido && (
                    <div 
                      className={`partido-estado-icon ${estadoPartido.clase}`} 
                      title={estadoPartido.tooltip}
                    >
                      {estadoPartido.icono}
                    </div>
                  )}

                  <div className="equipoPerfil-partidoEquipos">
                    <div className="equipoPerfil-partidoEquipo">
                      <img src={partido.equipo_local_imagen} alt={partido.equipo_local_nombre} className="equipoPerfil-partidoLogo" />
                      <p className="equipoPerfil-partidoNombre">{partido.equipo_local_nombre}</p>
                    </div>
                    <div className="equipoPerfil-partidoVS">VS</div>
                    <div className="equipoPerfil-partidoEquipo">
                      <img src={partido.equipo_visitante_imagen} alt={partido.equipo_visitante_nombre} className="equipoPerfil-partidoLogo" />
                      <p className="equipoPerfil-partidoNombre">{partido.equipo_visitante_nombre}</p>
                    </div>
                  </div>

                  <div className="equipoPerfil-partidoInfo">
                    <p className="equipoPerfil-partidoFecha">{formatDate(partido.fecha)}</p>
                    <p className="equipoPerfil-partidoHora">Hora: {formatTime(partido.fecha)}</p>
                    <p className="equipoPerfil-partidoLugar">Lugar: {partido.lugar_nombre}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
</div>
  </div>
  );
};
export default PerfilEquipo;
