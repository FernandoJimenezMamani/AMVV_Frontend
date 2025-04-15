import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; 
import '../assets/css/Ventanaprincipal.css';
import logo from '../assets/img/imageV.jpeg';
import { toast } from 'react-toastify';
import { Select } from 'antd';
import estadosPartidoCampMapping from '../constants/estadoPartido';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CategoryIcon from '@mui/icons-material/Category';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const { Option } = Select;

const CustomCarousel = () => {
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(() => {
    const stored = localStorage.getItem('selectedCategoria');
    return stored ? Number(stored) : null;
  });
  const [partidos, setPartidos] = useState([]);
  const [nextPartidos, setNextPartidos] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState(() => {
    return localStorage.getItem('selectedEstado') || estadosPartidoCampMapping.Confirmado;
  });
  const [visiblePartidos, setVisiblePartidos] = useState(12);
  const [campeonatos, setCampeonatos] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState(() => {
    const stored = localStorage.getItem('selectedCampeonato');
    return stored ? Number(stored) : null;
  });
  const [resultados, setResultados] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categoria/get_categoria`);
        setCategorias(response.data);
        if (response.data.length > 0) {
          const storedCategoria = localStorage.getItem('selectedCategoria');
          if (storedCategoria) {
            setSelectedCategoria(parseInt(storedCategoria));
          } else {
            setSelectedCategoria(response.data[0].id);
          }
          
        }
      } catch (error) {
        toast.error('Error al obtener categorías');
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/campeonatos/select`);
        setCampeonatos(response.data);
  
        const campeonatoActivo = response.data.find(camp => camp.estado !== 3);
        
        const storedCampeonato = localStorage.getItem('selectedCampeonato');
        if (storedCampeonato) {
          setSelectedCampeonato(parseInt(storedCampeonato));
        } else if (campeonatoActivo) {
          setSelectedCampeonato(campeonatoActivo.id);
        } else {
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
    const storedEstado = localStorage.getItem('selectedEstado');
    if (storedEstado) {
      setSelectedEstado(storedEstado);
    }
  }, []);  
  
  useEffect(() => {
    const fetchResultados = async () => {
      const partidosFinalizados = [...partidos, ...nextPartidos].filter(
        partido => partido.estado === estadosPartidoCampMapping.Finalizado
      );
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
  
    if (partidos.length > 0 || nextPartidos.length > 0) {
      fetchResultados();
    }
  }, [partidos, nextPartidos]); 
  

  useEffect(() => {
    if (!selectedCategoria || !selectedEstado || !selectedCampeonato) return;
  
    const fetchMatches = async () => {
      try {
        let endpoint = `${API_BASE_URL}/partidos/get_upcoming_matches/${selectedCategoria}/${selectedCampeonato}`;
    
        if (selectedEstado === estadosPartidoCampMapping.Finalizado) {
          endpoint = `${API_BASE_URL}/partidos/get_past_matches/${selectedCategoria}/${selectedCampeonato}`;
        } else if (selectedEstado === estadosPartidoCampMapping.Vivo) {
          endpoint = `${API_BASE_URL}/partidos/get_live_matches/${selectedCategoria}/${selectedCampeonato}`;
        }
    
        const response = await axios.get(endpoint);
        setPartidos(response.data);
      } catch (error) {
        toast.error('Error al obtener partidos');
        console.error('Error fetching match data:', error);
      }
    };
    
  
    const fetchAllMatches = async () => {
      try {
        let endpoint = `${API_BASE_URL}/partidos/get_all_matchesUpcoming/${selectedCategoria}/${selectedCampeonato}`;
        if (selectedEstado === estadosPartidoCampMapping.Finalizado) {
          endpoint = `${API_BASE_URL}/partidos/get_all_matchesPast/${selectedCategoria}/${selectedCampeonato}`;
        }
  
        const response = await axios.get(endpoint);
        setNextPartidos(response.data);
      } catch (error) {
        toast.error('Error al obtener todos los partidos');
        console.error('Error fetching match data:', error);
      }
    };
  
    fetchMatches();
    fetchAllMatches();
  }, [selectedCategoria, selectedEstado, selectedCampeonato]); 

  const handleLoadMore = () => {
    setVisiblePartidos(prev => prev + 12); 
  };

  const setGenderName = (gender) =>{
    if(gender === 'V'){
      return 'Varones'
    }else{
      return 'Damas'
    }
  }

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

  const handlePartidoClick = (partidoId) => {
    navigate(`/partidos/partidoDetalle/${partidoId}`, {
      state: { 
        campeonatoId: selectedCampeonato,  
        categoriaId: selectedCategoria,   
      }
    });
  };

  const handleVerTabla = () => {
    navigate(`/tablaposiciones/${selectedCategoria}/${selectedCampeonato}`);
  };

  return (
    <div>
     <div>
     <div className="filters-container">
        <p className="filters-title">Filtros</p>
        
        <div className="filters-selects">
          {/* Select de Campeonato */}
          <Select
            className="public-select"
            value={selectedCampeonato}
            onChange={(value) => {
              setSelectedCampeonato(value);
              localStorage.setItem('selectedCampeonato', value);
            }}
            style={{ width: '250px' }}
          >
            {campeonatos.map((camp) => (
              <Option key={camp.id} value={camp.id}>
              <EmojiEventsIcon/> {camp.nombre}
              </Option>
            ))}
          </Select>

          {/* Select de Categoría */}
          <Select
            className="public-select"
            value={selectedCategoria}
            onChange={(value) => {
              setSelectedCategoria(value);
              localStorage.setItem('selectedCategoria', value);
            }}
            style={{ width: '250px' }}
          >
            {categorias.map((categoria) => (
              <Option key={categoria.id} value={categoria.id}>
                <CategoryIcon/>{categoria.nombre} - {setGenderName(categoria.genero)}
              </Option>
            ))}
          </Select>

          {/* Select de Estado (Próximos/Finalizados) */}
          <Select
            className="public-select"
            value={selectedEstado}
            onChange={(value) => {
              setSelectedEstado(value);
              localStorage.setItem('selectedEstado', value);
            }}
            style={{ width: '250px' }}
          >
            <Option value="C"><CalendarMonthIcon/> Partidos Próximos</Option>
            <Option value="V"><CheckBoxIcon/> Partidos En Vivo</Option>
            <Option value="J"><CheckBoxIcon/> Partidos Finalizados</Option>
          </Select>
        </div>
        <button className="user-ver-tabla-button" onClick={handleVerTabla}>
          Ver tabla de Posiciones
        </button>
      </div>
      <div className="carousel-container">
        {partidos.length > 0 ? (
        <Carousel showArrows showThumbs={false} infiniteLoop autoPlay interval={5000} showStatus={false}>
        {partidos.map((match, index) => {
          const resultado = resultados[match.id];
      
          return (
            <div key={index} className="match-slide" onClick={() => handlePartidoClick(match.id)} style={{ cursor: 'pointer' }}>
              <div className="overlay-container">
                <div className="overlay-text">
                <h1>
                  {selectedEstado === estadosPartidoCampMapping.Confirmado
                    ? 'Próximamente'
                    : selectedEstado === estadosPartidoCampMapping.Vivo
                    ? 'En Vivo'
                    : 'Finalizado'}
                </h1>

                </div>
              </div>
              <div className="match-content">
                <div className="team-content">
                  <div className="team-logo-container">
                    <img src={match.equipo_local_imagen} alt={match.equipo_local_nombre} className="team-logo" />
                  </div>
                  <div className="team-name-container">
                    <p className="team-name">{match.equipo_local_nombre}</p>
                  </div>
                </div>
                <div className="vs-container">
                  <p className="vs">VS</p>
                </div>
                <div className="team-content">
                  <div className="team-logo-container">
                    <img src={match.equipo_visitante_imagen} alt={match.equipo_visitante_nombre} className="team-logo" />
                  </div>
                  <div className="team-name-container">
                    <p className="team-name">{match.equipo_visitante_nombre}</p>
                  </div>
                </div>
              </div>

              <div className="date-time-container">
              {match.estado === estadosPartidoCampMapping.Finalizado && resultado && (
                    <div className="match-result">
                      {resultado.walkover ? (
                        <p className="match-walkover">
                          Walkover {resultado.walkover === "L" ? match.equipo_local_nombre :
                          resultado.walkover === "V" ? match.equipo_visitante_nombre : "ambos equipos"}
                        </p>
                      ) : (
                        <p className="match-score">
                          Ganador {resultado.ganador} {resultado.marcador}
                        </p>
                      )}
                    </div>
                  )}
                {match.estado === estadosPartidoCampMapping.Vivo ? (
                  <div className="vivo-indicador">
                    <span className="vivo-punto"></span>
                    <span className="vivo-texto">En Vivo</span>
                  </div>
                ) : (
                  <>
                    <p className="match-date">{formatDate(match.fecha)}</p>
                    {match.estado === estadosPartidoCampMapping.Confirmado && new Date(match.fecha) < new Date() ? (
                      <p className="matches-pending">Resultado en espera</p>
                    ) : (
                      match.estado !== estadosPartidoCampMapping.Finalizado && (
                        <p className="match-time">{formatTime(match.fecha)}</p>
                      )
                    )}
                  </>
                )}
              </div>
      
              
            </div>
          );
        })}
      </Carousel>
      
         ) : (
          <div className="no-matches-container">
            <CalendarMonthIcon className="no-matches-icon" />
            <p className="no-matches-text">
              {selectedEstado === estadosPartidoCampMapping.Confirmado 
                ? "No hay más partidos próximos para esta categoría." 
                : "No hay más partidos finalizados en esta categoría."}
            </p>
          </div>

        )}
      </div>
    </div>

      {/* Next Matches Section */}
      <div className="next-matches-container">
      <h2 className="next-matches-titulo">
        {nextPartidos.length > 0
          ? (selectedEstado === estadosPartidoCampMapping.Confirmado ? "Próximos Partidos" : "Partidos Finalizados")
          : "No hay más partidos en esta categoría"}
      </h2>
      <div className="next-matches-grid">
          {nextPartidos.slice(0, visiblePartidos).map((match, index) => {
            const resultado = resultados[match.id];

            return (
              <div key={index} className="next-matches-card" onClick={() =>  handlePartidoClick(match.id)} style={{ cursor: 'pointer' }}>
                <div className="next-matches-team-info">
                  <div className="next-matches-team">
                    <img src={match.equipo_local_imagen} alt={match.equipo_local_nombre} className="next-matches-team-logo"/>
                    <p className="next-matches-team-name">{match.equipo_local_nombre}</p>
                  </div>
                  <div className="next-matches-vs">VS</div>
                  <div className="next-matches-team">
                    <img src={match.equipo_visitante_imagen} alt={match.equipo_visitante_nombre} className="next-matches-team-logo"/>
                    <p className="next-matches-team-name">{match.equipo_visitante_nombre}</p>
                  </div>
                </div>

                <div className="next-matches-info">
                    {match.estado === estadosPartidoCampMapping.Finalizado && resultado && (
                      <div className="next-matches-result">
                        {resultado.walkover ? (
                          <p className="next-matches-walkover">
                            Walkover {resultado.walkover === "L" ? match.equipo_local_nombre :
                            resultado.walkover === "V" ? match.equipo_visitante_nombre : "ambos equipos"}
                          </p>
                        ) : (
                          <p className="next-matches-score">
                            Ganador {resultado.ganador} {resultado.marcador}
                          </p>
                        )}
                      </div>
                      
                    )}
                  <p className="next-matches-date">{formatDate(match.fecha)}</p>
                  {match.estado === estadosPartidoCampMapping.Confirmado && new Date(match.fecha) < new Date() ? (
                  <p className="next-matches-pending">Resultado en espera</p>
                ) : (
                  match.estado !== estadosPartidoCampMapping.Finalizado && (
                    <p className="next-matches-time">{formatTime(match.fecha)}</p>
                  )
                )}
                  
                </div>

                
              </div>
            );
          })}
        </div>
        {visiblePartidos < nextPartidos.length && (
          <div className="load-more-container">
            <button className="load-more-button" onClick={handleLoadMore}>
              Cargar más
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomCarousel;
