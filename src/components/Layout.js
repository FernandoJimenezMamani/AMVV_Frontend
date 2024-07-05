// components/Layout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../assets/css/Layout.css';
import logo from '../assets/img/logo.png';

const Layout = () => {
  return (
    <div>
      <nav>
        <ul>
          <div className="logo-container">
            <img src={logo} alt="Logo" />
            <li>A.M.V.V</li>
          </div>
          <li style={{ marginLeft: '110px' }}><Link to="/">Partidos</Link></li>
          <li><Link to="/">Posiciones</Link></li>
          <li style={{ marginLeft: '510px' }}>|</li>
          <li className="search-container">
            <input type="text" placeholder="Buscar..." className="search-input" />
            <button className="search-button">
              <span className="material-icons">search</span>
            </button>
          </li>
          <li><Link to="/login">Iniciar Sesion</Link></li>
        </ul>
      </nav>
      <main>
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
    </div>
  );
};

export default Layout;
