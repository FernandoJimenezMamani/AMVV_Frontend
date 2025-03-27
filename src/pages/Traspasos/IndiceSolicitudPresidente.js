// IndiceSolicitudesTraspaso.jsx
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import TablaSolicitudesPresidente from './TablaSolicitudesPresidente';
import TablaSolicitudesJugador from './TablaSolicitudesJugador';
import '../../assets/css/IndiceTabla.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const { Option } = Select;

const IndiceSolicitudesPresidente= () => {
  const [tipoSolicitud, setTipoSolicitud] = useState('Presidente');
  const [campeonatos, setCampeonatos] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS');

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/campeonatos/select`);
        setCampeonatos(res.data);
        const activo = res.data.find(c => c.estado !== 3);
        setSelectedCampeonato(activo ? activo.id : res.data[0]?.id);
      } catch (err) {
        toast.error('Error al obtener campeonatos');
        console.error(err);
      }
    };
    fetchCampeonatos();
  }, []);

  return (
    <div className="table-container">
      <h2 className="table-title">Solicitudes de Traspaso</h2>

      <div className="table-filters">
        <Select value={tipoSolicitud} onChange={setTipoSolicitud} className="public-select"  style={{ width: '270px' }}>
          <Option value="Presidente">Solicitudes de Presidentes</Option>
          <Option value="Jugador">Solicitudes de Jugadores</Option>
        </Select>

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
           <Select value={estadoFiltro} onChange={setEstadoFiltro} className="public-select" style={{ width: '220px' }}>
            <Option value="TODOS">Todos los Estados</Option>
            <Option value="PENDIENTE">Pendiente</Option>
            <Option value="APROBADO">Aprobado</Option>
            <Option value="RECHAZADO">Rechazado</Option>
          </Select>

      </div>

      {tipoSolicitud === 'Presidente' && (
        <TablaSolicitudesPresidente campeonatoId={selectedCampeonato} estadoFiltro={estadoFiltro}  />
      )}

      {tipoSolicitud === 'Jugador' && (
        <TablaSolicitudesJugador campeonatoId={selectedCampeonato}   estadoFiltro={estadoFiltro} />
      )}
    </div>
  );
};

export default IndiceSolicitudesPresidente;
