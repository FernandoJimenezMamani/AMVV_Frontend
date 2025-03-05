import React, { useState, useEffect } from "react";
import { Link, useNavigate ,Outlet} from "react-router-dom";
import axios from "axios";
import "../assets/css/Layout.css";
import logo from "../assets/img/logo.png";
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import GroupsIcon from "@mui/icons-material/Groups"; // Para Clubes
import PersonIcon from "@mui/icons-material/Person"; 
import PerfilJugadorModal from "../pages/Jugadores/Perfil";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allData, setAllData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const [showPerfilModal, setShowPerfilModal] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);

  // Cargar TODOS los datos al inicio
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equiposRes, clubesRes, jugadoresRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/equipo/get_all`),
          axios.get(`${API_BASE_URL}/club/get_club`),
          axios.get(`${API_BASE_URL}/jugador/jugadores`),
        ]);

        console.log(clubesRes);

        const equipos = equiposRes.data.map((e) => ({ 
          id: e.id, 
          nombre: e.nombre, // Ajustar si es necesario
          type: "Equipo" 
        }));

        const clubes = clubesRes.data.map((c) => ({ 
          id: c.id, 
          nombre: c.nombre, // Solo buscamos por nombre de club
          type: "Club" 
        }));

        const jugadores = jugadoresRes.data.map((j) => ({ 
          id: j.persona_id, 
          nombre: `${j.nombre_persona} ${j.apellido_persona}`, // Buscar por nombre + apellido
          type: "Jugador" 
        }));

        setAllData([...equipos, ...clubes, ...jugadores]);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    fetchData();
  }, []);

  // Filtrar datos localmente cuando el usuario escribe
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    const filteredResults = allData.filter((item) =>
      item.nombre && item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );    

    setSearchResults(filteredResults);
  }, [searchQuery, allData]);

  // Manejar la selección de un resultado
  const handleSelectResult = (result) => {
    if (result.type === "Equipo") {
      navigate(`/equipos/perfil/${result.id}`);
    } else if (result.type === "Club") {
      navigate(`/clubes/Perfil/${result.id}`);
    } else if (result.type === "Jugador") {
      handleProfileClick(result.id);
    }

    setSearchQuery("");
    setSearchResults([]);
  };

  const handleProfileClick = (jugadorId) => {
    setSelectedPersonaId(jugadorId);
    setShowPerfilModal(true);
  };

  const handleClosePerfilModal = () => {
    setShowPerfilModal(false);
    setSelectedPersonaId(null);
  };

  return (
    <div className="layout-container">
      <nav>
        <ul>
          <Link to="/" className="logo-link">
            <div className="logo-container">
              <img src={logo} alt="Logo" />
              <li>A.M.V.V</li>
            </div>
          </Link>
          <li className="navbar-campeonatos">
            <Link to="/clubes/indiceUsuario">Clubes</Link>
          </li>

          {/* Buscador */}
          <div className="search-container">
              <input
                type="text"
                placeholder="Buscar..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => setTimeout(() => setSearchResults([]), 200)}
              />

              {searchQuery.length > 0 && (
                  <div className="clear-icon" onClick={() => setSearchQuery("")}>
                    ✖
                  </div>
                )}
              <button className="search-button">
                <span className="material-icons">search</span>
              </button>

              {/* Mostrar resultados de búsqueda */}
              {searchResults.length > 0 && (
                <ul className="search-results">
                  {searchResults.map((result) => {
                    let icon;
                    if (result.type === "Jugador") {
                      icon = <PersonIcon className="search-result-icon" />;
                    } else if (result.type === "Equipo") {
                      icon = <SportsVolleyballIcon className="search-result-icon" />;
                    } else if (result.type === "Club") {
                      icon = <GroupsIcon className="search-result-icon" />;
                    }

                    return (
                      <li
                        key={result.id}
                        onClick={() => handleSelectResult(result)}
                        className="search-result-item"
                      >
                        {icon} <strong>{result.nombre}</strong> ({result.type})
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>


          <li className="login">
            <Link to="/login">Iniciar Sesión</Link>
          </li>
        </ul>
      </nav>
      <main className="layout-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <span className="footer-brand">A.M.V.V</span>
          </div>
          <div className="footer-section">
            <p>Sobre nosotros</p>
            <p>Contáctanos +591 62639062</p>
          </div>
          <div className="footer-section">
            <p>Síguenos</p>
            <div className="footer-icons">
              <i className="fab fa-facebook"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-tiktok"></i>
              <i className="fab fa-twitter"></i>
            </div>
          </div>
        </div>
      </footer>

      <PerfilJugadorModal
        isOpen={showPerfilModal}
        onClose={handleClosePerfilModal}
        jugadorId={selectedPersonaId}
      />
    </div>
  );
};

export default Layout;
