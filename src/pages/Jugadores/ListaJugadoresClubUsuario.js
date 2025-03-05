import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../assets/css/Jugadores/ListaJugadoresClubUsuario.css";
import PerfilJugadorModal from "./Perfil";
import defaultUserMenIcon from "../../assets/img/Default_Imagen_Men.webp";
import defaultUserWomenIcon from "../../assets/img/Default_Imagen_Women.webp";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaJugadoresClubUsuario = () => {
  const [jugadores, setJugadores] = useState([]);
  const [showPerfilModal, setShowPerfilModal] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const { id } = useParams(); 

  useEffect(() => {
    fetchJugadores();
  }, [id]);

  const fetchJugadores = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jugador/get_jugador_club/${id}`);
      setJugadores(response.data);
    } catch (error) {
      console.error("Error al obtener los jugadores:", error);
    }
  };

  const handleProfileClick = (jugadorId) => {
    setSelectedPersonaId(jugadorId);
    setShowPerfilModal(true);
  };

  const handleClosePerfilModal = () => {
    setShowPerfilModal(false);
    setSelectedPersonaId(null);
  };

  const getImagenPerfil = (jugador) => {
    if (jugador.imagen_persona) {
      return jugador.imagen_persona;
    }
    return jugador.genero_persona === "V" ? defaultUserMenIcon : defaultUserWomenIcon;
  };

  return (
    <div className="jugadores-usuarios-clubes-container">
       <div className="jugadores-usuarios-clubes-titulo-container">
          <h2 className="jugadores-usuarios-clubes-title">Jugadores del Club</h2>
        </div>
      <div className="jugadores-usuarios-clubes-grid">
        {jugadores.map((jugador) => (
          <div
            key={jugador.jugador_id}
            className="jugadores-usuarios-clubes-card"
            onClick={() => handleProfileClick(jugador.persona_id)}
          >
            <img
              src={getImagenPerfil(jugador)}
              alt={`${jugador.nombre_persona} ${jugador.apellido_persona}`}
              className="jugadores-usuarios-clubes-foto"
            />
            <h3 className="jugadores-usuarios-clubes-nombre">
              {jugador.nombre_persona} {jugador.apellido_persona}
            </h3>
          </div>
        ))}
      </div>
      <PerfilJugadorModal
        isOpen={showPerfilModal}
        onClose={handleClosePerfilModal}
        jugadorId={selectedPersonaId}
      />
    </div>
  );
};

export default ListaJugadoresClubUsuario;
