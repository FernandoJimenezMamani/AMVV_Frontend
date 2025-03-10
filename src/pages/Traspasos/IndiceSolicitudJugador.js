import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import { Select } from 'antd';
import estadoTraspaso from '../../constants/estadoTraspasos';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PendingIcon from '@mui/icons-material/Pending';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const { Option } = Select;

const Indice = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const navigate = useNavigate();
  const [campeonatos, setCampeonatos] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState(null);

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/campeonatos/select`);
        setCampeonatos(response.data);
  
        const campeonatoActivo = response.data.find(camp => camp.estado !== 3);
        
        if (campeonatoActivo) {
          setSelectedCampeonato(campeonatoActivo.id);
        } else if (response.data.length > 0) {
          setSelectedCampeonato(response.data[0].id); 
        }
      } catch (error) {
        toast.error("Error al obtener los campeonatos");
        console.error("Error fetching campeonatos:", error);
      }
    };
  
    fetchCampeonatos();
  }, []);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        if (!selectedCampeonato) {
          console.error('No se ha seleccionado un campeonato válido');
          return; // No ejecutar la petición si el campeonato es null
        }
        const token = sessionStorage.getItem('token');
        if (!token) {
          toast.error('No se encontró el token de autenticación');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/traspaso/jugador/${selectedCampeonato}`, {
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
  }, [selectedCampeonato]);

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
      <div className="table-filters">
            <Select
                  className="public-select"
                  value={selectedCampeonato}
                  onChange={(value) => setSelectedCampeonato(value)}
                  style={{ width: '250px' }}
                >
                  {campeonatos.map((camp) => (
                    <Option key={camp.id} value={camp.id}>
                    <EmojiEventsIcon/> {camp.nombre}
                    </Option>
                  ))}
                </Select>
            </div>
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
