import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import { Select } from 'antd';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PendingIcon from '@mui/icons-material/Pending';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';
import estadoTraspasoMapping from '../../constants/estadoTraspasos';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const { Option } = Select;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MisSolicitudes = () => {
  const [jugadores, setJugadores] = useState([]);
  const [presidente, setPresidente] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [showConfirmTraspaso,setShowConfirmTraspaso] = useState(false);
  const [jugadorToFichar, setJugadorToFichar] = useState(null);
  const [filterState, setFilterState] = useState('Pendiente');
  const [searchName, setSearchName] = useState('');
  const [requestToDelete, setRequestToDelete] = useState(null);
  const navigate = useNavigate();
  const [campeonatos, setCampeonatos] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState(null);

  useEffect(() => {
    fetchPresidente();
  }, []);

  useEffect(() => {
    if (presidente && presidente.club_presidente && presidente.id_presidente) {
      fetchJugadores();
    }
  }, [presidente]); 

   useEffect(() => {
      applyFilters();
    }, [ filterState, searchName, jugadores]);

    const fetchPresidente = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user')); // Convierte el JSON a objeto
        const userId = user?.id;
        const response = await axios.get(`${API_BASE_URL}/presidente_club/get_presidenteById/${userId}`); // Cambiado para obtener todos los jugadores
        console.log("presidente recibidos:", response.data); 
      
        setPresidente(response.data);
      } catch (error) {
        toast.error('Error al obtener los PRESIDENTES');
        console.error('Error al obtener los PRESIDENTES:', error);
      }
    };

    const fetchJugadores = async () => {
      try {
        if( !presidente.id_presidente || !selectedCampeonato) return; 
          const requestBody = { 
              idTraspasoPresidente: presidente.id_presidente ,
              campeonatoId : selectedCampeonato
          };
          console.log(requestBody,'ids');
  
          const response = await axios.post(`${API_BASE_URL}/jugador/intercambioEstado`, requestBody, {
              headers: {
                  'Content-Type': 'application/json'
              }
          });
  
          console.log("Jugadores recibidos:", response.data); 
          setJugadores(response.data);
      } catch (error) {
          toast.error('Error al obtener los jugadores');
          console.error('Error al obtener los jugadores:', error);
      }
  };  

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/campeonatos/select`);
        setCampeonatos(response.data);
  
        const campeonatoActivo = response.data.find(camp => camp.estado !== 3);
        
        if (campeonatoActivo) {
          setSelectedCampeonato(campeonatoActivo.id);
        } else if (response.data.length > 0) {
          setSelectedCampeonato(response.data[0].id); 
        }
      } catch (error) {
        toast.error("Error al obtener los campeonatos");
        console.error("Error fetching campeonatos:", error);
      }
    };
  
    fetchCampeonatos();
  }, []);

  const applyFilters = () => {
    let filtered = [...jugadores];
  
    // Clasificación de solicitudes
    filtered = filtered.map((jugador) => {
      if (jugador.estado_jugador === estadoTraspasoMapping.RECHAZADO || jugador.estado_club_origen === estadoTraspasoMapping.RECHAZADO) {
        return { ...jugador, estado_solicitud: "Rechazado" };
      } 
      else if (
        (jugador.estado_jugador === estadoTraspasoMapping.PENDIENTE && jugador.estado_club_origen === estadoTraspasoMapping.PENDIENTE) || 
        (jugador.estado_jugador === estadoTraspasoMapping.PENDIENTE && jugador.estado_club_origen === estadoTraspasoMapping.APROBADO) ||
        (jugador.estado_jugador === estadoTraspasoMapping.APROBADO && jugador.estado_club_origen === estadoTraspasoMapping.PENDIENTE) ||
        (jugador.estado_jugador === estadoTraspasoMapping.APROBADO && jugador.estado_club_origen === estadoTraspasoMapping.APROBADO  && jugador.estado_deuda === estadoTraspasoMapping.PENDIENTE) 
      ) {
        return { ...jugador, estado_solicitud: "Pendiente" };
      } 
      else if (
        jugador.estado_jugador === estadoTraspasoMapping.APROBADO &&
        jugador.estado_club_origen === estadoTraspasoMapping.APROBADO &&
        jugador.estado_deuda === estadoTraspasoMapping.FINALIZADO
      ) {
        return { ...jugador, estado_solicitud: "Realizado" };
      } 
      else {
        return { ...jugador, estado_solicitud: "En proceso" };
      }
    });

      filtered = filtered.filter((jugador) => jugador.estado_solicitud === filterState);
    
  
    // Filtrar por nombre
    if (searchName) {
      filtered = filtered.filter((jugador) =>
        `${jugador.nombre_persona} ${jugador.apellido_persona}`
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }
  
    setFilteredPersonas(filtered);
  };  

  const handleDetailsClick = (jugadorId) => {
    navigate(`/traspasos/detalleSolicitante/${jugadorId}`);
  };

  const handleFicharClick = (jugadorId) => {
    setJugadorToFichar(jugadores.find(jugador => jugador.jugador_id === jugadorId));
    setShowConfirmTraspaso(true);
  };


  const handleConfirmFichar = async () => {
    if (!jugadorToFichar) return;
  
    try {

      await axios.post(`${API_BASE_URL}/traspaso/crear`, {
        jugador_id: jugadorToFichar.jugador_id,
        club_origen_id: jugadorToFichar.club_id, 
        club_destino_id: presidente.club_presidente, 
      });
  
      toast.success('Traspaso solicitado correctamente');
      setShowConfirmTraspaso(false);
      setJugadorToFichar(null);
    } catch (error) {
      toast.error('Error al solicitar el traspaso');
      console.error('Error al crear el traspaso:', error);
      setShowConfirmTraspaso(false);
      setJugadorToFichar(null);
    }
  };  

  const handleCancelFichar = () => {
    setShowConfirmTraspaso(false);
    setJugadorToFichar(null);
  };

  const handleDeleteClick = (traspasoId) => {
    setRequestToDelete(traspasoId);
    setShowConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setRequestToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.put(`${API_BASE_URL}/traspaso/eliminar/${requestToDelete}`);
      setShowConfirmDelete(false);
      setRequestToDelete(null);
      fetchJugadores();
    } catch (error) {
      toast.error('error')
      console.error('Error al eliminar el club:', error);
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return (
          <span style={{ alignItems: 'center', gap: '5px', color: 'black' }}>
            <PendingIcon  style={{color: 'orange'}}/> Pendiente
          </span>
        );
      case 'APROBADO':
        return (
          <span style={{alignItems: 'center', gap: '5px', color: 'black' }}>
            <CheckCircleIcon  style={{ color: 'green' }}  /> Aprobado
          </span>
        );
        case 'FINALIZADO':
                  return (
                    <span style={{alignItems: 'center', gap: '5px', color: 'black' }}>
                      <CheckCircleIcon  style={{ color: 'green' }}  /> Aprobado
                    </span>
                  );
      case 'RECHAZADO':
        return (
          <span style={{ alignItems: 'center', gap: '5px', color: 'black' }}>
            <DoDisturbIcon  style={{ color: 'red' }}/> Rechazado
          </span>
        );
      default:
        return null;
    }
  };

  const getImagenPerfil = (persona) => {
    if (persona.persona_imagen) {
      return persona.persona_imagen; 
    }
    return persona.persona_genero === 'V' ? defaultUserMenIcon : defaultUserWomenIcon; 
  };

  const formatFechaLarga = (fechaString) => {
    if (!fechaString) return '';
    const [year, month, day] = fechaString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)); // mes empieza en 0
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  

  return (
    <div className="table-container">
       <div className="titulo-con-boton">
        <button className="boton-volver" onClick={() => window.history.back()}>
          <ArrowBackIcon />
        </button>
        <h2 className="all-matches-titulo">Mis Solicitudes</h2>
       </div>
      
      <div className="table-filters">
      <Select
        className="filter-select"
        placeholder="Filtrar por estado"
        value={filterState}
        onChange={(value) => setFilterState(value)}
        style={{ width: 180, marginRight: 10 }}
      >
        <Option value="Rechazado">Rechazado</Option>
        <Option value="Pendiente">Pendiente</Option>
        <Option value="Realizado">Realizado</Option>
      </Select>

      <Select
            className="public-select"
            value={selectedCampeonato}
            onChange={(value) => setSelectedCampeonato(value)}
            style={{ width: '250px' }}
          >
            {campeonatos.map((camp) => (
              <Option key={camp.id} value={camp.id}>
              <EmojiEventsIcon/> {camp.nombre}
              </Option>
            ))}
          </Select>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="search-box"
          />
      </div>
      <table className="table-layout">
        <thead className="table-head">
          <tr>
            <th className="table-th-p">Foto</th>
            <th className="table-th-p">Nombre del Jugador</th>
            <th className="table-th-p">Fecha de Nacimiento</th>
            <th className="table-th-p">Club Actual</th>
            <th className="table-th-p">Fecha de Solicitud</th>
            <th className="table-th-p">Respuesta Jugador</th>
            <th className="table-th-p">Respuesta Club</th>
            <th className="table-th-p">Pago</th>
            <th className="table-th-p">Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredPersonas.map((jugador) => (
            <tr key={jugador.jugador_id} className="table-row">
              <td className="table-td-p">
                <img
                  src={getImagenPerfil(jugador)}
                  alt={`${jugador.nombre} ${jugador.apellido}`}
                  className="table-logo"
                />
              </td>
              <td className="table-td-p">
                {jugador.nombre_persona} {jugador.apellido_persona}
              </td>
              <td className="table-td-p">
                {formatFechaLarga(jugador.fecha_nacimiento_persona)}
              </td>
              <td className="table-td-p">
                {jugador.nombre_club }
              </td>
              <td className="table-td-p">
              {formatFechaLarga(jugador.fecha_solicitud)}
              </td>
              <td className="table-td-p">
                    {getStatusIcon(jugador.estado_jugador)}
                </td>
                <td className="table-td-p">
                    {getStatusIcon(jugador.estado_club_origen)}
                </td>
                <td className="table-td-p">
                    {getStatusIcon(jugador.estado_deuda)}
                </td>

              <td className="table-td-p">
              <button
                  className={`table-button button-view `}
                  onClick={() => handleDetailsClick(jugador.id_traspaso)}
                >
                  <RemoveRedEyeIcon />
                </button>
                {jugador.estado_deuda !== 'FINALIZADO' && (
                  <button className="table-button button-delete" onClick={() => handleDeleteClick(jugador.id_traspaso)}><DeleteForeverIcon/></button>
                )}     
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        visible={showConfirmTraspaso}
        onConfirm={handleConfirmFichar}
        onCancel={handleCancelFichar}
        message="¿Seguro que quieres fichar a este jugador?"
      />

      <ConfirmModal
        visible={showConfirmDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="¿Seguro que quieres eliminar este club?"
      />
    </div>

  );
};

export default MisSolicitudes;
