import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import RegistroJugadorClub from './RegistrarJugadorByCLub';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaJugadoresClub = () => {
  const [jugadores, setJugadores] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [jugadorToDelete, setJugadorToDelete] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const { id } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchJugadores();
  }, [id]); 

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
    setShowFormModal(true);
  };

  const handleFormClose = () => {
    setShowFormModal(false);
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Lista de Jugadores</h2>
      <div className="assign-jugador-container">
        <button className="table-add-button" onClick={handleAssignJugador}>
          Agregar Jugador
        </button>
      </div>
      <RegistroJugadorClub 
      isOpen={showFormModal} 
      onClose={handleFormClose}
      onJugadorCreated = {fetchJugadores}
      club_jugador_id={id}
       />
      <table className="table-layout">
        <thead className="table-head">
          <tr>
            <th className="table-th-p">Foto</th>
            <th className="table-th-p">Nombre del Jugador</th>
            <th className="table-th-p">Fecha de Nacimiento</th>
            <th className="table-th-p">C.I</th>
            <th className="table-th-p">Acción</th>
          </tr>
        </thead>
        <tbody>
        {jugadores.map((jugador) => (
          <tr key={jugador.jugador_id} className="table-row">
            <td className="table-td-p">
              <img
                src={jugador.imagen_persona} // Asegúrate de que `imagen_persona` corresponde al campo correcto
                alt={`${jugador.nombre_persona} ${jugador.apellido_persona}`}
                className="table-logo"
              />
            </td>
            <td className="table-td-p">
              {jugador.nombre_persona} {jugador.apellido_persona} {/* Asegúrate de usar `nombre_persona` y `apellido_persona` */}
            </td>
            <td className="table-td-p">
              {new Date(jugador.fecha_nacimiento_persona).toLocaleDateString()} {/* Asegúrate de usar `fecha_nacimiento_persona` */}
            </td>
            <td className="table-td-p">
              {jugador.ci_persona} 
            </td>
            <td className="table-td-p">
              <button className="table-button button-view" onClick={() => handleProfileClick(jugador.persona_id)}>
                <RemoveRedEyeIcon />
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

export default ListaJugadoresClub;