import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../assets/css/Sidebar.css';
import logo from '../assets/img/logo.png';

const Sidebar = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
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
              <div className={`submenu ${expandedSection === 'arbitros' ? 'open' : ''}`}>
                <Link to="/equipos/indice">Equipos</Link>
                <Link to="/arbitros/Registrar">Registrar</Link>
              </div>
            </div>
            <div className="menu-item">
              <a className="main-link" onClick={() => toggleSection('divisiones')}>
                Categorias
              </a>
              <div className={`submenu ${expandedSection === 'divisiones' ? 'open' : ''}`}>
                <Link to="/categorias/indice">Categorias</Link>
                <Link to="/divisiones/Registrar">Registrar</Link>
              </div>
            </div>

          </>
        )}
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
