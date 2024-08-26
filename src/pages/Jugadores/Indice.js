import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/css/IndiceTabla.css'; 

const ListaJugadores = () => {
  const [jugadores, setJugadores] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [jugadorToDelete, setJugadorToDelete] = useState(null);

  const { id } = useParams(); // Captura el club_id desde la URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/jugador/get_jugador_club/${id}`);
        console.log("Jugadores recibidos:", response.data); // Añadir este log para ver los datos recibidos
        setJugadores(response.data);
      } catch (error) {
        console.error('Error al obtener los jugadores:', error);
      }
    };

    fetchJugadores();
  }, [id]); // Se cambió 'club_id' a 'id' para asegurar que coincida con el parámetro recibido

  const handleEditClick = (jugadorId) => {
    navigate(`/jugadores/editar/${jugadorId}`);
  };

  const handleDeleteClick = (jugadorId) => {
    setJugadorToDelete(jugadorId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const user_id = 1; 
      await axios.put(`http://localhost:5002/api/jugador/delete_jugador/${jugadorToDelete}`, { user_id });
      setJugadores(jugadores.filter(jugador => jugador.jugador_id !== jugadorToDelete));
      setShowConfirm(false);
      setJugadorToDelete(null);
    } catch (error) {
      console.error('Error al eliminar el jugador:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setJugadorToDelete(null);
  };

  const handleProfileClick = (jugadorId) => {
    navigate(`/jugadores/perfil/${jugadorId}`);
  };

  const handleAssignJugador = () => {
    navigate(`/jugadores/registrar/${id}`);
    console.log("Lista de jugadores");
  };
  
  return (
    <div className="clubes-lista">
      <h2 className="clubes-lista-titulo">Lista de Jugadores</h2>
      <div className="assign-jugador-container">
        <button className="assign-jugador-button" onClick={handleAssignJugador}>
          Agregar Jugador
        </button>
      </div>
      <table className="clubes-lista-tabla">
        <thead className="clubes-lista-thead">
          <tr>
            <th>Foto</th>
            <th className="clubes-lista-th">Nombre del Jugador</th>
            <th className="clubes-lista-th">Fecha de Nacimiento</th>
            <th className="clubes-lista-th">Acción</th>
          </tr>
        </thead>
        <tbody>
        {jugadores.map((jugador) => (
            <tr key={jugador.jugador_id}>
            <td className="clubes-lista-td">
                <img src={jugador.persona_imagen} alt={`${jugador.nombre} ${jugador.apellido}`} className="club-logo" />
            </td>
            <td className="clubes-lista-td-nombre">
                {jugador.nombre} {jugador.apellido}
            </td>
            <td className="clubes-lista-td">
                {new Date(jugador.fecha_nacimiento).toLocaleDateString()}
            </td>
            <td className="clubes-lista-td">
                <button className="club-button perfil-btn" onClick={() => handleProfileClick(jugador.jugador_id)}>Perfil</button>
                <button className="club-button editar-btn" onClick={() => handleEditClick(jugador.jugador_id)}>Editar</button>
                <button className="club-button eliminar-btn" onClick={() => handleDeleteClick(jugador.jugador_id)}>Eliminar</button>
            </td>
            </tr>
        ))}
        </tbody>
      </table>

      {showConfirm && (
        <div className="confirm-modal">
          <p>¿Seguro que quieres eliminar este jugador?</p>
          <button className="confirm-btn" onClick={handleConfirmDelete}>Sí</button>
          <button className="cancel-btn" onClick={handleCancelDelete}>No</button>
        </div>
      )}
    </div>
  );
};

export default ListaJugadores;
