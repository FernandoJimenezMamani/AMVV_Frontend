import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/css/Clubes/ClubesPerfil.css';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PeopleIcon from '@mui/icons-material/People';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import RegistroEquipo from '../Equipos/Registrar';
import { set } from 'date-fns';
import { useSession } from '../../context/SessionContext';
import rolMapping from '../../constants/roles';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PerfilClub = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [teams, setTeams] = useState([]);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useSession();

  useEffect(() => {
    fetchClubAndTeams();
  }, [id]);

  const fetchClubAndTeams = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/club/get_club_teams/${id}`);
      if (response.data.length > 0) {
        const clubInfo = {
          club_id: response.data[0].club_id,
          nombre: response.data[0].club_nombre,
          descripcion: response.data[0].club_descripcion,
          club_imagen: response.data[0].club_imagen,
          presidente_id: response.data[0].presidente_id,
          presidente_asignado: response.data[0].presidente_asignado,
          presidente_nombre: response.data[0].presidente_nombre,
          presidente_imagen: response.data[0].persona_imagen,
        };
        setClub(clubInfo);
        const teamsInfo = response.data.map(item => ({
          equipo_id: item.equipo_id,
          equipo_nombre: item.equipo_nombre,
          categoria_genero : item.categoria_genero,
          categoria_nombre: item.categoria_nombre,
        }));

        setTeams(teamsInfo);
      }
    } catch (error) {
      toast.error('Error al obtener el club y equipos');
      console.error('Error al obtener el club y equipos:', error);
    }
  };

  const handleAssignPresident = () => {
    navigate(`/presidenteClub/indice`);
    console.log("Asignar Presidente");
  };

  const handleCloseModal = () => {
    setShowTeamsModal(false);
  };

  const handleListJugador = () => {
    navigate(`/jugadores/indice/${club.club_id}`);
    console.log("Lista de jugadores");
  };

  const handleListJugadorUsuario = () => {
    navigate(`/jugadores/indiceJugadoresUsuario/${club.club_id}`);
    console.log("Lista de jugadores");
  };

  const handleCreateTeam = () => {
   setShowTeamsModal(true);
    console.log("Crear equipo");
  };

  // Redirigir al perfil del equipo
  const handleTeamClick = (equipoId) => {
    navigate(`/equipos/perfil/${equipoId}`);
  };

  if (!club) {
    return <div>Cargando...</div>;
  }

  const hasRole = (...roles) => {
    return user && user.rol && roles.includes(user.rol.nombre);
  }; 

  const isPresidentAssigned = () => {
    return user && club && user.id === club.presidente_id;
  };
  

  return (
    <div className="perfil-club">
      <div className="perfil-header-club">
        <div className="club-logo-container">
          <img
            src={club.club_imagen}
            alt={`${club.nombre} logo`}
            className="club-logo"
          />
        </div>
        <div className="club-info">
          <h2>{club.nombre}</h2>
          <p>{club.descripcion}</p>
        </div>
        <RegistroEquipo
        isOpen={showTeamsModal}
        onClose={handleCloseModal}
        onTeamCreated={fetchClubAndTeams} 
        clubId = {club.club_id}
      />
      <div className="assign-actions-container">
      {!user || !user.roles || user.roles.length === 0 ? (
        <button className="assign-jugador-button" onClick={handleListJugadorUsuario}>
          <PeopleIcon/> Jugadores
        </button>
        ) : null}

      {hasRole(rolMapping.PresidenteAsociacion) || 
      (hasRole(rolMapping.PresidenteClub, rolMapping.DelegadoClub) && isPresidentAssigned()) ? (
        <>
          <button className="assign-jugador-button" onClick={handleListJugador}>
            <PeopleIcon /> Mis Jugadores
          </button>
          <button className="create-team-button" onClick={handleCreateTeam}>
            <SportsVolleyballIcon /> Crear Equipo
          </button>
        </>
      ) : null}

      </div>
        {club.presidente_asignado === 'N' ? (
          <button className="assign-president-button" onClick={handleAssignPresident}>
           <AssignmentIndIcon/> Asignar Presidente
          </button>
        ) : (
          <p className="president-info-container">
            Presidente: {club.presidente_nombre}
            <img
              src={club.presidente_imagen}
              alt={`${club.presidente_nombre} logo`}
               className="president-image"
            />
          </p>
                  )}
      </div>

      <div className="perfil-teams">
        {teams.length > 0 ? (
          teams.map((team) => (
            <div
              key={team.equipo_id}
              className="team-card"
              onClick={() => handleTeamClick(team.equipo_id)} // Redirigir al perfil del equipo
              style={{ cursor: 'pointer' }} // Añadir cursor de pointer para indicar que es clickeable
            >
              <h3>{team.equipo_nombre}</h3>
              <p>Categoría: {team.categoria_nombre}</p>
              <p>
            Género: {team.categoria_genero === 'V' ? 'Varones' :
           team.categoria_genero === 'D' ? 'Damas' :
           team.categoria_genero === 'M' ? 'Mixto' : 'Desconocido'}
            </p>
            </div>
          ))
        ) : (
          <p>No hay equipos disponibles para este club.</p>
        )}
      </div>

     
    </div>
  );
};

export default PerfilClub;