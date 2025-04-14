import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import { Select } from 'antd';
import { toast } from 'react-toastify';
import estadosPartidoCampMapping from '../../constants/estadoPartido';
import '../../assets/css/Partidos/IndicePartido.css';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PartidosJugadorList = () => {
  const [partidos, setPartidos] = useState([]);
  const [agrupacion, setAgrupacion] = useState('todos');
  const [resultados, setResultados] = useState({});
  const [campeonatoId, setCampeonatoId] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const { user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/campeonatos/select`);
        const activo = response.data.find(c => c.estado !== 3);
        setCampeonatoId(activo ? activo.id : response.data[0]?.id);
      } catch (error) {
        toast.error('Error al obtener campeonatos');
        console.error('Error al obtener campeonatos:', error);
      }
    };
    fetchCampeonatos();
  }, []);

  useEffect(() => {
    const fetchPartidos = async () => {
      if (!user?.id || !campeonatoId) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/jugador/partidos/jugador/${user.id}/${campeonatoId}`);
        setPartidos(response.data);
      } catch (error) {
        toast.error('Error al obtener los partidos');
        console.error('Error al obtener los partidos:', error);
      }
    };
    fetchPartidos();
  }, [user, campeonatoId]);

  useEffect(() => {
    const fetchResultados = async () => {
      const partidosFinalizados = partidos.filter(p => p.estado === estadosPartidoCampMapping.Finalizado);
      const resultadosTemp = {};
  
      for (const partido of partidosFinalizados) {
        try {
          const response = await axios.get(`${API_BASE_URL}/partidos/ganador/${partido.id}`);
          resultadosTemp[partido.id] = response.data;
        } catch (error) {
          console.error(`Error al obtener resultado para partido ${partido.id}:`, error);
        }
      }
  
      setResultados(resultadosTemp);
    };
  
    if (partidos.length > 0) {
      fetchResultados();
    }
  }, [partidos]); 

  const formatDate = (fecha) => new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (fecha) => new Date(fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' });

  const getEstadoPartidoIcono = (fecha, estado) => {
    const ahora = new Date();
    const fechaPartido = new Date(fecha);
    if (fechaPartido < ahora && estado === estadosPartidoCampMapping.Confirmado)
      return { icono: <ErrorIcon />, clase: 'alerta', tooltip: 'Partido vencido, resultados no registrados' };
    if (fechaPartido >= ahora && estado === estadosPartidoCampMapping.Confirmado)
      return { icono: <PendingIcon />, clase: 'pendiente', tooltip: 'Partido confirmado, en espera' };
    if (estado === estadosPartidoCampMapping.Finalizado)
      return { icono: <CheckCircleIcon />, clase: 'finalizado', tooltip: 'Partido finalizado' };
    return null;
  };

  const filtrarPartidosPorEstado = (partidos) => {
    if (estadoFiltro === estadosPartidoCampMapping.Confirmado)
      return partidos.filter(p => p.estado === estadosPartidoCampMapping.Confirmado);
    if (estadoFiltro === estadosPartidoCampMapping.Finalizado)
      return partidos.filter(p => p.estado === estadosPartidoCampMapping.Finalizado);
    return partidos;
  };

  const handlePartidoClick = (partidoId) => {
    navigate(`/partidos/partidoDetalle/${partidoId}`, { state: { campeonatoId } });
  };

  const agruparPartidos = () => {
    if (agrupacion === 'todos') return partidos;
    const agrupados = {};
    partidos.forEach((p) => {
      let clave = agrupacion === 'fecha' ? formatDate(p.fecha) :
                  agrupacion === 'lugar' ? p.lugar_nombre :
                  `${formatDate(p.fecha)} - ${p.lugar_nombre}`;
      if (!agrupados[clave]) agrupados[clave] = [];
      agrupados[clave].push(p);
    });
    return agrupados;
  };

  return (
    <div className="all-matches-container">
      <h2 className="all-matches-titulo">Mis Partidos</h2>
      <div className="all-matches-controls">
        <div className="all-matches-filters">
          <Select
            value={agrupacion}
            onChange={setAgrupacion}
            className="all-matches-filter-select"
          >
            <Option value="todos">No Agrupar</Option>
            <Option value="fecha">Fecha</Option>
            <Option value="lugar">Lugar</Option>
            <Option value="fecha_lugar">Fecha y Lugar</Option>
          </Select>

          <Select
            value={estadoFiltro}
            onChange={setEstadoFiltro}
            className="all-matches-filter-select"
          >
            <Option value="todos">Todos</Option>
            <Option value={estadosPartidoCampMapping.Confirmado}>Pendientes</Option>
            <Option value={estadosPartidoCampMapping.Finalizado}>Jugados</Option>
          </Select>
        </div>
      </div>

      <div className="all-matches-groups-container">
  {agrupacion === 'todos' ? (
    <div className="all-matches-grid"> 
      {filtrarPartidosPorEstado(partidos).map((partido) => {
        const estadoPartido = getEstadoPartidoIcono(partido.fecha, partido.estado);
        const resultado = resultados[partido.id];
        return (
          <div
            key={partido.id}
            className="all-matches-card"
            onClick={() => handlePartidoClick(partido.id)}
            style={{ cursor: 'pointer', position: 'relative' }} 
          >
            {partido.estado === estadosPartidoCampMapping.Vivo && (
              <div className="estado-vivo-animado"></div>
            )}

           {estadoPartido && (
              <div 
                className={`partido-estado-icon ${estadoPartido.clase}`} 
                title={estadoPartido.tooltip}
              >
                {estadoPartido.icono}
              </div>
            )}

            <div className="all-matches-team-info">
              <div className="all-matches-team">
                <img src={partido.equipo_local_imagen} alt={partido.equipo_local_nombre} className="all-matches-team-logo" />
                <p className="all-matches-team-name">{partido.equipo_local_nombre}</p>
              </div>
              <div className="all-matches-vs">VS</div>
              <div className="all-matches-team">
                <img src={partido.equipo_visitante_imagen} alt={partido.equipo_visitante_nombre} className="all-matches-team-logo" />
                <p className="all-matches-team-name">{partido.equipo_visitante_nombre}</p>
              </div>
            </div>

            {partido.estado === estadosPartidoCampMapping.Finalizado && resultado && (
                  <div className="all-matches-result">
                    {resultado.walkover ? (
                      <p className="all-matches-walkover">
                        Walkover {resultado.walkover === "L" ? partido.equipo_local_nombre :
                        resultado.walkover === "V" ? partido.equipo_visitante_nombre :
                        "ambos equipos"}
                      </p>
                    ) : (
                      <p className="all-matches-score">
                        Ganador {resultado.ganador}  {resultado.marcador}
                      </p>
                    )}
                  </div>
                )}
              <div className="all-matches-info">
                  <p className="all-matches-date">{formatDate(partido.fecha)}</p>
                  {(partido.estado === estadosPartidoCampMapping.Confirmado || 
                    partido.estado === estadosPartidoCampMapping.Vivo)  && (
                      <>
                      <p className="all-matches-time">Hora: {formatTime(partido.fecha)}</p>
                      <p className="all-matches-time">Lugar: {partido.lugar_nombre}</p>
                    </>
                  )}
                </div>   
          </div>
        );
      })}
    </div>
  ) : (
    Object.entries(agruparPartidos(filtrarPartidosPorEstado(partidos))).map(([clave, partidos]) => (
      <div key={clave} className="all-matches-group">
        <h3 className="all-matches-group-title">{clave}</h3>
        <div className="all-matches-grid">
          {partidos.map((partido) => {
            const estadoPartido = getEstadoPartidoIcono(partido.fecha, partido.estado);
            const resultado = resultados[partido.id];
            return (
              <div
                key={partido.id}
                className="all-matches-card"
                onClick={() => handlePartidoClick(partido.id)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                {estadoPartido && (
                  <div 
                    className={`partido-estado-icon ${estadoPartido.clase}`} 
                    title={estadoPartido.tooltip}
                  >
                    {estadoPartido.icono}
                  </div>
                )}

                <div className="all-matches-team-info">
                  <div className="all-matches-team">
                    <img src={partido.equipo_local_imagen} alt={partido.equipo_local_nombre} className="all-matches-team-logo" />
                    <p className="all-matches-team-name">{partido.equipo_local_nombre}</p>
                  </div>
                  <div className="all-matches-vs">VS</div>
                  <div className="all-matches-team">
                    <img src={partido.equipo_visitante_imagen} alt={partido.equipo_visitante_nombre} className="all-matches-team-logo" />
                    <p className="all-matches-team-name">{partido.equipo_visitante_nombre}</p>
                  </div>
                </div>
                {partido.estado === estadosPartidoCampMapping.Finalizado && resultado && (
                  <div className="all-matches-result">
                    {resultado.walkover ? (
                      <p className="all-matches-walkover">
                        Walkover {resultado.walkover === "L" ? partido.equipo_local_nombre :
                        resultado.walkover === "V" ? partido.equipo_visitante_nombre :
                        "ambos equipos"}
                      </p>
                    ) : (
                      <p className="all-matches-score">
                        {resultado.ganador} ganó {resultado.marcador}
                      </p>
                    )}
                  </div>
                )}
                
                  <div className="all-matches-info">
                  <p className="all-matches-date">{formatDate(partido.fecha)}</p>
                  {partido.estado === estadosPartidoCampMapping.Confirmado && (
                    <>
                      <p className="all-matches-time">Hora: {formatTime(partido.fecha)}</p>
                      <p className="all-matches-time">Lugar: {partido.lugar_nombre}</p>
                    </>
                  )}
                </div>           
              </div>
            );
          })}
        </div>
      </div>
    ))
  )}
</div>
    </div>
  );
};

export default PartidosJugadorList;
