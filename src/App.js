import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import VentanaPrincipal from './pages/Ventanaprincipal';
import Login from './pages/Iniciodesesion';
import './assets/css/tailwind.css';

// Importa las demás páginas aquí

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas que no usan Layout */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas que usan Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<VentanaPrincipal />} />
          {/* Agrega más rutas aquí dentro del Layout si es necesario */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
