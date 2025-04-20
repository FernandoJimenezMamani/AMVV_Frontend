import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { useSession } from '../../context/SessionContext';
import rolMapping from '../../constants/roles';
import Club_defecto from '../../assets/img/Club_defecto.png';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaClubesTraspasos = () => {
  const [clubes, setClubes] = useState([]);
  const [jugador, setJugador] = useState([]);
  const [presidenteId , setPresidenteId] = useState([]);
  const [showConfirmTraspaso,setShowConfirmTraspaso] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); 
  const [selectedClubId, setSelectedClubId] = useState(null);
  const { user } = useSession();
  const [clubToFichar, setClubToFichar] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchJugador();
  }, []);

  useEffect(() => {
    fetchClubes();
  }, [jugador]);

  const fetchJugador = async () => {
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
        jugador_id: jugador.id
    };
      const response = await axios.post(`${API_BASE_URL}/club/clubes-disponibles-by-jugador`, requestBody ,{
        headers: {
            'Content-Type': 'application/json'
        }
      });
      console.log('Clubes:', response.data);
      setClubes(response.data.clubes);
    } catch (error) {
      toast.error('error')
      console.error('Error al obtener los clubes:', error);
    }
  };

  const handleFicharClick = (club) => {
    setClubToFichar(club.club_id);
    setPresidenteId(club.presidente_club_id);
    setShowConfirmTraspaso(true);
  };

  const handleCancelFichar = () => {
    setShowConfirmTraspaso(false);
    setClubToFichar(null);
  };

  const handleConfirmFichar = async () => {
    if (!clubToFichar || !presidenteId) return;
  
    try {
      await axios.post(`${API_BASE_URL}/traspaso/crearJugador`, {
        jugador_id: jugador.id,
        club_origen_id: jugador.club_jugador, 
        club_destino_id: clubToFichar,
        presidente_club_id_destino : presidenteId
      });
  
      toast.success('Traspaso solicitado correctamente');
      setShowConfirmTraspaso(false);
      setClubToFichar(null);
      fetchClubes();
    } catch (error) {
      toast.error('Error al solicitar el traspaso');
      console.error('Error al crear el traspaso:', error);
      setShowConfirmTraspaso(false);
      setClubToFichar(null);
    }
  };  

  const handleProfileClick = (clubId) => {
    navigate(`/clubes/perfil/${clubId}`);
  };

  const handleSolicitudesClick = () => {
    navigate(`/traspasos/misSolicitudesJugador`);
  };

  const hasRole = (...roles) => {
    return user && user.rol && roles.includes(user.rol.nombre);
  }; 

  const getImagenClub = (club) => {
    if (club.imagen_club) {
      return club.imagen_club; 
    }
    return Club_defecto;
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Lista de Clubes</h2>
      <button className="table-add-button"  onClick={handleSolicitudesClick}>Mis solicitudes</button>
      <table className="table-layout">
        <thead className="table-head">
          <tr>
            <th className="table-th">Logo</th>
            <th className="table-th">Nombre</th>
            <th className="table-th">Descripcion</th>
            <th className="table-th">Acción</th>
          </tr>
        </thead>
        <tbody  >
          {clubes.map((club) => (
            <tr key={club.club_id} className="table-row">

              <td className="table-td">
                <img src={getImagenClub(club)} alt={`${club.nombre_club} logo`} className="table-logo" />
              </td>
              <td className="table-td table-td-name">{club.nombre_club}</td>
              <td className="table-td table-td-description">{club.descripcion_club}</td>
              <td className="table-td">
                <button className="table-button button-view" onClick={() => handleProfileClick(club.club_id)}><RemoveRedEyeIcon/></button>
                <button className="table-button button-edit" onClick={() => handleFicharClick(club)}><AssignmentIndIcon/> Solicitar cambio</button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        visible={showConfirmTraspaso}
        onConfirm={handleConfirmFichar}
        onCancel={handleCancelFichar}
        message="¿Seguro que quieres solicitar el cambio a este club?"
      />
    </div>

  );
};

export default ListaClubesTraspasos;
