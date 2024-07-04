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
      <Layout>
        <Routes>
          <Route path="/" element={<VentanaPrincipal />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
