import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../assets/css/Sidebar.css';
import logo from '../assets/img/logo.png';
import { useSession } from '../context/SessionContext';
import defaultUserIcon from '../assets/img/Default_Imagen_Men.webp';
import HomeIcon from '@mui/icons-material/Home';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import PersonIcon from '@mui/icons-material/Person';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import defaultUserMenIcon from '../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../assets/img/Default_Imagen_Women.webp';

const Sidebar = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
   const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useSession();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSection = (section) => {
    setExpandedSection((prevSection) => (prevSection === section ? null : section));
  };  

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = (personaId) => {
    navigate(`/personas/perfil/${personaId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setExpandedSection(null); 
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hasRole = (...roles) => {
    return user && user.roles && roles.some(role => user.roles.includes(role));
  };

  const getImagenPerfil = (user) => {
    if (user?.imagen) {
      return user.imagen; 
    }
    return user?.genero === 'V' ? defaultUserMenIcon : defaultUserWomenIcon; 
  };
  

  return (
    <div className="sidebar-layout" >
      {isMobileMenuOpen && (
        <div
          className={`overlay ${isMobileMenuOpen ? 'show' : 'none'}`}
          onClick={toggleMobileMenu}
        ></div>
      )}

      <div
        className={`hamburger-menu ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={toggleMobileMenu}
      >
        <i className="fas fa-bars"></i>
      </div>

      <div
      ref={sidebarRef} 
        className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${
          isMobileMenuOpen ? 'open' : 'close'
        }`}
      >
        {!isSidebarCollapsed && (
          <button className="floating-close-btn" onClick={toggleSidebar}>
            <i className="fas fa-chevron-left"></i>
          </button>
        )}
        {isSidebarCollapsed && (
              <img
                src={logo}
                alt="Logo"
                className="sidebar-logo"
                onClick={toggleSidebar}
              />
            )}
        {!isSidebarCollapsed && (
          <div className="sidebar-header user-avatar-container">
            <img
              src={getImagenPerfil(user)}
              alt="Usuario"
              className="sidebar-logo user-avatar"
            />
          </div>
        )}

        <div className={`sidebar-content ${expandedSection ? 'menu-open' : ''}`}>
          {!isSidebarCollapsed && (
            <div className="user-info-container">
            <div className="user-name">
              {user?.nombre} {user?.apellido}
            </div>
            <div className="user-role">
              {user?.rol?.nombre || 'Sin rol'}
              
            </div>
          </div>
          
          )}

          {!isSidebarCollapsed && (
            <div className="menu-container">
                <div className="menu-item">
                  <a className="main-link" onClick={() => toggleSection('Inicio')}>
                    <HomeIcon/>    Inicio
                  </a>
                  <div className={`submenu ${expandedSection === 'campeonatos' ? 'open' : ''}`}>
                    <Link to="/Campeonatos/Indice">Indice</Link>
                    <Link to="/Campeonatos/Registrar">Registrar</Link>
                  </div>
                </div>
              <div className="menu-item">
                <a className={`main-link ${expandedSection === 'asociacion' ? 'active' : ''}`} onClick={() => toggleSection('asociacion')} ref={sidebarRef}>
                    <SportsVolleyballIcon/> Asociacion
                </a>
                <div className={`submenu ${expandedSection === 'asociacion' ? 'open' : ''}`}>
                  <Link to="/Campeonatos/Indice">Campeonatos</Link>
                  <Link to="/clubes/indice">Clubes</Link>
                  <Link to="/categorias/Lista">Categorias</Link>
                  <Link to="/complejos/Indice">Complejos</Link>
                </div>
              </div>
              <div className="menu-item">
                <a className={`main-link ${expandedSection === 'usuarios' ? 'active' : ''}`} onClick={() => toggleSection('usuarios')} ref={sidebarRef}>
                    <PersonIcon/> Miembros
                </a>
                <div className={`submenu ${expandedSection === 'usuarios' ? 'open' : ''}`} >
                  <Link to="/Arbitro/Indice">Arbitros</Link>
                  <Link to="/Jugadores/Indice">Jugadores</Link>
                  <Link to="/PresidenteClub/Indice">Presidentes</Link>
                  <Link to="/DelegadoClub/Indice">Delegados</Link>
                  <Link to="/Personas/Indice">Usuarios</Link>
                </div>
              </div>
              <div className="menu-item">
                  <a className={`main-link ${expandedSection === 'traspasos' ? 'active' : ''}`} onClick={() => toggleSection('traspasos')} ref={sidebarRef}>
                      <ChangeCircleIcon/> Traspasos
                  </a>
                  <div className={`submenu ${expandedSection === 'traspasos' ? 'open' : ''}`}>
                      <Link to="/traspasos/TraspasoListaJugadores">Fichar Jugadores</Link>
                      <Link to="/traspasos/indice">Ver solicitudes</Link>
                      <Link to="/traspasos/indiceSolicitudesPresidente">Ver solicitudesP</Link>
                  </div>
                </div>

                <div className="menu-item">
                  <a className="main-link" onClick={() => navigate('/pagos/tipos')}>
                    <MonetizationOnIcon /> Pagos
                  </a>
                </div>
            </div>
          )}
          <div className="mi-cuenta-container ">
            <button className="mi-cuenta-btn" onClick={() => handleProfileClick(user.id)}>
              <i className="fas fa-user-circle"></i> Mi cuenta
            </button>
          </div>
        </div>
      </div>

      <div className="content">
        <Outlet />
      </div>
    </div>

  );
};

export default Sidebar;
