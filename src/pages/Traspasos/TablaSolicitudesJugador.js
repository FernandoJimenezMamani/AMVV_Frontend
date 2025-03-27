import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';
import '../../assets/css/IndiceTabla.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const TablaSolicitudesJugador = ({ campeonatoId , estadoFiltro }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/traspaso/presidente_por_jugador/${campeonatoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data.filter(s => s.tipo_solicitud === 'Jugador');
        setSolicitudes(data);
      } catch (error) {
        console.error('Error al obtener solicitudes tipo jugador:', error);
      }
    };

    if (campeonatoId) fetchSolicitudes();
  }, [campeonatoId]);

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'PENDIENTE': return <><PendingIcon style={{ color: 'orange' }} /> Pendiente</>;
      case 'APROBADO': return <><CheckCircleIcon style={{ color: 'green' }} /> Aprobado</>;
      case 'RECHAZADO': return <><DoDisturbIcon style={{ color: 'red' }} /> Rechazado</>;
      default: return null;
    }
  };

  const getImagenPerfil = (img, genero) => {
    if (img) return img;
    return genero === 'V' ? defaultUserMenIcon : defaultUserWomenIcon;
  };

  const filteredSolicitudes = solicitudes.filter(s => {
    return estadoFiltro === 'TODOS' || s.estado_club_origen === estadoFiltro;
  });
  

  return (
    <table className="table-layout">
      <thead className='table-head'>
        <tr>
          <th className="table-th-p">Jugador Solicitante</th>
          <th className="table-th-p">Club Solicitado</th>
          <th className="table-th-p">Fecha de Solicitud</th>
          <th className="table-th-p">Tu Respuesta</th>
          <th className="table-th-p">Acción</th>
        </tr>
      </thead>
      <tbody>
        {filteredSolicitudes.map(s => (
          <tr key={s.traspaso_id} className="table-row">
            <td className="table-td-p">
            <div className="jugador-info">
                        <img 
                        src={getImagenPerfil(s.imagen_jugador, s.genero_persona)} 
                        alt={`${s.nombre_jugador} foto`} 
                        className="table-logo" 
                        />
                        <span>{s.nombre_jugador} {s.apellido_jugador}</span>
                    </div>
            </td>
            <td className="table-td-p">
            <div className="jugador-info">
                        <img 
                        src={s.club_imagen} 
                        alt={`${s.club_destino_nombre} foto`} 
                        className="table-logo" 
                        />
                        <span>{s.club_destino_nombre}</span>
                    </div>
            </td>
            <td className="table-td-p">{new Date(s.fecha_solicitud).toLocaleDateString('es-ES')}</td>
            <td className="table-td-p">{getStatusIcon(s.estado_club_receptor)}</td>
            <td className="table-td-p"><button className='table-button button-view' onClick={() => navigate(`/traspasos/detallePresidente/${s.traspaso_id}`)}><RemoveRedEyeIcon /></button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaSolicitudesJugador;