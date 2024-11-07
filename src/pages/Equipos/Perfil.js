import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../assets/css/Equipos/EquiposPerfil.css';

const PerfilEquipo = () => {
  const { id } = useParams();
  const [equipo, setEquipo] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipoAndJugadores = async () => {
      try {
        const equipoResponse = await axios.get(`http://localhost:5002/api/equipo/get_equipo/${id}`);
        setEquipo(equipoResponse.data);

        // Obtener jugadores del equipo
        const jugadoresResponse = await axios.get(`http://localhost:5002/api/jugador/get_jugadores_equipo/${id}`);
        setJugadores(jugadoresResponse.data);
      } catch (error) {
        toast.error('Error al obtener el equipo y jugadores');
        console.error('Error al obtener el equipo y jugadores:', error);
      }
    };

    fetchEquipoAndJugadores();
  }, [id]);

  // Función para convertir el valor del género a texto legible
  const obtenerGeneroTexto = (genero) => {
    if (genero === 'V') return 'Varones';
    if (genero === 'D') return 'Damas';
    if (genero === 'M') return 'Mixto';
    return 'Desconocido';
  };

  // Función para manejar el botón de volver
  const handleVolver = () => {
    navigate(-1); // Navega hacia atrás en el historial
  };

  if (!equipo) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="perfil-equipo">
      <div className="perfil-header">
        {/* Mostrar la imagen del club si está disponible */}
        <img
          src={equipo.club.imagenClub && equipo.club.imagenClub.length > 0 ? equipo.club.imagenClub[0].club_imagen : 'default-image-url.png'} // Aquí va una imagen predeterminada si no existe
          alt={`${equipo.nombre} logo`}
          className="equipo-logo"
        />
        <div className="equipo-info">
          <h2>{equipo.nombre}</h2>
          <p>Categoría: {equipo.categoria.nombre} ({obtenerGeneroTexto(equipo.categoria.genero)})</p>
          <p>Club: {equipo.club.nombre}</p>
        </div>
      </div>

      <div className="jugadores-list">
        <h3>Jugadores</h3>
        {jugadores.length > 0 ? (
          jugadores.map((jugador) => (
            <div key={jugador.id} className="jugador-card">
              <img
                src={jugador.persona_imagen || 'default-image-url.png'} // Aquí va una imagen predeterminada si no existe
                alt={`${jugador.nombre} ${jugador.apellido}`}
                className="jugador-imagen"
              />
              <div className="jugador-info">
                <p>{jugador.nombre} {jugador.apellido}</p>
                <span>CI: {jugador.ci}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No hay jugadores en este equipo.</p>
        )}
      </div>

      <div className="buttons-container">
        <button className="volver-button" onClick={handleVolver}>
          Volver
        </button>
        {/* Botón para registrar un jugador */}
        <button className="registrar-button" onClick={() => navigate(`/equipos/registrar_jugador_equipo/${id}`)}>
          Registrar Jugador
        </button>
      </div>
    </div>
  );
};

export default PerfilEquipo;
