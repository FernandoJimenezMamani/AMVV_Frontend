import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; 
import '../assets/css/Ventanaprincipal.css';
import logo from '../assets/img/imageV.jpeg';
import { toast } from 'react-toastify';
import { Select } from 'antd';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const { Option } = Select;

const CustomCarousel = () => {
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [partidos, setPartidos] = useState([]);
  const [nextPartidos, setNextPartidos] = useState([]);

  // Obtener categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categoria/get_categoria`);
        console.log('Categorías obtenidas:', response.data);
        setCategorias(response.data);
        if (response.data.length > 0) {
          setSelectedCategoria(response.data[0].id); // Seleccionar la primera por defecto
        }
      } catch (error) {
        toast.error('Error al obtener categorías');
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    if (!selectedCategoria) return;

    const fetchMatches = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/partidos/get_upcoming_matches/${selectedCategoria}`);
        setPartidos(response.data);
      } catch (error) {
        toast.error('Error al obtener partidos');
        console.error('Error fetching match data:', error);
      }
    };

    const fetchAllMatches = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/partidos/get_all_matches/${selectedCategoria}`);
        setNextPartidos(response.data);
      } catch (error) {
        toast.error('Error al obtener todos los partidos');
        console.error('Error fetching match data:', error);
      }
    };

    fetchMatches();
    fetchAllMatches();
  }, [selectedCategoria]);

  return (
    <div>
     <div>
      {/* Select para categorías */}
      <div className="category-select-container">
        <label>Seleccione una categoría:</label>
        <Select
          value={selectedCategoria}
          onChange={(value) => setSelectedCategoria(value)}
          style={{ width: '250px', marginBottom: '15px' }}
        >
          {categorias.map((categoria) => (
            <Option key={categoria.id} value={categoria.id}>
              {`${categoria.nombre} - ${categoria.genero}`}
            </Option>
          ))}
        </Select>
      </div>

      {/* Carrusel de partidos */}
      <div className="carousel-container">
        <Carousel showArrows showThumbs={false} infiniteLoop autoPlay interval={5000} showStatus={false}>
          {partidos.map((match, index) => (
            <div key={index} className="match-slide">
              <div className="overlay-container">
                <div className="overlay-text">
                  <h1>Próximamente</h1>
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
                <p className="match-date">
                  {new Date(match.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                </p>
                <p className="match-time">
                  {new Date(match.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>

      {/* Next Matches Section */}
      <div className="next-matches-container">
        <h2 className="next-matches-titulo">Próximos Partidos</h2>
        <div className="next-matches-grid">
          {nextPartidos.slice(0, 12).map((match, index) => (
            <div key={index} className="next-matches-card">
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
                <p className="next-matches-date">{new Date(match.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}</p>
                <p className="next-matches-time">{new Date(match.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomCarousel;
