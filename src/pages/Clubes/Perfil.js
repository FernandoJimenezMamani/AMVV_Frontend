import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../assets/css/Clubes/ClubesPerfil.css'; 

const PerfilClub = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [teams, setTeams] = useState([]);

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
            fecha_registro: response.data[0].club_fecha_registro,
            fecha_actualizacion: response.data[0].club_fecha_actualizacion,
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

  if (!club) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="perfil-club">
      <div className="perfil-header">
        <img src={club.club_imagen} alt={`${club.nombre} logo`} className="club-logo" />
        <div className="club-info">
          <h2>{club.nombre}</h2>
          <p>{club.descripcion}</p>
        </div>
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
    </div>

  );
};

export default PerfilClub;
