import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import the CSS for the carousel
import '../assets/css/Ventanaprincipal.css';
import logo from '../assets/img/imageV.jpeg';
import { toast } from 'react-toastify';

const CustomCarousel = () => {
  const [partidos, setPartidos] = useState([]);
  const [nextPartidos, setNextPartidos] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/partidos/get_upcoming_matches/4'); // Replace with your endpoint
        setPartidos(response.data); // Fetch the first 3 matches for the carousel
      } catch (error) {
        toast.error('Error al obtener el título')
        console.error('Error fetching match data:', error);
      }
    };

    const fetchAllMatches = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/partidos/get_all_matches/4'); // Replace with your endpoint
        setNextPartidos(response.data); // Fetch the next 9 matches for the grid below
      } catch (error) {
        toast.error('Error al obtener el título')
        console.error('Error fetching match data:', error);
      }
    };

    fetchMatches();
    fetchAllMatches();
  }, []);

  return (
    <div>
      <div className="carousel-container">
        <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} autoPlay={true} interval={5000} showStatus={false}>
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
