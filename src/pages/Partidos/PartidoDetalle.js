import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../assets/css/PartidoDetalle.css";
import { toast } from "react-toastify";
import MapView from "../../components/MapView";
import ReactModal from "react-modal";
import defaultUserIcon from "../../assets/img/user-icon.png";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import defaultUserMenIcon from "../../assets/img/Default_Imagen_Men.webp";
import defaultUserWomenIcon from "../../assets/img/Default_Imagen_Women.webp";
import MapaDetalle from "../../components/MapaDetalle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ConfirmModal from "../../components/ConfirmModal";
import ReprogramacionModal from "../../components/ReprogramacionModal";
import estadosPartidoCampMapping from "../../constants/estadoPartido";
import rolMapping from "../../constants/roles";
import { useSession } from "../../context/SessionContext";
import PerfilArbitroModal from "../Arbitros/Perfil";
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import estadosMapping from "../../constants/campeonatoEstados";
import Club_defecto from '../../assets/img/Club_defecto.png';
import { useCampeonato   } from '../../context/CampeonatoContext';
import ModalPlanilla from "./ModalPlanilla";
import PermMediaIcon from '@mui/icons-material/PermMedia';
import estadosCampeonatoMapping from "../../constants/campeonatoEstados";
ReactModal.setAppElement("#root");
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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [simulacionReprogramacion, setSimulacionReprogramacion] =
    useState(null);
  const [isReprogramacionModalOpen, setIsReprogramacionModalOpen] =
    useState(false);
  const [resultadoPartido, setResultadoPartido] = useState(null);
  const [ganadorPartido, setGanadorPartido] = useState(null);
  const { user } = useSession();
  const [showPerfilModal, setShowPerfilModal] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const[campeonato , setCampeonato] = useState(null);
  const { campeonatoEnCurso } = useCampeonato();
  const [showPlanilla, setShowPlanilla] = useState(false);
  const [planillaUrl, setPlanillaUrl] = useState("");
  useEffect(() => {
    
    const fetchArbitros = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/partidos/get_arbitros/${partidoId}`,
        );
        setArbitros(response.data);
      } catch (error) {
        toast.error("Error al obtener los árbitros del partido");
        console.error("Error al obtener los árbitros del partido:", error);
      }
    };

    fetchPartido();
    fetchArbitros();
    
  }, [partidoId]);

  const fetchPartido = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/partidos/get_partido_completo/${partidoId}`,
      );
      setPartido(response.data);
      setPlanillaUrl(response.data.partido_image);
    } catch (error) {
      toast.error("Error al obtener los detalles del partido");
      console.error("Error al obtener los detalles del partido:", error);
    }
  };

  const fetchResultados = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/partidos/resultados/${partidoId}`,
      );
      console.log("Resultados del partido:", response.data);
      setResultadoPartido(response.data);
    } catch (error) {
      toast.error("Error al obtener los resultados del partido");
      console.error("Error al obtener los resultados:", error);
    }
  };

  useEffect(() => {
    const fetchCampeonato = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/campeonatos/${campeonatoId}`);
        setCampeonato(response.data);
        console.log("Campeonato:", response.data);
      } catch (error) {
        toast.error("Error al obtener el campeonato");
        console.error("Error al obtener el campeonato:", error);
      }
    };
  
    fetchCampeonato(); 
  }, [campeonatoId]); 
  

  const fetchGanador = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/partidos/ganador/${partidoId}`,
      );
      setGanadorPartido(response.data);
    } catch (error) {
      toast.error("Error al obtener el ganador del partido");
      console.error("Error al obtener el ganador:", error);
    }
  };

  useEffect(() => {
    if (partido) {
      const fetchJugadoresLocal = async (equipoId) => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/partidos/get_jugadores/${equipoId}/campeonato/${campeonatoId}`,
          );
          setJugadoresLocal(response.data);
        } catch (error) {
          toast.error("Error al obtener los jugadores del equipo local");
          console.error(
            "Error al obtener los jugadores del equipo local:",
            error,
          );
        }
      };

      const fetchJugadoresVisitante = async (equipoId) => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/partidos/get_jugadores/${equipoId}/campeonato/${campeonatoId}`,
          );
          setJugadoresVisitante(response.data);
        } catch (error) {
          toast.error("Error al obtener los jugadores del equipo visitante");
          console.error(
            "Error al obtener los jugadores del equipo visitante:",
            error,
          );
        }
      };

      fetchJugadoresLocal(partido.equipo_local_id);
      fetchJugadoresVisitante(partido.equipo_visitante_id);
    }
  }, [partido]);

  useEffect(() => {
    if (
      partido &&
      (partido.estado === estadosPartidoCampMapping.Finalizado ||
        partido.estado === estadosPartidoCampMapping.Vivo)
    ) {
      fetchResultados();
    }
  }, [partido]);

  useEffect(() => {
    if (partido && (partido.estado === estadosPartidoCampMapping.Finalizado || partido.estado === estadosPartidoCampMapping.Vivo)) {
      fetchGanador();
    }
  }, [partido]);

  useEffect(() => {
    if (!partidoId) return;
  
    const websocketURL = `${process.env.REACT_APP_WEBSOCKET_URL}/partido/${partidoId}`;
    const ws = new WebSocket(websocketURL);
  
    ws.onopen = () => {
      console.log("✅ WebSocket abierto para actualizaciones de partido");
    };
  
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "actualizacion_resultado") {
          console.log("📡 WebSocket: actualizando resultado del partido...");
          fetchResultados(); 
          fetchGanador(); 
          fetchPartido();
        }
      } catch (error) {
        console.error("❌ Error procesando mensaje WebSocket:", error);
      }
    };
  
    ws.onerror = (error) => {
      console.error("⚠️ Error WebSocket:", error);
    };
  
    ws.onclose = () => {
      console.log("🔴 WebSocket cerrado para partido");
    };
  
    return () => {
      ws.close();
    };
  }, [partidoId]);  

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

    return partidoDate.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    });
  };

  const formatDate = (fecha) => {
    const partidoDate = new Date(fecha);

    return partidoDate.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getImagenPerfil = (arbitro) => {
    if (arbitro.persona_imagen) {
      return arbitro.persona_imagen;
    }
    return arbitro.arbitro_genero === "V"
      ? defaultUserMenIcon
      : defaultUserWomenIcon;
  };

  const handleReprogramarClick = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/partidos/reprogramar-partido/${partidoId}`,
      );
      setSimulacionReprogramacion(response.data);
      setIsReprogramacionModalOpen(true);
    } catch (error) {
      toast.error("Error al simular la reprogramación.");
      console.error("Error en la simulación de reprogramación:", error);
    }
  };
  const isPartidoDatePassed = () => {
    if (!partido?.fecha) return false;
    const partidoDate = new Date(partido.fecha);
    const now = new Date();
    return now > partidoDate;
  };
  const handleOpenConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const handleFinalizarReprogramacion = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/partidos/confirmar-reprogramacion`,
        {
          partidoId,
          nuevaFechaHora: simulacionReprogramacion.nuevaFechaHora,
          nuevoLugar: simulacionReprogramacion.nuevoLugar,
          arbitrosAsignados: simulacionReprogramacion.arbitrosAsignados,
        },
      );

      toast.success("Partido reprogramado exitosamente.");
      setIsConfirmModalOpen(false);
      setSimulacionReprogramacion(null);
      setPartido((prev) => ({
        ...prev,
        fecha: simulacionReprogramacion.nuevaFechaHora,
        lugar_nombre: simulacionReprogramacion.nuevoLugar.nombre,
      }));
    } catch (error) {
      toast.error("Error al confirmar la reprogramación.");
      console.error("Error en la confirmación de reprogramación:", error);
    }
  };

  const getTarjetasJugador = (jugadorId) => {
    if (!resultadoPartido || !resultadoPartido.tarjetas) return [];

    return resultadoPartido.tarjetas
      .filter((t) => t.jugador_tarjeta_id === jugadorId)
      .map((t) => t.tipo_tarjeta);
  };

  const handleTeamClick = (equipoId) => {
    navigate(`/equipos/perfil/${equipoId}`);
  };

  const handleEditarPartidoClick = (partidoId) => {
    console.log("Editando partido con ID:", partidoId);
    navigate(`/partidos/editar/${partidoId}`);
  };

  const hasRole = (...roles) => {
    return user && user.rol && roles.includes(user.rol.nombre);
  };

  const handleProfileClick = (jugadorId) => {
    setSelectedPersonaId(jugadorId);
    setShowPerfilModal(true);
  };

  const handleClosePerfilModal = () => {
    setShowPerfilModal(false);
    setSelectedPersonaId(null);
  };

  const esArbitroAsignado = () => {
    if (!user || user.rol.nombre !== rolMapping.Arbitro) return false;
  
    return arbitros.some((arbitro) => arbitro.arbitro_id === user.id);
  };  

  const getImagenClubLocal = (club) => {
      if (club.equipo_local_imagen) {
        return club.equipo_local_imagen; 
      }
      return Club_defecto;
    };
  
    const getImagenClubVisitante = (club) => {
      if (club.equipo_visitante_imagen) {
        return club.equipo_visitante_imagen; 
      }
      return Club_defecto;
    };

  return (
    <div className="partido-detalle-container">
      <div className="titulo-con-boton">
         <button className="boton-volver" onClick={() => window.history.back()}>
                    <ArrowBackIcon />
                  </button>
      <h1 className="all-matches-titulo">Detalles del Partido</h1>
      </div>
      
      <PerfilArbitroModal
        isOpen={showPerfilModal}
        onClose={handleClosePerfilModal}
        arbitroId={selectedPersonaId}
      />
      <div className="resultado-button-container">
      {campeonato && (
        (hasRole(rolMapping.PresidenteAsociacion) ||
          (esArbitroAsignado() && partido.estado !== estadosPartidoCampMapping.Finalizado)) &&
        (campeonato.estado === estadosCampeonatoMapping.campeoantoEnCurso || 
        campeonato.estado === estadosCampeonatoMapping.campeonatoFinalizado)
      ) && (
        <button
          className={`resultado-button ${!isPartidoDatePassed() ? 'disabled-button' : ''}`}
          onClick={isPartidoDatePassed() ? () => handlePartidoClick(partidoId) : null}
          disabled={!isPartidoDatePassed()}
          title={!isPartidoDatePassed() ? "El partido aún no ha comenzado" : ""}
        >
          {partido && partido.estado === estadosPartidoCampMapping.Finalizado ? (
            <span>Actualizar Resultado <AssignmentIcon /></span>
          ) : (
            <span>Registrar Resultado <AssignmentIcon /></span>
          )}
        </button>
      )}

       {hasRole(rolMapping.PresidenteAsociacion) &&
        partido.estado !== estadosPartidoCampMapping.Finalizado &&
        partido.estado !== estadosPartidoCampMapping.Vivo &&
        campeonato?.estado !== estadosMapping.campeonatoFinalizado && (
          <button
            className="reprogramar-button"
            onClick={() => handleReprogramarClick()}
          >
            Reprogramar Partido <CalendarMonthIcon />
          </button>
      )}

          {hasRole(rolMapping.PresidenteAsociacion) &&
          partido.estado !== estadosPartidoCampMapping.Finalizado && partido.estado !== estadosPartidoCampMapping.Vivo &&  
          campeonato?.estado !== estadosMapping.campeonatoFinalizado &&(
            <button
              className="reprogramar-button"
              onClick={() => handleEditarPartidoClick(partido.partido_id)}
            >
               <EditIcon />
            </button>
          )}

          {partido?.partido_image && (
            <button
              className="resultado-button"
              onClick={() => setShowPlanilla(true)}
            >
              <PermMediaIcon/>
            </button>
          )}

      </div>

      <div className="partido-info">
        <p>
          <strong>Fecha:</strong> {formatDate(partido.fecha)} ,{" "}
          {formatTime(partido.fecha)}
        </p>
        <p>
          <strong>Lugar del encuentro:</strong> {partido.lugar_nombre}
          <button
            className="map-button-inline"
            onClick={() => setIsMapModalOpen(true)}
          >
            <LocationOnIcon />
          </button>
        </p>
      </div>
      <div className="partido-detalle-bloque">
      <h2
    className={`titulo-estado ${partido.estado === estadosPartidoCampMapping.Finalizado ? "finalizado" : partido.estado === estadosPartidoCampMapping.Vivo ? "vivo" : "proximamente"}`}
      >
        {partido.estado === estadosPartidoCampMapping.Vivo ? (
          <span className="estado-vivo-partido">
            <span className="punto-vivo-Detalle"></span> En curso
          </span>
        ) : partido.estado === estadosPartidoCampMapping.Finalizado ? (
          "Finalizado"
        ) : (
          "Próximamente"
        )}
      </h2>

        <div className="partido-equipos">
          <div
            className="equipo-info equipo-local"
            onClick={() => handleTeamClick(partido.equipo_local_id)}
          >
            <img
              src={getImagenClubLocal(partido)}
              alt="Logo equipo local"
              className="equipo-logo"
            />
            <p className="equipo-nombre">{partido.equipo_local_nombre}</p>
          </div>

          <div className="resultado-container">
            <h2 className="vs-text">VS</h2>
          </div>

          <div
            className="equipo-info equipo-visitante"
            onClick={() => handleTeamClick(partido.equipo_visitante_id)}
          >
            <img
              src={getImagenClubVisitante(partido)}
              alt="Logo equipo visitante"
              className="equipo-logo"
            />
            <p className="equipo-nombre">{partido.equipo_visitante_nombre}</p>
          </div>
        </div>

        {(partido.estado === estadosPartidoCampMapping.Finalizado || partido.estado === estadosPartidoCampMapping.Vivo) &&
          ganadorPartido && (
            <div className="resultado-partido-bloque">
              {ganadorPartido?.walkover ? (
                <h3 className="resultado-ganador">
                  {ganadorPartido.walkover === "both"
                    ? "Walkover de ambos equipos"
                    : `${
                        ganadorPartido.walkover === "V"
                          ? partido.equipo_local_nombre
                          : partido.equipo_visitante_nombre
                      } ganador por Walkover`}
                </h3>
              ) : resultadoPartido?.resultadoLocal &&
                resultadoPartido?.resultadoVisitante ? (
                <>
                  <h3 className="resultado-ganador">
                    {partido.estado === estadosPartidoCampMapping.Finalizado
                      ? `Ganador ${ganadorPartido?.ganador}`
                      : "Resultado actual"}
                  </h3>

                  <p className="resultado-marcador">
                    {ganadorPartido?.marcador}
                  </p>
                  <div className="tabla-resultados">
                    <div className="columna-local">
                      <h4>{partido.equipo_local_nombre}</h4>
                      <p>
                        Set 1: {resultadoPartido.resultadoLocal?.set1 ?? "-"}
                      </p>
                      <p>
                        Set 2: {resultadoPartido.resultadoLocal?.set2 ?? "-"}
                      </p>
                      <p>
                        Set 3: {resultadoPartido.resultadoLocal?.set3 ?? "-"}
                      </p>
                    </div>
                    <div className="columna-visitante">
                      <h4>{partido.equipo_visitante_nombre}</h4>
                      <p>
                        Set 1:{" "}
                        {resultadoPartido.resultadoVisitante?.set1 ?? "-"}
                      </p>
                      <p>
                        Set 2:{" "}
                        {resultadoPartido.resultadoVisitante?.set2 ?? "-"}
                      </p>
                      <p>
                        Set 3:{" "}
                        {resultadoPartido.resultadoVisitante?.set3 ?? "-"}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <p>No hay datos de resultados disponibles.</p>
              )}
            </div>
          )}

        {/* 🔹 Bloque de Jugadores */}
        <div className="jugadores-seccion">
          <h4 className="jugadores-title-global">Jugadores</h4>
          <div className="jugadores-container">
            <ul className="jugadores-list equipo-local">
              {jugadoresLocal.length > 0 ? (
                jugadoresLocal.map((jugador) => {
                  const tarjetas = getTarjetasJugador(jugador.jugador_id);
                  return (
                    <li key={jugador.jugador_id}>
                      {jugador.jugador_nombre} {jugador.jugador_apellido}
                      {tarjetas.length > 0 && (
                        <span className="tarjetas-contenedor">
                          {tarjetas.includes("amarilla") && (
                            <span className="tarjeta tarjeta-amarilla">🟨</span>
                          )}
                          {tarjetas.includes("roja") && (
                            <span className="tarjeta tarjeta-roja">🟥</span>
                          )}
                        </span>
                      )}
                    </li>
                  );
                })
              ) : (
                <p>No hay jugadores registrados para este equipo.</p>
              )}
            </ul>

            <ul className="jugadores-list equipo-visitante">
              {jugadoresVisitante.length > 0 ? (
                jugadoresVisitante.map((jugador) => {
                  const tarjetas = getTarjetasJugador(jugador.jugador_id);
                  return (
                    <li key={jugador.jugador_id}>
                      {tarjetas.length > 0 && (
                        <span className="tarjetas-contenedor">
                          {tarjetas.includes("amarilla") && (
                            <span className="tarjeta tarjeta-amarilla">🟨</span>
                          )}
                          {tarjetas.includes("roja") && (
                            <span className="tarjeta tarjeta-roja">🟥</span>
                          )}
                        </span>
                      )}
                      {jugador.jugador_nombre} {jugador.jugador_apellido}
                    </li>
                  );
                })
              ) : (
                <p>No hay jugadores registrados para este equipo.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
      <h2 className="titulo-arbitros">Árbitros</h2>
      <ul className="arbitros-list">
        {arbitros.map((arbitro) => (
          <li
            key={arbitro.arbitro_id}
            className="arbitro-item"
            onClick={() => handleProfileClick(arbitro.arbitro_id)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={getImagenPerfil(arbitro)}
              alt="Foto del árbitro"
              className="arbitro-foto"
            />
            <span>
              {arbitro.arbitro_nombre} {arbitro.arbitro_apellido}
            </span>
          </li>
        ))}
      </ul>

      <MapaDetalle
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        lat={partido.lugar_latitud}
        lng={partido.lugar_longitud}
      />
      <ReprogramacionModal
        visible={isReprogramacionModalOpen}
        onClose={() => setIsReprogramacionModalOpen(false)}
        simulacion={simulacionReprogramacion}
        onConfirm={handleOpenConfirmModal}
      />

      <ConfirmModal
        visible={isConfirmModalOpen}
        onConfirm={handleFinalizarReprogramacion}
        onCancel={() => setIsConfirmModalOpen(false)}
        message={`¿Estás seguro de reprogramar el partido para el ${formatDate(simulacionReprogramacion?.nuevaFechaHora)} a las ${formatTime(simulacionReprogramacion?.nuevaFechaHora)} en ${simulacionReprogramacion?.nuevoLugar?.nombre}?`}
      />
      <ModalPlanilla
        isOpen={showPlanilla}
        onClose={() => setShowPlanilla(false)}
        imageUrl={planillaUrl}
      />

    </div>
  );
};

export default PartidoDetalle;
