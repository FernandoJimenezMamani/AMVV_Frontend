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
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';
import { Select } from 'antd'; // Importar Select de Ant Design
import Club_defecto from '../../assets/img/Club_defecto.png';
import PerfilPresidenteModal from '../PresidenteClub/Perfil';
import EditIcon from '@mui/icons-material/Edit';
import EditarEquipoModal from '../Equipos/Editar'; 
import { useCampeonato } from '../../context/CampeonatoContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PerfilClub = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [teams, setTeams] = useState([]);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useSession();
  const [selectedGenero, setSelectedGenero] = useState(null);
  const [showPerfilModal , setShowPerfilModal] = useState(false)
  const [selectedPresidenteId, setSelectedPresidenteId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [delegadosClub, setDelegadosClub] = useState([]);
  const { campeonatoEnCurso, campeonatoEnTransaccion } = useCampeonato();
  useEffect(() => {
    fetchClubAndTeams();
  }, [id]);

  useEffect(() => {
    if (club?.club_id) {
      fetchDelegados();
    }
  }, [club]);
  

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
          presidente_genero: response.data[0].presidente_genero,
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

  const fetchDelegados = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/club/delegados/${club.club_id}`);
      setDelegadosClub(response.data); // Se espera que sea un array de IDs
    } catch (err) {
      console.error("Error al obtener delegados:", err);
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

  const getImagenPerfil = (presidente) => {
    if (presidente.presidente_imagen) {
      return presidente.presidente_imagen; 
    }
    return presidente.presidente_genero === 'V' ? defaultUserMenIcon : defaultUserWomenIcon; 
  };

  const getImagenClub = (club) => {
    if (club.club_imagen) {
      return club.club_imagen; 
    }
    return Club_defecto;
  };

  const handleClosePerfilModal = () => {
    setShowPerfilModal(false);
    setSelectedPresidenteId(null);  
  };

  const handleProfileClick = (jugadorId) => {
    setSelectedPresidenteId(jugadorId);  
    setShowPerfilModal(true);
  };

  const handleEditTeam = (equipoId) => {
    setEquipoSeleccionado(equipoId);
    setShowEditModal(true);
  };
  
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEquipoSeleccionado(null);
    fetchClubAndTeams(); // Refresca la lista al cerrar
  };  

  return (
    <div className="perfil-club">
      <div className="perfil-header-club">
        <div className="club-logo-container">
          <img
            src={getImagenClub(club)}
            alt={`${club.nombre} logo`}
            className="club-logo-perfil"
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

      {showEditModal && equipoSeleccionado && (
        <EditarEquipoModal
          equipoId={equipoSeleccionado}
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          onEquipoUpdated={fetchClubAndTeams} // Refresca la lista al cerrar
        />
      )}

      <PerfilPresidenteModal
              isOpen={showPerfilModal}
              onClose={handleClosePerfilModal}
              presidenteId={club.presidente_id}  
      />
      <div className="assign-actions-container">
      {!user ? (
        <button className="assign-jugador-button" onClick={handleListJugadorUsuario}>
          <PeopleIcon /> Jugadores
        </button>
      ) : null}


      {(hasRole(rolMapping.PresidenteClub, rolMapping.DelegadoClub,rolMapping.PresidenteAsociacion)  &&
        <>
          <button className="assign-jugador-button" onClick={handleListJugador}>
            <PeopleIcon /> Mis Jugadores
          </button>
          {campeonatoEnTransaccion && (
            <button className="create-team-button" onClick={handleCreateTeam}>
              <SportsVolleyballIcon /> Crear Equipo
            </button>
          )}  
        </>
      ) }

      </div>
        {club.presidente_asignado === 'N' ? (
          hasRole(rolMapping.PresidenteAsociacion) && (
          <button className="assign-president-button" onClick={handleAssignPresident}>
           <AssignmentIndIcon/> Asignar Presidente
          </button>
          )
        ) : (
          <p className="president-info-container"  onClick={() => handleProfileClick(club.presidente_id)}>
            Presidente: {club.presidente_nombre}
            <img
              src={getImagenPerfil(club)} 
              alt={`${club.presidente_nombre} logo`}
               className="president-image"
            />
          </p>
                  )}
      </div>
      <div className="equipoFiltro-container">
        <Select
          value={selectedGenero || "Todos"} // Valor predeterminado "Todos"
          onChange={(value) => setSelectedGenero(value === "Todos" ? null : value)}
          style={{ width: 200, marginBottom: 15 }}
          className='equipoFiltro-select'
        >
          <Select.Option value="Todos">Todos</Select.Option>
          <Select.Option value="V">Varones</Select.Option>
          <Select.Option value="D">Damas</Select.Option>
        </Select>
      </div>
      <div className="perfil-teams">
        {teams.length > 0 ? (
          teams
          .filter(
            (team) =>
              team && team.equipo_id && team.equipo_nombre && 
              (!selectedGenero || team.categoria_genero === selectedGenero)
          )
          .map((team) => (
              <div
            key={team.equipo_id}
            className="team-card"
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <div onClick={() => handleTeamClick(team.equipo_id)}>
              <h3>{team.equipo_nombre}</h3>
              <p>Categoría: {team.categoria_nombre}</p>
              <p>
                Género: {team.categoria_genero === 'V' ? 'Varones' :
                team.categoria_genero === 'D' ? 'Damas' :
                team.categoria_genero === 'M' ? 'Mixto' : 'Desconocido'}
              </p>
            </div>
            {campeonatoEnTransaccion &&
              (
                (hasRole(rolMapping.PresidenteClub) && user.id === club.presidente_id) ||
                (hasRole(rolMapping.DelegadoClub) && delegadosClub.includes(user.id))
              ) && (
                <button className="edit-team-button" onClick={() => handleEditTeam(team.equipo_id)}>
                  <EditIcon />
                </button>
            )}

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