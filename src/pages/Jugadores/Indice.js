import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ListaJugadores = () => {
  const [jugadores, setJugadores] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [jugadorToDelete, setJugadorToDelete] = useState(null);

  const { id } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/jugador/get_jugador_club/${id}`);
        console.log("Jugadores recibidos:", response.data); 
        setJugadores(response.data);
      } catch (error) {
        toast.error('error')
        console.error('Error al obtener los jugadores:', error);
      }
    };

    fetchJugadores();
  }, [id]); 

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
      await axios.put(`${API_BASE_URL}/jugador/delete_jugador/${jugadorToDelete}`, { user_id });
      setJugadores(jugadores.filter(jugador => jugador.jugador_id !== jugadorToDelete));
      setShowConfirm(false);
      setJugadorToDelete(null);
    } catch (error) {
      toast.error('error')
      console.error('Error al eliminar el jugador:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setJugadorToDelete(null);
  };

  const handleProfileClick = (jugadorId) => {
    navigate(`/personas/perfil/${jugadorId}`);
  };

  const handleAssignJugador = () => {
    navigate(`/jugadores/asignarJugador/${id}`);
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
        <img
          src={jugador.imagen_persona} // Asegúrate de que `imagen_persona` corresponde al campo correcto
          alt={`${jugador.nombre_persona} ${jugador.apellido_persona}`}
          className="club-logo"
        />
      </td>
      <td className="clubes-lista-td-nombre">
        {jugador.nombre_persona} {jugador.apellido_persona} {/* Asegúrate de usar `nombre_persona` y `apellido_persona` */}
      </td>
      <td className="clubes-lista-td">
        {new Date(jugador.fecha_nacimiento_persona).toLocaleDateString()} {/* Asegúrate de usar `fecha_nacimiento_persona` */}
      </td>
      <td className="clubes-lista-td">
        <button className="club-button perfil-btn" onClick={() => handleProfileClick(jugador.jugador_id)}>
          Perfil
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>

      <ConfirmModal
        visible={showConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="¿Seguro que quieres eliminar este jugador?"
      />
    </div>
  );
};

export default ListaJugadores;