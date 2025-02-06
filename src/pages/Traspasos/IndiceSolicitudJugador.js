import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import estadoTraspaso from '../../constants/estadoTraspasos';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PendingIcon from '@mui/icons-material/Pending';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Indice = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          toast.error('No se encontró el token de autenticación');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/traspaso/jugador`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        console.log('traspaso pruebas',response.data);
        setSolicitudes(response.data);
      } catch (error) {
        toast.error('Error al obtener las solicitudes de traspaso');
        console.error('Error al obtener solicitudes de traspaso:', error);
      }
    };

    fetchSolicitudes();
  }, []);

  const handleVerDetalle = (solicitudId) => {
    navigate(`/traspasos/detalleJugador/${solicitudId}`);
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return (
          <span style={{ alignItems: 'center', gap: '5px', color: 'black' }}>
            <PendingIcon  style={{color: 'orange'}}/> Pendiente
          </span>
        );
      case 'APROBADO':
        return (
          <span style={{alignItems: 'center', gap: '5px', color: 'black' }}>
            <CheckCircleIcon  style={{ color: 'green' }}  /> Aprobado
          </span>
        );
      case 'RECHAZADO':
        return (
          <span style={{ alignItems: 'center', gap: '5px', color: 'black' }}>
            <DoDisturbIcon  style={{ color: 'red' }}/> Rechazado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Mis Solicitudes de Traspaso</h2>
      <table className="table-layout">
        <thead className='table-head'>
          <tr>
            <th className="table-th-p">Club Interesado</th>
            <th className="table-th-p">Presidente Interesato</th>
            <th className="table-th-p">Fecha de Solicitud</th>
            <th className="table-th-p">Tu Respuesta</th>
            <th className="table-th-p">Acción</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr key={solicitud.traspaso_id} className="table-row">
              <td className="table-td-p">{solicitud.club_destino_nombre}</td>
              <td className="table-td-p">{solicitud.nombre} {solicitud.apellido}</td>
              <td className="table-td-p">
                {new Date(solicitud.fecha_solicitud).toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </td>

              <td className="table-td-p">{getStatusIcon(solicitud.estado_jugador)}</td>
              <td className="table-td-p">
                <button className='table-button button-view' onClick={() => handleVerDetalle(solicitud.traspaso_id)}><RemoveRedEyeIcon/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Indice;
