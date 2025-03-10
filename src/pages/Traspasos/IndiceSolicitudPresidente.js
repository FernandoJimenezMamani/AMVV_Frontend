import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import estadoTraspaso from '../../constants/estadoTraspasos';
import { Select } from 'antd';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PendingIcon from '@mui/icons-material/Pending';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const { Option } = Select;

const IndiceSolicitudesPresidente = () => {
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

        const response = await axios.get(`${API_BASE_URL}/traspaso/presidente/${selectedCampeonato}`, {
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
    navigate(`/traspasos/detallePresidente/${solicitudId}`);
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

  const getImagenPerfilPresi = (persona) => {
    if (persona.imagen_presidente) {
      return persona.imagen_presidente; 
    }
    return persona.genero === 'V' ? defaultUserMenIcon : defaultUserWomenIcon; 
  };

  const getImagenPerfilJugador = (persona) => {
    if (persona.imagen_jugador) {
      return persona.imagen_jugador; 
    }
    return persona.genero_persona === 'V' ? defaultUserMenIcon : defaultUserWomenIcon; 
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
            <th className="table-th-p">Jugador Solicitado</th>
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
                <td className="table-td-p">
                    <div className="jugador-info">
                        <img 
                        src={getImagenPerfilJugador(solicitud)} 
                        alt={`${solicitud.nombre_jugador} foto`} 
                        className="table-logo" 
                        />
                        <span>{solicitud.nombre_jugador} {solicitud.apellido_jugador}</span>
                    </div>
                </td>

                <td className="table-td-p">
                    <div className="jugador-info">
                        <img 
                        src={solicitud.club_imagen} 
                        alt={`${solicitud.club_destino_nombre} foto`} 
                        className="table-logo" 
                        />
                        <span>{solicitud.club_destino_nombre}</span>
                    </div>
                </td>
                <td className="table-td-p">
                    <div className="jugador-info">
                        <img 
                        src={getImagenPerfilPresi(solicitud)} 
                        alt={`${solicitud.nombre} foto`} 
                        className="table-logo" 
                        />
                        <span>{solicitud.nombre} {solicitud.apellido}</span>
                    </div>
                </td>
              <td className="table-td-p">
                {new Date(solicitud.fecha_solicitud).toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </td>

              <td className="table-td-p">{getStatusIcon(solicitud.estado_club)}</td>
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

export default IndiceSolicitudesPresidente;
