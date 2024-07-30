import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import VentanaPrincipal from './pages/Ventanaprincipal';
import Login from './pages/Iniciodesesion';
import RegistroCampeonato from './pages/Campeonatos/Registrar';
import IndiceCampeonato from './pages/Campeonatos/Indice';
import EditarCampeonato from './pages/Campeonatos/Editar';
import { SessionProvider, useSession } from './context/SessionContext';
import './assets/css/tailwind.css';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };
  return (
    <SessionProvider>
      <Router>
        <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/sidebar" element={<Sidebar />} />
          <Route path="/" element={<Layout />}>
              <Route index element={<VentanaPrincipal />} />
            </Route>
          <Route element={<PrivateRoutes />}>
            
            <Route path="/" element={<Sidebar />}>
              <Route path="/campeonatos/registrar" element={<RegistroCampeonato />} />
              <Route path="/campeonatos/indice" element={<IndiceCampeonato />} />
              <Route path="/campeonatos/editar/:id" element={<EditarCampeonato />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </SessionProvider>
  );
}

const PrivateRoutes = () => {
  const { user } = useSession();

  return user ? <Outlet /> : <Navigate to="/login" />;
}

export default App;
