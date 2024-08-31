import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import VentanaPrincipal from './pages/Ventanaprincipal';
import TablaPosiciones from './pages/TablaPosiciones';
import Login from './pages/Iniciodesesion';
import RegistroCampeonato from './pages/Campeonatos/Registrar';
import IndiceCampeonato from './pages/Campeonatos/Indice';
import EditarCampeonato from './pages/Campeonatos/Editar';
import { SessionProvider, useSession } from './context/SessionContext';
import IndiceClub from './pages/Clubes/Indice';
import RegistrarClub from './pages/Clubes/Registrar';
import EditarClub from './pages/Clubes/Editar';
import PerfilClub from './pages/Clubes/Perfil';
import ListaCategorias from './pages/Categorias/Indice';
import RegistrarCategoria from './pages/Categorias/Registrar';
import EditarCategoria from './pages/Categorias/Editar';
import ListaEquipo from './pages/Equipos/Indice';
import RegistrarEquipo from './pages/Equipos/Registrar';
import EditarEquipo from './pages/Equipos/Editar';
import RegistrarPartido from './pages/Partidos/Registrar';
import IndicePartido from './pages/Partidos/Indice';
import ListaPersona from './pages/Personas/Indice';
import RegistrarPersona from './pages/Personas/Registrar';
import EditarPersona from './pages/Personas/Editar';
import PerfilPersona from './pages/Personas/Perfil';
import RegistrarPresidenteClub from './pages/PresidenteClub/Registrar';
import RegistrarJugador from './pages/Jugadores/Registrar';
import ListaJugador from './pages/Jugadores/Indice';

import RegistrarLugar from './pages/Complejos/Registro';
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
        <Route path="/" element={<Sidebar />}>
              <Route path="/campeonatos/registrar" element={<RegistroCampeonato />} />
              <Route path="/campeonatos/indice" element={<IndiceCampeonato />} />
              <Route path="/campeonatos/editar/:id" element={<EditarCampeonato />} />
              <Route path="/clubes/indice" element={<IndiceClub />} />
              <Route path="/clubes/registrar" element={<RegistrarClub />} />
              <Route path="/clubes/editar/:id" element={<EditarClub />} />
              <Route path="/clubes/Perfil/:id" element={<PerfilClub />} />
                {/* Rutas para Categorías */}
                <Route path="/categorias/indice/:campeonatoId" element={<ListaCategorias />} />
              <Route path="/categorias/registrar" element={<RegistrarCategoria />} />
              <Route path="/categorias/editar/:id" element={<EditarCategoria />} />
              {/* Rutas para Equipos */}
              <Route path="/equipos/indice" element={<ListaEquipo />} />
              <Route path="/equipos/registrar" element={<RegistrarEquipo />} />
              <Route path="/equipos/editar/:id" element={<EditarEquipo />} />

              <Route path="/complejos/registro" element={<RegistrarLugar />} />

              <Route path="/partidos/registrar/:campeonatoId/:categoriaId" element={<RegistrarPartido />} />
              <Route path="/partidos/indice/:campeonatoId/:categoriaId" element={<IndicePartido />} />

              <Route path="/tablaposiciones/:categoriaId/:campeonatoId" element={<TablaPosiciones />} />

              <Route path="/personas/indice" element={<ListaPersona />} />
              <Route path="/personas/registrar" element={<RegistrarPersona />} />
              <Route path="/personas/editar/:id" element={<EditarPersona />} />
              <Route path="/personas/Perfil/:id" element={<PerfilPersona />} />
               {/* Rutas para PresidenteClub */}
              <Route path="/presidente_club/registrar/:id" element={<RegistrarPresidenteClub/>} />
              {/* Rutas para Jugadores */}
              <Route path="/jugadores/registrar/:id" element={<RegistrarJugador/>} />
              <Route path="/jugadores/indice/:id" element={<ListaJugador/>} />
            </Route>
          <Route path="/" element={<Layout />}>
              <Route index element={<VentanaPrincipal />} />
            </Route>
          <Route element={<PrivateRoutes />}>
            
            
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
