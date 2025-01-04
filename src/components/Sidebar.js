import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../assets/css/Sidebar.css';
import logo from '../assets/img/logo.png';
import { useSession } from '../context/SessionContext';

const Sidebar = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
   const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useSession();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
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

  return (
        <div className="sidebar-layout">
      {isMobileMenuOpen && (
        <div
          className={`overlay ${isMobileMenuOpen ? 'show' : 'none'}`}
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Botón de hamburguesa para abrir el sidebar en modo móvil */}
      <div
        className={`hamburger-menu ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={toggleMobileMenu}
      >
        <i className="fas fa-bars"></i>
      </div>

      {/* Sidebar principal */}
      <div
        className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${
          isMobileMenuOpen ? 'open' : 'close'
        }`}
      >
        {/* Botón flotante para cerrar el sidebar */}
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

        {/* Imagen del usuario cuando el sidebar está expandido */}
        {!isSidebarCollapsed && (
          <div className="sidebar-header user-avatar-container">
            <img
              src={user?.imagen}
              alt="Usuario"
              className="sidebar-logo user-avatar"
            />
          </div>
        )}

        {/* Contenedor del contenido con scroll interno */}
        <div className="sidebar-content">
          {/* Información del usuario */}
          {!isSidebarCollapsed && (
            <div className="user-info-container">
              <div className="user-name">{user?.nombre}</div>
              <div className="user-role">{user?.roles?.join(', ')}</div>
            </div>
          )}

          {/* Menú de opciones */}
          {!isSidebarCollapsed && (
            <div className="menu-container">
              {hasRole('Presidente') && (
                <div className="menu-item">
                  <a className="main-link" onClick={() => toggleSection('campeonatos')}>
                    Campeonatos
                  </a>
                  <div className={`submenu ${expandedSection === 'campeonatos' ? 'open' : ''}`}>
                    <Link to="/Campeonatos/Indice">Indice</Link>
                    <Link to="/Campeonatos/Registrar">Registrar</Link>
                  </div>
                </div>
              )}

              <div className="menu-item">
                <a className="main-link" onClick={() => toggleSection('clubes')}>
                  Clubes
                </a>
                <div className={`submenu ${expandedSection === 'clubes' ? 'open' : ''}`}>
                  <Link to="/clubes/indice">Clubes</Link>
                </div>
              </div>

              <div className="menu-item">
                <a className="main-link" onClick={() => toggleSection('divisiones')}>
                  Categorias
                </a>
                <div className={`submenu ${expandedSection === 'divisiones' ? 'open' : ''}`}>
                  <Link to="/categorias/Lista">Indice</Link>
                  <Link to="/categorias/Registrar">Registrar</Link>
                </div>
              </div>

              <div className="menu-item">
                <a className="main-link" onClick={() => toggleSection('lugares')}>
                  Complejos
                </a>
                <div className={`submenu ${expandedSection === 'lugares' ? 'open' : ''}`}>
                  <Link to="/complejos/Registro">Registrar complejos</Link>
                </div>
              </div>

              <div className="menu-item">
                <a className="main-link" onClick={() => toggleSection('arbitros')}>
                  Arbitros
                </a>
                <div className={`submenu ${expandedSection === 'arbitros' ? 'open' : ''}`}>
                  <Link to="/Arbitro/Indice">Indice</Link>
                  <Link to="/Arbitro/Registrar">Registrar</Link>
                </div>
              </div>

              <div className="menu-item">
                <a className="main-link" onClick={() => toggleSection('personas')}>
                  Personas
                </a>
                <div className={`submenu ${expandedSection === 'personas' ? 'open' : ''}`}>
                  <Link to="/Personas/Indice">Indice</Link>
                  <Link to="/Personas/Registrar">Registrar</Link>
                </div>
              </div>

              <div className="menu-item">
                <a className="main-link" onClick={() => toggleSection('jugadores')}>
                  Jugadores
                </a>
                <div className={`submenu ${expandedSection === 'jugadores' ? 'open' : ''}`}>
                  <Link to="/Jugadores/Indice">Indice</Link>
                </div>
              </div>
            </div>
          )}

          {/* Botón Mi cuenta */}
          <div className="mi-cuenta-container">
            <button className="mi-cuenta-btn" onClick={() => handleProfileClick(user.id)}>
              <i className="fas fa-user-circle"></i> Mi cuenta
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal fuera del sidebar */}
      <div className="content">
        <Outlet />
      </div>
    </div>

  );
};

export default Sidebar;
