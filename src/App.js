
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Registro from './components/Registro_jugador';
import InicioDeSesion from './components/Inicio_de_sesion';
import logo from './assets/img/logo.png';

function App() {
  const handleLoginSuccess = () => {
    // Aquí puedes manejar lo que ocurre después de un inicio de sesión exitoso
    // Por ejemplo, redirigir a otra página o mostrar contenido diferente
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="logo">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>A.M.V.V</h1>
          </div>
          <nav className="nav">
            <Link to="/">Partidos</Link>
            <Link to="/posiciones">Registrar Nuevo Jugador</Link>
            <Link to="/inicio_sesion">Inicia Sesión</Link>
          </nav>
          <div className="search">
            <input type="text" placeholder="Buscar..." />
          </div>
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={
              <>
                <h2>Próximos partidos</h2>
                <img src="volleyball_poster.png" alt="Volleyball Poster" />

 
              </>
            } />
            <Route path="/inicio_sesion" element={<InicioDeSesion onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/posiciones" element={<Registro />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;