import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';

const ListaJugadoresAll = () => {
  const [jugadores, setJugadores] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [jugadorToFichar, setJugadorToFichar] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/jugador/jugadores`); // Cambiado para obtener todos los jugadores
        console.log("Jugadores recibidos:", response.data); 
        setJugadores(response.data);
      } catch (error) {
        toast.error('Error al obtener los jugadores');
        console.error('Error al obtener los jugadores:', error);
      }
    };

    fetchJugadores();
  }, []);

  const handleProfileClick = (jugadorId) => {
    navigate(`/personas/perfil/${jugadorId}`);
  };

  const handleFicharClick = (jugadorId) => {
    setJugadorToFichar(jugadores.find(jugador => jugador.jugador_id === jugadorId));
    setShowConfirm(true);
  };

  const handleConfirmFichar = async () => {
    if (!jugadorToFichar) return;
  
    try {
      // Obtener el club_presidente_id desde sessionStorage
      const clubDestinoId = sessionStorage.getItem('clubPresidente_id');
  
      if (!clubDestinoId) {
        toast.error('No se encontró el ID del club destino del presidente');
        return;
      }
  
      // Llama al endpoint de crear traspaso en el backend
      await axios.post(`http://localhost:5002/api/traspaso/crear`, {
        jugador_id: jugadorToFichar.jugador_id,
        club_origen_id: jugadorToFichar.club_id, // Usamos el ID del club actual del jugador
        club_destino_id: clubDestinoId, // Usamos el ID del club del presidente como destino
        fecha_solicitud: new Date().toISOString().slice(0, 10),
        estado_solicitud: 'PENDIENTE'
      });
  
      toast.success('Traspaso solicitado correctamente');
      setShowConfirm(false);
      setJugadorToFichar(null);
    } catch (error) {
      toast.error('Error al solicitar el traspaso');
      console.error('Error al crear el traspaso:', error);
      setShowConfirm(false);
      setJugadorToFichar(null);
    }
  };  

  const handleCancelFichar = () => {
    setShowConfirm(false);
    setJugadorToFichar(null);
  };

  return (
    <div className="clubes-lista">
      <h2 className="clubes-lista-titulo">Lista de Todos los Jugadores</h2>

      <table className="clubes-lista-tabla">
        <thead className="clubes-lista-thead">
          <tr>
            <th>Foto</th>
            <th className="clubes-lista-th">Nombre del Jugador</th>
            <th className="clubes-lista-th">Fecha de Nacimiento</th>
            <th className="clubes-lista-th">Club</th>
            <th className="clubes-lista-th">Acción</th>
          </tr>
        </thead>
        <tbody>
          {jugadores.map((jugador) => (
            <tr key={jugador.jugador_id}>
              <td className="clubes-lista-td">
                <img
                  src={jugador.imagen_persona}
                  alt={`${jugador.nombre_persona} ${jugador.apellido_persona}`}
                  className="club-logo"
                />
              </td>
              <td className="clubes-lista-td-nombre">
                {jugador.nombre_persona} {jugador.apellido_persona}
              </td>
              <td className="clubes-lista-td">
                {new Date(jugador.fecha_nacimiento_persona).toLocaleDateString()}
              </td>
              <td className="clubes-lista-td">
                {jugador.nombre_club || 'Sin Club'}
              </td>
              <td className="clubes-lista-td">
                <button className="club-button perfil-btn" onClick={() => handleProfileClick(jugador.jugador_id)}>
                  Perfil
                </button>
                <button className="club-button perfil-btn" onClick={() => handleFicharClick(jugador.jugador_id)}>
                  Fichar Jugador
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        visible={showConfirm}
        onConfirm={handleConfirmFichar}
        onCancel={handleCancelFichar}
        message="¿Seguro que quieres fichar a este jugador?"
      />
    </div>
  );
};

export default ListaJugadoresAll;
