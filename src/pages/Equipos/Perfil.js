import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../assets/css/Equipos/EquiposPerfil.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PerfilEquipo = () => {
  const { id } = useParams();

  const [equipo, setEquipo] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("informacion"); // Estado para manejar la pestaña activa

  const handleTabChange = (tab) => {
    setActiveTab(tab); // Cambia la pestaña activa
  };

  useEffect(() => {
    const fetchEquipoAndJugadores = async () => {
      try {
        const equipoResponse = await axios.get(`${API_BASE_URL}/equipo/get_equipo/${id}`);
        setEquipo(equipoResponse.data);
        console.log('Equipo:', equipoResponse.data);

        // Obtener jugadores del equipo
        const jugadoresResponse = await axios.get(`${API_BASE_URL}/jugador/get_jugadores_equipo/${id}`);
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

  const obtenerDivisionTexto = (division) => {
    if (division === 'MY') return 'Mayores';
    if (division === 'MN') return 'Menores';
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
    <div className="equipoPerfil-container">
    {/* Botón de Volver */}
    <button className="equipoPerfil-volverButton" onClick={() => window.history.back()}>
      <ArrowBackIcon/>
    </button>

    {/* Encabezado */}
    <div className="equipoPerfil-header">
      <div className="equipoPerfil-logoContainer">
        <img
          src={
            equipo.club.imagenClub && equipo.club.imagenClub.length > 0
              ? equipo.club.imagenClub[0].club_imagen
              : "default-image-url.png"
          }
          alt={`${equipo.nombre} logo`}
          className="equipoPerfil-logo"
        />
      </div>
      <h2 className="equipoPerfil-nombre">{equipo.nombre}</h2>
    </div>

    {/* Botones de navegación */}
    <div className="equipoPerfil-tabs">
      <button
        className={`equipoPerfil-tabButton ${
          activeTab === "informacion" ? "active" : ""
        }`}
        onClick={() => handleTabChange("informacion")}
      >
        Información
      </button>
      <button
        className={`equipoPerfil-tabButton ${
          activeTab === "jugadores" ? "active" : ""
        }`}
        onClick={() => handleTabChange("jugadores")}
      >
        Jugadores
      </button>
      <button
        className={`equipoPerfil-tabButton ${
          activeTab === "partidos" ? "active" : ""
        }`}
        onClick={() => handleTabChange("partidos")}
      >
        Partidos
      </button>
    </div>

    {/* Contenido de las pestañas con transición */}
    <div className="equipoPerfil-content">
  {/* Información */}
  <div className={`equipoPerfil-panel ${activeTab === "informacion" ? "active" : ""}`}>
  <div className="equipoPerfil-detalles">
    <p>
      <strong>Club:</strong> {equipo.club.nombre}
    </p>
    <p>
      <strong>Categoría:</strong> {equipo.categoria.nombre}
    </p>
    <p>
      <strong>Género:</strong> {obtenerGeneroTexto(equipo.categoria.genero)}
    </p>
    <p>
      <strong>División:</strong> {obtenerDivisionTexto(equipo.categoria.division)}
    </p>
    <p>
      <strong>Campeonatos:</strong> 
    </p>
    <p>
      <strong>Fundacion:</strong> 
    </p>
  </div>
</div>


  {/* Jugadores */}
  <div className={`equipoPerfil-panel ${activeTab === "jugadores" ? "active" : ""}`}>
  <div className="equipoPerfil-jugadoresWrapper">
    {/* Botón Registrar Jugador */}
    <button
      className="equipoPerfil-registrarButton"
      onClick={() => {
        if (equipo && equipo.club && equipo.categoria) {
          navigate(`/jugadores/indice-equipo`, {
            state: {
              clubId: equipo.club_id,
              categoriaId: equipo.categoria_id,
              equipoId: id
            }
          });
        } else {
          toast.error("No se pudo navegar, faltan datos");
        }
      }}
    >
      +1 Jugador
    </button>

    {/* Cards de jugadores */}
    <div className="equipoPerfil-jugadoresCards">
      {jugadores.map((jugador) => (
        <div key={jugador.id} className="equipoPerfil-jugadorCard">
          <img
            src={jugador.imagen_persona}
            alt={`${jugador.nombre_persona} ${jugador.apellido_persona}`}
            className="equipoPerfil-jugadorImagen"
          />
          <div className="equipoPerfil-jugadorInfo">
            <p>
              {jugador.nombre_persona} {jugador.apellido_persona}
            </p>
            <span>Edad: {jugador.edad_jugador} años</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
</div>
  </div>
  );
};
export default PerfilEquipo;
