import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate} from 'react-router-dom';
import '../../assets/css/Clubes/ClubesPerfil.css';
 
const PerfilClub = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchClubAndTeams = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/club/get_club_teams/${id}`);
        if (response.data.length > 0) {
          const clubInfo = {
            club_id: response.data[0].club_id,
            nombre: response.data[0].club_nombre,
            descripcion: response.data[0].club_descripcion,
            club_imagen: response.data[0].club_imagen,
            presidente_asignado: response.data[0].presidente_asignado,
            presidente_nombre: response.data[0].presidente_nombre,
          };
          setClub(clubInfo);
          const teamsInfo = response.data.map(item => ({
            equipo_id: item.equipo_id,
            equipo_nombre: item.equipo_nombre,
            categoria_nombre: item.categoria_nombre,
          }));
 
          setTeams(teamsInfo);
        }
      } catch (error) {
        console.error('Error al obtener el club y equipos:', error);
      }
    };
 
    fetchClubAndTeams();
  }, [id]);
 
  const handleAssignPresident = () => {
    navigate(`/presidente_club/registrar/${club.club_id}`);
 
    console.log("Asignar Presidente");
  };
  const handleListJugador = () => {
    navigate(`/jugadores/indice/${club.club_id}`);
    console.log("Lista de jugadores");
  };
 
  if (!club) {
    return <div>Cargando...</div>;
  }
 
  return (
    <div className="perfil-club">
      <div className="perfil-header">
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
 
        {club.presidente_asignado === 'N' ? (
          <button className="assign-president-button" onClick={handleAssignPresident}>
            Asignar Presidente
          </button>
        ) : (
          <p className="president-info">Presidente: {club.presidente_nombre}</p>
        )}
      </div>
 
      <div className="perfil-teams">
        {teams.length > 0 ? (
          teams.map((team) => (
            <div key={team.equipo_id} className="team-card">
              <h3>{team.equipo_nombre}</h3>
              <p>Categoría: {team.categoria_nombre}</p>
            </div>
          ))
        ) : (
          <p>No hay equipos disponibles para este club.</p>
        )}
      </div>
     
      <div className="assign-jugador-container">
        <button className="assign-jugador-button" onClick={handleListJugador}>
          Mis Jugadores
        </button>
      </div>
    </div>
  );  
};
 
export default PerfilClub;
 