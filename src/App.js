import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import VentanaPrincipal from './pages/Ventanaprincipal';
import Login from './pages/Iniciodesesion';
import RegistroCampeonato from './pages/Campeonatos/Registrar';
import './assets/css/tailwind.css';


function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas que no usan Layout ni Sidebar */}
        <Route path="/login" element={<Login />} />

        {/* Rutas que usan solo Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<VentanaPrincipal />} />
          {/* Agrega más rutas aquí dentro del Layout si es necesario */}
        </Route>

        {/* Rutas que usan solo Sidebar */}
        <Route path="/" element={<Sidebar />}>
          <Route path="/campeonatos/registrar" element={<RegistroCampeonato />} />
          {/* Otras rutas que usan solo Sidebar */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
