import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ConfirmModal';
import { useSession } from '../../context/SessionContext';

const DetalleTraspaso = () => {
  const { solicitudId } = useParams();
  const [solicitud, setSolicitud] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState('');
  
  // Obtener el contexto de sesión
  const { user } = useSession();

  // Función para verificar los roles, asumiendo que 'user.roles' está disponible en el contexto
  const hasRole = (...roles) => {
    return user && user.roles && roles.some(role => user.roles.includes(role));
  };

  const isJugador = hasRole('Jugador');
  const isPresidenteClub = hasRole('PresidenteClub');

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/traspaso/detalle/${solicitudId}`);
        setSolicitud(response.data);
      } catch (error) {
        console.error('Error al obtener el detalle de la solicitud de traspaso:', error);
      }
    };

    fetchSolicitud();
  }, [solicitudId]);

  const openModal = (type) => {
    setActionType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setActionType('');
  };

  const handleAction = async () => {
    try {
      // Define la URL según el rol del usuario
      const rolePath = isPresidenteClub ? 'club' : 'jugador';
      const url = `http://localhost:5002/api/traspaso/${actionType === 'approve' ? 'aprobar' : 'rechazar'}/${rolePath}/${solicitudId}`;
      
      await axios.put(url);
      toast.success(`Traspaso ${actionType === 'approve' ? 'aprobado' : 'rechazado'} exitosamente`);

      // Actualizar el estado local de solicitud tras la acción
      setSolicitud(prevSolicitud => ({
        ...prevSolicitud,
        estado_solicitud: actionType === 'approve' ? 'APROBADO' : 'RECHAZADO',
        [`aprobado_por_${rolePath}`]: 'S'
      }));

      closeModal();
    } catch (error) {
      toast.error(`Error al ${actionType === 'approve' ? 'aprobar' : 'rechazar'} el traspaso`);
      console.error(`Error al ${actionType === 'approve' ? 'aprobar' : 'rechazar'} el traspaso:`, error);
    }
  };

  if (!solicitud) return <p>Cargando detalles de la solicitud...</p>;

  // Determina si el jugador o el presidente pueden ver los botones
  const canJugadorAct = isJugador && solicitud.estado_solicitud === 'PENDIENTE';
  const canPresidenteAct = isPresidenteClub && solicitud.aprobado_por_jugador === 'S' && solicitud.aprobado_por_club !== 'S';

  return (
    <div className="detalle-traspaso">
      <h2>Certificado de Transferencia</h2>
      <p><strong>Club de Origen:</strong> {solicitud.clubOrigen?.nombre}</p>
      <p>
        De acuerdo con las normas de la Asociación Municipal de Voleibol VINTO,
        certificamos que el jugador(a):
      </p>
      <p><strong>Nombre Completo:</strong> {solicitud.jugador?.persona?.nombre} {solicitud.jugador?.persona?.apellido}</p>
      <p><strong>Cédula de Identidad:</strong> {solicitud.jugador?.persona?.ci}</p>
      <p><strong>Fecha de Nacimiento:</strong> {solicitud.jugador?.persona?.fecha_nacimiento}</p>

      <p>
        Ha sido parte del club: {solicitud.clubOrigen?.nombre} y ha cumplido con todas
        sus obligaciones, sin tener cargos pendientes. Por lo tanto, se autoriza su 
        registro en el club: <strong>{solicitud.clubDestino?.nombre}</strong> para la gestión correspondiente.
      </p>

      {/* Botones de acción, según los permisos */}
      {(canJugadorAct || canPresidenteAct) && (
        <>
          <button onClick={() => openModal('approve')} style={{ marginRight: '10px' }}>Aceptar</button>
          <button onClick={() => openModal('reject')} style={{ backgroundColor: 'red', color: 'white' }}>Rechazar</button>
        </>
      )}

      {/* ConfirmModal */}
      <ConfirmModal
        visible={modalVisible}
        onConfirm={handleAction}
        onCancel={closeModal}
        message={`¿Está seguro de que desea ${actionType === 'approve' ? 'aprobar' : 'rechazar'} este traspaso?`}
      />
    </div>
  );
};

export default DetalleTraspaso;
