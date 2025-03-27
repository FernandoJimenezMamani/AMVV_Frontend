import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ConfirmModal';
import { useSession } from '../../context/SessionContext';
import roles from '../../constants/roles'
import '../../assets/css/detalleTraspaso.css'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DetalleTraspasoPresidente = () => {
  const { solicitudId } = useParams();
  const [solicitud, setSolicitud] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState('');
  const { user } = useSession();
  const [presidente, setPresidente] = useState([]);

  const hasRole = (...roles) => {
    return user && user.rol && roles.includes(user.rol.nombre); 
  };

  useEffect(() => {
      fetchPresidente();
    }, []);

  useEffect(() => {
    fetchSolicitud();
  }, [solicitudId]);

  const fetchPresidente = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user')); // Convierte el JSON a objeto
      const userId = user?.id;
      const response = await axios.get(`${API_BASE_URL}/presidente_club/get_presidenteById/${userId}`); // Cambiado para obtener todos los jugadores
      console.log("presidente recibidos:", response.data); 
    
      setPresidente(response.data);
    } catch (error) {
      toast.error('Error al obtener los PRESIDENTES');
      console.error('Error al obtener los PRESIDENTES:', error);
    }
  };

  const fetchSolicitud = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/traspaso/detalle/${solicitudId}`);
      const solicitud = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
      console.log('solicitud:', solicitud);
      setSolicitud(solicitud);
    } catch (error) {
      console.error('Error al obtener el detalle de la solicitud de traspaso:', error);
    }
  };

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
      let url = '';
  
      if (solicitud.tipo_solicitud === 'Jugador') {
        url = `${API_BASE_URL}/traspaso/${actionType === 'approve' ? 'aprobarPorPresidente' : 'rechazarPorPresidente'}/${solicitudId}`;
      } else {
        url = `${API_BASE_URL}/traspaso/${actionType === 'approve' ? 'aprobar' : 'rechazar'}/club/${solicitudId}`;
      }
  
      await axios.put(url, { presidenteId: user.id });
  
      toast.success(`Traspaso ${actionType === 'approve' ? 'aprobado' : 'rechazado'} exitosamente`);
      closeModal();
      fetchSolicitud();
    } catch (error) {
      toast.error(`Error al ${actionType === 'approve' ? 'aprobar' : 'rechazar'} el traspaso`);
      console.error(`Error al ${actionType === 'approve' ? 'aprobar' : 'rechazar'} el traspaso:`, error);
    }
  };
  

  if (!solicitud) return <p>Cargando detalles de la solicitud...</p>;


  return (
    <div className="detalle-traspaso">
      <h2>Certificado de Transferencia</h2>

      <div className="club-info">
        <p><strong>CLUB ACTUAL</strong></p>
        <p><strong>Nombre del Club:</strong> {solicitud.club_origen_nombre}</p>
        <p><strong>Presidente Actual del Club:</strong> {solicitud.nombre_presi_club_origen} {solicitud.apellido_presi_club_origen} </p>
      </div>

      <div className="club-info">
        <p><strong>CLUB SOLICITANTE</strong></p>
        <p><strong>Nombre del Club:</strong> {solicitud.club_destino_nombre}</p>
        <p><strong>Presidente Actual del Club:</strong> {solicitud.nombre_presi_club_dest} {solicitud.apellido_presi_club_dest} </p>
      </div>


      <p>
        De acuerdo con las normas de la Asociación Municipal de Voleibol Vinto,
        certificamos que el jugador(a):
      </p>

      <div className="club-info">
        <p><strong>Nombre Completo:</strong> {solicitud.jugador_nombre} {solicitud.jugador_apellido}</p>
        <p><strong>Género:</strong> {solicitud.jugador_genero === 'V' ? 'Varón' : solicitud.jugador_genero === 'D' ? 'Dama' : 'Desconocido'}</p>
        <p><strong>Cédula de Identidad:</strong> {solicitud.jugador_ci}</p>
        <p><strong>Fecha de Nacimiento:</strong> {new Date(solicitud.jugador_fecha_nacimiento).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
      <p>
        Ha sido parte del club: <strong>{solicitud.club_origen_nombre}</strong> y ha cumplido con todas
        sus obligaciones, sin tener cargos pendientes. Por lo tanto, se autoriza su 
        registro en el club: <strong>{solicitud.club_destino_nombre}</strong> para el <strong>{solicitud.nombre_campeonato}</strong> .
      </p>

      <div className="estado-solicitud">
          {/* === CASO: tipo presidente === */}
          {solicitud.tipo_solicitud === 'Presidente' && solicitud.estado_club_origen === 'PENDIENTE' ? (
            <div className="botones">
              <button className="boton-aceptar" onClick={() => openModal('approve')}>
                Aceptar Solicitud
              </button>
              <button className="boton-rechazar" onClick={() => openModal('reject')}>
                Rechazar Solicitud
              </button>
            </div>
          ) : solicitud.tipo_solicitud === 'presidente' && (
            <div className="icono-estado">
              {solicitud.estado_club_origen === 'APROBADO' ? (
                <CheckCircleOutlineIcon style={{ color: 'green', fontSize: '2rem' }} />
              ) : solicitud.estado_club_origen === 'RECHAZADO' ? (
                <CancelIcon style={{ color: 'red', fontSize: '2rem' }} />
              ) : null}
            </div>
          )}

          {/* === CASO: tipo jugador → presidente club ORIGEN === */}
          {solicitud.tipo_solicitud === 'Jugador' &&
            presidente?.id_presidente === solicitud.presidente_club_id_origen && (
              solicitud.estado_club_origen === 'PENDIENTE' ? (
                <div className="botones">
                  <button className="boton-aceptar" onClick={() => openModal('approve')}>
                    Aceptar Solicitud 
                  </button>
                  <button className="boton-rechazar" onClick={() => openModal('reject')}>
                    Rechazar Solicitud 
                  </button>
                </div>
              ) : (
                <div className="icono-estado">
                  {solicitud.estado_club_origen === 'APROBADO' ? (
                    <CheckCircleOutlineIcon style={{ color: 'green', fontSize: '2rem' }} />
                  ) : solicitud.estado_club_origen === 'RECHAZADO' ? (
                    <CancelIcon style={{ color: 'red', fontSize: '2rem' }} />
                  ) : null}
                </div>
              )
          )}

          {/* === CASO: tipo jugador → presidente club RECEPTOR === */}
          {solicitud.tipo_solicitud === 'Jugador' &&
            presidente?.id_presidente === solicitud.presidente_club_id_destino && (
              solicitud.estado_club_receptor === 'PENDIENTE' ? (
                <div className="botones">
                  <button className="boton-aceptar" onClick={() => openModal('approve')}>
                    Aceptar Solicitud 
                  </button>
                  <button className="boton-rechazar" onClick={() => openModal('reject')}>
                    Rechazar Solicitud 
                  </button>
                </div>
              ) : (
                <div className="icono-estado">
                  {solicitud.estado_club_receptor === 'APROBADO' ? (
                    <CheckCircleOutlineIcon style={{ color: 'green', fontSize: '2rem' }} />
                  ) : solicitud.estado_club_receptor === 'RECHAZADO' ? (
                    <CancelIcon style={{ color: 'red', fontSize: '2rem' }} />
                  ) : null}
                </div>
              )
          )}
        </div>


      <ConfirmModal
        visible={modalVisible}
        onConfirm={handleAction}
        onCancel={closeModal}
        message={`¿Está seguro de que desea ${actionType === 'approve' ? 'aprobar' : 'rechazar'} este traspaso?`}
      />
    </div>
  );
};

export default DetalleTraspasoPresidente;
