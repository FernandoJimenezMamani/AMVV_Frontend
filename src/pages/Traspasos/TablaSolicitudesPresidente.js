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
import Club_defecto from '../../assets/img/Club_defecto.png';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const TablaSolicitudesPresidente = ({ campeonatoId, estadoFiltro }) => {
  const [solicitudes, setSolicitudes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/traspaso/presidente/${campeonatoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data.filter(s => s.tipo_solicitud === 'Presidente');
        setSolicitudes(data);
      } catch (error) {
        console.error('Error al obtener solicitudes tipo presidente:', error);
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

  const getImagenClub = (club) => {
    if (club.club_imagen) {
      return club.club_imagen; 
    }
    return Club_defecto;
  };

  return (
    <table className="table-layout">
      <thead className='table-head'>
        <tr>
          <th className="table-th-p">Jugador</th>
          <th className="table-th-p">Club Interesado</th>
          <th className="table-th-p">Presidente Interesado</th>
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
                        src={getImagenClub(s)} 
                        alt={`${s.club_destino_nombre} foto`} 
                        className="table-logo" 
                        />
                        <span>{s.club_destino_nombre}</span>
                    </div>
            </td>
            <td className="table-td-p">
            <div className="jugador-info">
                        <img 
                        src={getImagenPerfil(s.imagen_presidente, s.genero)} 
                        alt={`${s.nombre} foto`} 
                        className="table-logo" 
                        />
                        <span>{s.nombre} {s.apellido}</span>
                    </div>
            </td>
            <td className="table-td-p">{new Date(s.fecha_solicitud).toLocaleDateString('es-ES')}</td>
            <td className="table-td-p">{getStatusIcon(s.estado_club_origen)}</td>
            <td className="table-td-p"><button className='table-button button-view' onClick={() => navigate(`/traspasos/detallePresidente/${s.traspaso_id}`)}><RemoveRedEyeIcon /></button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaSolicitudesPresidente;