import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../assets/css/Sidebar.css';
import logo from '../assets/img/logo.png';
import { useSession } from '../context/SessionContext';

const Sidebar = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  
  const { user, logout } = useSession(); // Acceder a la información del usuario y la función logout
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirige al usuario a la página de inicio de sesión
  };

  const handleProfileClick = (personaId) => {
    navigate(`/personas/perfil/${personaId}`);
  };

  return (
    <div className="sidebar-layout">
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header" onClick={toggleSidebar}>
          <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>
        {!isSidebarCollapsed && (
          <>
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
              <a className="main-link" onClick={() => toggleSection('campeonatos')}>
                Campeonatos
              </a>
              <div className={`submenu ${expandedSection === 'campeonatos' ? 'open' : ''}`}>
                <Link to="/Campeonatos/Indice">Indice</Link>
                <Link to="/Campeonatos/Registrar">Registrar</Link>
              </div>
            </div>
            <div className="menu-item">
              <a className="main-link" onClick={() => toggleSection('clubes')}>
                Clubes
              </a>
              <div className={`submenu ${expandedSection === 'clubes' ? 'open' : ''}`}>
                <Link to="/clubes/indice">Clubes</Link>
                <Link to="/clubes/Registrar">Registrar</Link>
              </div>
            </div>
            <div className="menu-item">
              <a className="main-link" onClick={() => toggleSection('equipos')}>
                Equipos
              </a>
              <div className={`submenu ${expandedSection === 'equipos' ? 'open' : ''}`}>
                <Link to="/equipos/indice">Equipos</Link>
                <Link to="/equipos/Registrar">Registrar</Link>
              </div>
            </div>
            <div className="menu-item">
              <a className="main-link" onClick={() => toggleSection('divisiones')}>
                Categorias
              </a>
              <div className={`submenu ${expandedSection === 'divisiones' ? 'open' : ''}`}>
                <Link to="/categorias/indice">Categorias</Link>
                <Link to="/categorias/Registrar">Registrar</Link>
              </div>
            </div>
          </>
        )}
        {/* Sección de información del usuario en la parte inferior */}
        {user && (
          <div className="user-info" onClick={toggleDropdown}>
            <img src={user.imagen} alt={user.nombre} className="user-avatar" />
            {!isSidebarCollapsed && (
              <div className="user-details">
                <p className="user-name">{user.nombre} {user.apellido}</p>
              </div>
            )}
            {isDropdownVisible && (
              <div className={`user-dropdown ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <button className="dropdown-item" onClick={() => handleProfileClick(user.id)}>Perfil</button>
                <a className="dropdown-item" onClick={handleLogout}>Cerrar sesión</a>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
