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

const { Option } = Select;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const MisSolicitudes = () => {
  const [jugadores, setJugadores] = useState([]);
  const [presidente, setPresidente] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [showConfirmTraspaso,setShowConfirmTraspaso] = useState(false);
  const [jugadorToFichar, setJugadorToFichar] = useState(null);
  const [filterState, setFilterState] = useState('No filtrar');
  const [searchName, setSearchName] = useState('');
  const [requestToDelete, setRequestToDelete] = useState(null);
  const navigate = useNavigate();

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
          const requestBody = {
              club_presidente: presidente.club_presidente, 
              idTraspasoPresidente: presidente.id_presidente 
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

  const applyFilters = () => {
    let filtered = [...jugadores];

    // Filtrar por estado
    if (filterState !== 'No filtrar') {
      filtered = filtered.filter((jugador) =>
        filterState === 'Activo' ? jugador.eliminado === 'N' : jugador.eliminado === 'S'
      );
    }

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
            <Option value="No filtrar">No filtrar</Option>
            <Option value="Activo">Activo</Option>
            <Option value="Inactivo">Inactivo</Option>
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
                  src={jugador.imagen_persona}
                  alt={`${jugador.nombre} ${jugador.apellido}`}
                  className="table-logo"
                />
              </td>
              <td className="table-td-p">
                {jugador.nombre_persona} {jugador.apellido_persona}
              </td>
              <td className="table-td-p">
                {new Date(jugador.fecha_nacimiento_persona).toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </td>
              <td className="table-td-p">
                {jugador.nombre_club }
              </td>
              <td className="table-td-p">
                {new Date(jugador.fecha_solicitud).toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                }) }
              </td>
              <td className="table-td-p">
                    {getStatusIcon(jugador.estado_jugador)}
                </td>
                <td className="table-td-p">
                    {getStatusIcon(jugador.estado_club)}
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
                <button className="table-button button-delete" onClick={() => handleDeleteClick(jugador.id_traspaso)}><DeleteForeverIcon/></button>
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
