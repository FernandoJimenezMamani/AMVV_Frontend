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
import Club_defecto from '../../assets/img/Club_defecto.png';
const { Option } = Select;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MisSolicitudesJugador = () => {
  const [clubes, setClubes] = useState([]);
  const [jugador, setJugador] = useState([]);
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
    fetchJugador();
  }, [selectedCampeonato]);

  useEffect(() => {
    if (jugador) {
        fetchClubes();
    }
  }, [jugador]); 

   useEffect(() => {
      applyFilters();
    }, [ filterState, searchName, clubes]);

    const fetchJugador = async () => {
      if(!selectedCampeonato) return;
        try {
          const user = JSON.parse(sessionStorage.getItem('user')); 
          const userId = user?.id;
          const response = await axios.get(`${API_BASE_URL}/jugador/get_jugadorById/${userId}`); 
          console.log('Jugador:', response.data);
          setJugador(response.data);
        } catch (error) {
          toast.error('Error al obtener los jugadores');
          console.error('Error al obtener los jugadores:', error);
        }
      };
    

      const fetchClubes = async () => {
        try {
            if(!jugador || !jugador.jugador_id) return;
                const requestBody = {
                    jugador_id: jugador.id,
                    campeonatoId : selectedCampeonato
                };
          const response = await axios.post(`${API_BASE_URL}/club/clubes_pending_confirm`, requestBody ,{
            headers: {
                'Content-Type': 'application/json'
            }
          });
          console.log('Clubes:', response.data);
          setClubes(response.data);
        } catch (error) {
          toast.error('error')
          console.error('Error al obtener los clubes:', error);
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
    let filtered = [...clubes];
  
    filtered = filtered.map((club) => {
      if (club.estado_club_receptor === estadoTraspasoMapping.RECHAZADO || club.estado_club_origen === estadoTraspasoMapping.RECHAZADO) {
        return { ...club, estado_solicitud: "Rechazado" };
      } 
      else if (
        (club.estado_club_receptor === estadoTraspasoMapping.PENDIENTE && club.estado_club_origen === estadoTraspasoMapping.PENDIENTE) || 
        (club.estado_club_receptor === estadoTraspasoMapping.PENDIENTE && club.estado_club_origen === estadoTraspasoMapping.APROBADO) ||
        (club.estado_club_receptor === estadoTraspasoMapping.APROBADO && club.estado_club_origen === estadoTraspasoMapping.PENDIENTE) ||
        (club.estado_club_receptor === estadoTraspasoMapping.APROBADO && club.estado_club_origen === estadoTraspasoMapping.APROBADO  && club.estado_deuda === estadoTraspasoMapping.PENDIENTE) 
      ) {
        return { ...club, estado_solicitud: "Pendiente" };
      } 
      else if (
        club.estado_club_receptor === estadoTraspasoMapping.APROBADO &&
        club.estado_club_origen === estadoTraspasoMapping.APROBADO &&
        club.estado_jugador === estadoTraspasoMapping.APROBADO &&
        club.estado_deuda === estadoTraspasoMapping.FINALIZADO
      ) {
        return { ...club, estado_solicitud: "Realizado" };
      } 
      else {
        return { ...club, estado_solicitud: "En proceso" };
      }
    });

      filtered = filtered.filter((club) => club.estado_solicitud === filterState);
    
  
    // Filtrar por nombre
    if (searchName) {
      filtered = filtered.filter((club) =>
        `${club.nombre_club}`
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }
    
    setFilteredPersonas(filtered);
  };  

  const handleDetailsClick = (jugadorId) => {
    navigate(`/traspasos/detalleSolicitante/${jugadorId}`);
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
      fetchClubes();
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

  const getImagenClub = (club) => {
    if (club.imagen_club) {
      return club.imagen_club; 
    }
    return Club_defecto;
  };

  const formatFechaLarga = (fechaString) => {
    if (!fechaString) return '';
    const [year, month, day] = fechaString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)); // mes empieza en 0
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  
  return (
    <div className="table-container">
      <h2 className="table-title">Mis Solicitudes</h2>
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
            <th className="table-th-p">Club Solicitado</th>
            <th className="table-th-p">Fecha de Solicitud</th>
            <th className="table-th-p">Respuesta del presidente actual</th>
            <th className="table-th-p">Respuesta Club receptor</th>
            <th className="table-th-p">Pago</th>
            <th className="table-th-p">Acción</th>
          </tr>
        </thead>
        <tbody>
          {console.log("💡 Clubes antes del filtro:", clubes)          }
          {filteredPersonas.map((club) => (
            <tr key={club.club_id} className="table-row">
              <td className="table-td-p">
                <img
                  src={getImagenClub(club)}
                  alt={`${club.nombre_club}`}
                  className="table-logo"
                />
              </td>
              <td className="table-td-p">
                {club.nombre_club}
              </td>
            
              <td className="table-td-p">
                {formatFechaLarga(club.fecha_solicitud)}
              </td>
              <td className="table-td-p">
                    {getStatusIcon(club.estado_club_origen)}
                </td>
                <td className="table-td-p">
                    {getStatusIcon(club.estado_club_receptor)}
                </td>
                <td className="table-td-p">
                    {getStatusIcon(club.estado_deuda)}
                </td>

              <td className="table-td-p">
              <button
                  className={`table-button button-view `}
                  onClick={() => handleDetailsClick(club.traspaso_id)}
                >
                  <RemoveRedEyeIcon />
                </button>
                {club.estado_deuda !== 'FINALIZADO' && (
                  <button className="table-button button-delete" onClick={() => handleDeleteClick(club.traspaso_id)}><DeleteForeverIcon/></button>
                )}
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        visible={showConfirmDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="¿Seguro que quieres eliminar este club?"
      />
    </div>

  );
};

export default MisSolicitudesJugador;
