import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/css/Partidos/IndicePartido.css';
import { toast } from 'react-toastify';
import { useSession } from '../../context/SessionContext';
import { Select } from 'antd';
import estadosPartidoCampMapping from '../../constants/estadoPartido';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import rolMapping from '../../constants/roles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Club_defecto from '../../assets/img/Club_defecto.png';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const { Option } = Select;

const PartidosList = () => {
  const { campeonatoId, categoriaId } = useParams();
  const [partidos, setPartidos] = useState([]);
  const [agrupacion, setAgrupacion] = useState('todos'); 
  const [resultados, setResultados] = useState({});
  const navigate = useNavigate();
  const { user } = useSession();
  const [estadoFiltro, setEstadoFiltro] = useState('todos'); 
  const [fixtureCompleto, setFixtureCompleto] = useState(null);

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/partidos/select/${categoriaId}/${campeonatoId}`);
        setPartidos(response.data);
      } catch (error) {
        toast.error('error')
        console.error('Error al obtener los partidos:', error);
      }
    };

    fetchPartidos();
  }, [categoriaId]);

  useEffect(() => {
    const fetchResultados = async () => {
      const partidosFinalizados = partidos.filter(partido => partido.estado === estadosPartidoCampMapping.Finalizado);
      const resultadosTemp = {};

      for (const partido of partidosFinalizados) {
        try {
          const response = await axios.get(`${API_BASE_URL}/partidos/ganador/${partido.id}`);
          resultadosTemp[partido.id] = response.data; // Guardamos el resultado con la clave del partido ID
        } catch (error) {
          console.error(`Error al obtener resultado para partido ${partido.id}:`, error);
        }
      }

      setResultados(resultadosTemp); // Almacenamos los resultados en el estado
    };

    if (partidos.length > 0) {
      fetchResultados();
    }
  }, [partidos]);

  useEffect(() => {
    const verificarFixture = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/partidos/verificar-fixture/${campeonatoId}/${categoriaId}`);
        console.log("👉 Data recibida:", response.data); // Debe contener: { fixtureCompleto: true/false }

        setFixtureCompleto(response.data);

      } catch (error) {
        console.error("Error al verificar fixture:", error);
      }
    };
  
    verificarFixture();
  }, [campeonatoId, categoriaId]);  

  const handleRegistrarPartido = () => {
    navigate(`/partidos/registrar/${campeonatoId}/${categoriaId}`);
  };

  const agruparPartidos = () => {
    if (agrupacion === 'todos') {
      return partidos;
    }
  
    const agrupados = {};
    partidos.forEach((partido) => {
      let clave = '';
  
      if (agrupacion === 'fecha') {
        clave = new Date(partido.fecha).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      } else if (agrupacion === 'lugar') {
        clave = partido.lugar_nombre;
      } else if (agrupacion === 'fecha_lugar') {
        clave = `${new Date(partido.fecha).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })} - ${partido.lugar_nombre}`;
      }
  
      if (!agrupados[clave]) {
        agrupados[clave] = [];
      }
  
      agrupados[clave].push(partido);
    });
  
    return agrupados;
  };
  

  const handleVerTabla = () => {
    navigate(`/tablaposiciones/${categoriaId}/${campeonatoId}`);
  };

  const handlePartidoClick = (partidoId) => {
    navigate(`/partidos/partidoDetalle/${partidoId}`, {
      state: { campeonatoId, categoriaId },
    });
  };

  const formatDate = (fecha) => {
    const partidoDate = new Date(fecha);
    
    return partidoDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  
  const formatTime = (fecha) => {
    const partidoDate = new Date(fecha); 
  
    return partidoDate.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, 
      timeZone: 'UTC', 
    });
  };

  const filtrarPartidosPorEstado = (partidos) => {
    if (estadoFiltro === estadosPartidoCampMapping.Confirmado) {
      return partidos.filter((partido) => partido.estado === estadosPartidoCampMapping.Confirmado);
    }
    if (estadoFiltro === estadosPartidoCampMapping.Finalizado) {
      return partidos.filter((partido) => partido.estado === estadosPartidoCampMapping.Finalizado);
    }
    return partidos; 
  };
  
  const getEstadoPartidoIcono = (fecha, estado) => {
    const ahora = new Date();
    const fechaPartido = new Date(fecha);
  
    if (fechaPartido < ahora && estado === estadosPartidoCampMapping.Confirmado) {
      return { icono: <ErrorIcon />, clase: 'alerta', tooltip: 'Partido vencido, resultados no registrados' };
    }
    if (fechaPartido >= ahora && estado === estadosPartidoCampMapping.Confirmado) {
      return { icono: <PendingIcon />, clase: 'pendiente', tooltip: 'Partido confirmado, en espera' };
    }
    if (estado === estadosPartidoCampMapping.Finalizado) {
      return { icono: <CheckCircleIcon />, clase: 'finalizado', tooltip: 'Partido finalizado' };
    }
    return null;
  };

  const hasRole = (...roles) => {
    return user && user.rol && roles.includes(user.rol.nombre);
  }; 

  const getImagenClubLocal = (club) => {
    if (club.equipo_local_imagen) {
      return club.equipo_local_imagen; 
    }
    return Club_defecto;
  };

  const getImagenClubVisitante = (club) => {
    if (club.equipo_visitante_imagen) {
      return club.equipo_visitante_imagen; 
    }
    return Club_defecto;
  };

  
  return (
    <div className="all-matches-container">
      <div className="titulo-con-boton">
      <button className="boton-volver" onClick={() => navigate(`/categorias/indice/${campeonatoId}`)}>
        <ArrowBackIcon />
      </button>
      <h2 className="all-matches-titulo">Partidos</h2>
    </div>


      <div className="all-matches-controls">
      {hasRole(rolMapping.PresidenteAsociacion) && fixtureCompleto !== null && (
        <button
          className="all-matches-registrar-button"
          title={fixtureCompleto ? 'Fixture ya completo' : 'Registrar nuevo partido'}
          onClick={handleRegistrarPartido}
          disabled={fixtureCompleto}
          style={{
            opacity: fixtureCompleto ? 0.5 : 1,
            cursor: fixtureCompleto ? 'not-allowed' : 'pointer'
          }}
        >
          +1 Partido
        </button>
      )}


        <button className="all-matches-ver-tabla-button" onClick={handleVerTabla}>
          Ver tabla
        </button>
        <div className="all-matches-filters">
          <Select
            id="agrupacion"
            className="all-matches-filter-select"
            value={agrupacion}
            onChange={(value) => setAgrupacion(value)}
          >
            <Option value="todos">No Agrupar</Option>
            <Option value="fecha">Fecha</Option>
            <Option value="lugar">Lugar</Option>
            <Option value="fecha_lugar">Fecha y Lugar</Option>
          </Select>

          <Select
            id="estadoFiltro"
            className="all-matches-filter-select"
            value={estadoFiltro}
            onChange={(value) => setEstadoFiltro(value)}
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
                <img src={getImagenClubLocal(partido)} alt={partido.equipo_local_nombre} className="all-matches-team-logo" />
                <p className="all-matches-team-name">{partido.equipo_local_nombre}</p>
              </div>
              <div className="all-matches-vs">VS</div>
              <div className="all-matches-team">
                <img src={getImagenClubVisitante(partido)} alt={partido.equipo_visitante_nombre} className="all-matches-team-logo" />
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
                    <img src={getImagenClubLocal(partido)} alt={partido.equipo_local_nombre} className="all-matches-team-logo" />
                    <p className="all-matches-team-name">{partido.equipo_local_nombre}</p>
                  </div>
                  <div className="all-matches-vs">VS</div>
                  <div className="all-matches-team">
                    <img src={getImagenClubVisitante(partido)} alt={partido.equipo_visitante_nombre} className="all-matches-team-logo" />
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

export default PartidosList;
