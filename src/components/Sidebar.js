import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../assets/css/Sidebar.css';
import logo from '../assets/img/logo.png';
const Sidebar = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="sidebar-layout">
      <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header" onClick={toggleSidebar}>
          <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>
        {!isSidebarCollapsed && (
          <>
            <Link to="/Campeonatos/Registrar">Campeonatos</Link>
            <Link to="/clubes/indice">Clubes</Link>
            <Link to="/equipos/indice">Equipos</Link>
            <Link to="/arbitros">Árbitros</Link>
            <Link to="/divisiones">Divisiones</Link>
            <Link to="/categorias/indice">Categorias</Link>
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