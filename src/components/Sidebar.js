import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../assets/css/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar-layout">
      <div className="sidebar">
        <Link to="/campeonatos">Campeonatos</Link>
        <Link to="/clubes">Clubes</Link>
        <Link to="/arbitros">Árbitros</Link>
        <Link to="/divisiones">Divisiones</Link>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
