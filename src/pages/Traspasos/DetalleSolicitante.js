import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../assets/css/detalleTraspaso.css';
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Club_defecto from '../../assets/img/Club_defecto.png';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DetalleTraspasoPresidenteSolicitante = () => {
  const { solicitudId } = useParams();
  const [solicitud, setSolicitud] = useState(null);

  useEffect(() => {
    fetchSolicitud();
  }, [solicitudId]);

  const fetchSolicitud = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/traspaso/detalle/${solicitudId}`);
      const solicitud = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
      setSolicitud(solicitud);
    } catch (error) {
      console.error('Error al obtener el detalle de la solicitud de traspaso:', error);
    }
  };

  if (!solicitud) return <p>Cargando detalles de la solicitud...</p>;

  const renderEstadoIcono = (estado) => {
    switch (estado) {
      case 'APROBADO':
        return <CheckCircleOutlineIcon style={{ color: 'green', fontSize: '2rem' }} />;
      case 'RECHAZADO':
        return <CancelIcon style={{ color: 'red', fontSize: '2rem' }} />;
      case 'PENDIENTE':
        return <AccessTimeIcon style={{ color: 'orange', fontSize: '2rem' }} />;
      default:
        return null;
    }
  };

  const getImagenPerfil = (persona) => {
    if (persona.imagen_jugador) {
      return persona.imagen_jugador; 
    }
    return persona.jugador_genero === 'V' ? defaultUserMenIcon : defaultUserWomenIcon; 
  };

  const getImagenClubOrigen = (club) => {
    if (club.imagen_club_origen) {
      return club.imagen_club_origen; 
    }
    return Club_defecto;
  };

  const getImagenClubDestino = (club) => {
    if (club.imagen_club_destino) {
      return club.imagen_club_destino; 
    }
    return Club_defecto;
  };

  const formatFechaLarga = (fechaString) => {
    if (!fechaString) return '';
    const [year, month, day] = fechaString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)); // mes empieza en 0
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="detalle-traspaso">
      <h2>Certificado de Transferencia</h2>

      <div className="info-con-imagen">
        <div className="club-info">
          <p><strong>CLUB ACTUAL</strong></p>
          <p><strong>Nombre del Club:</strong> {solicitud.club_origen_nombre}</p>
          <p><strong>Presidente Actual del Club:</strong> {solicitud.nombre_presi_club_origen} {solicitud.apellido_presi_club_origen}</p>
        </div>
        <div className="imagen-info">
          <img src={getImagenClubOrigen(solicitud)} alt="Club Origen" />
        </div>
      </div>


      <div className="info-con-imagen">
        <div className="club-info">
          <p><strong>CLUB SOLICITANTE</strong></p>
          <p><strong>Nombre del Club:</strong> {solicitud.club_destino_nombre}</p>
          <p><strong>Presidente Actual del Club:</strong> {solicitud.nombre_presi_club_dest} {solicitud.apellido_presi_club_dest}</p>
        </div>
        <div className="imagen-info">
          <img src={getImagenClubDestino(solicitud)} alt="Club Destino" />
        </div>
      </div>


      <p>
        De acuerdo con las normas de la Asociación Municipal de Voleibol Vinto,
        certificamos que el jugador(a):
      </p>

      <div className="info-con-imagen">
        <div className="club-info">
          <p><strong>Nombre Completo:</strong> {solicitud.jugador_nombre} {solicitud.jugador_apellido}</p>
          <p><strong>Género:</strong> {solicitud.jugador_genero === 'V' ? 'Varón' : solicitud.jugador_genero === 'D' ? 'Dama' : 'Desconocido'}</p>
          <p><strong>Cédula de Identidad:</strong> {solicitud.jugador_ci}</p>
          <p><strong>Fecha de Nacimiento:</strong> {formatFechaLarga(solicitud.jugador_fecha_nacimiento)}</p>
        </div>
        <div className="imagen-info">
          <img src={getImagenPerfil(solicitud)} alt="Jugador" />
        </div>
      </div>

      
      <p>
        Ha sido parte del club: <strong>{solicitud.club_origen_nombre}</strong> y ha cumplido con todas
        sus obligaciones, sin tener cargos pendientes. Por lo tanto, se autoriza su 
        registro en el club: <strong>{solicitud.club_destino_nombre}</strong> para el <strong>{solicitud.nombre_campeonato}</strong>.
      </p>

      <h3>Estado de la Solicitud</h3>
        <div className="estado-solicitud-container">
          {solicitud.tipo_solicitud === 'Presidente'? (
            <div className="estado-item">
            <strong>Respuesta del Jugador:</strong> 
            <span className={solicitud.estado_jugador.toLowerCase() === 'pendiente' ? 'estado-pendiente' 
                : solicitud.estado_jugador.toLowerCase() === 'aprobado' ? 'estado-aprobado' 
                : 'estado-rechazado'}>
            {renderEstadoIcono(solicitud.estado_jugador)} {solicitud.estado_jugador}
            </span>
        </div>
          ):(
            <div className="estado-item">
            <strong>Respuesta del Presidente de club Receptor:</strong> 
            <span className={solicitud.estado_club_receptor.toLowerCase() === 'pendiente' ? 'estado-pendiente' 
                : solicitud.estado_club_receptor.toLowerCase() === 'aprobado' ? 'estado-aprobado' 
                : 'estado-rechazado'}>
            {renderEstadoIcono(solicitud.estado_club_receptor)} {solicitud.estado_club_receptor}
            </span>
        </div>
          )}
        
        <div className="estado-item">
            <strong>Respuesta del Presidente del Club Actual:</strong> 
            <span className={solicitud.estado_club_origen.toLowerCase() === 'pendiente' ? 'estado-pendiente' 
                : solicitud.estado_club_origen.toLowerCase() === 'aprobado' ? 'estado-aprobado' 
                : 'estado-rechazado'}>
            {renderEstadoIcono(solicitud.estado_club_origen)} {solicitud.estado_club_origen}
            </span>
        </div>
        </div>
        {solicitud.tipo_solicitud === 'Presidente'?(
          <>
           <h3>Estado del Pago</h3>
            <div className="estado-pago-container">
            {solicitud.estado_jugador === 'APROBADO' && solicitud.estado_club_origen === 'APROBADO' ? (
                <div>
                <strong>Estado del Pago:</strong> {renderEstadoIcono(solicitud.estado_deuda)} <span>{solicitud.estado_deuda}</span>
                </div>
            ) : (
                <p>El estado del pago se mostrará una vez el jugador y el presidente del club hayan aprobado la solicitud.</p>
            )}
            </div>
          </>
        ):(<>
        </>)}

        
    </div>
  );
};

export default DetalleTraspasoPresidenteSolicitante;
