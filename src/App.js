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
import ListaCategorias2 from './pages/Categorias/Indice2';
import RegistrarCategoria from './pages/Categorias/Registrar';
import EditarCategoria from './pages/Categorias/Editar';
import ListaEquipo from './pages/Equipos/Indice';
import RegistrarEquipo from './pages/Equipos/Registrar';
import EditarEquipo from './pages/Equipos/Editar';
import PerfilEquipo from './pages/Equipos/Perfil';
import RegistrarJugadorEquipo from './pages/Equipos/JugadorEquipo';
import RegistrarPartido from './pages/Partidos/Registrar';
import IndicePartido from './pages/Partidos/Indice';
import RegistrarResultado from './pages/Partidos/RegistrarResultado';
import ListaPersona from './pages/Personas/Indice';
import RegistrarPersona from './pages/Personas/Registrar';
import EditarPersona from './pages/Personas/Editar';
import PerfilPersona from './pages/Personas/Perfil';
import RegistrarPresidenteClub from './pages/PresidenteClub/Registrar';
import RegistrarArbitro from './pages/Arbitros/Registrar';
import ListaArbitro from './pages/Arbitros/Indice';
import RegistrarJugador from './pages/Jugadores/Registrar';
import ListaJugador from './pages/Jugadores/Indice';
import ListaJugadorAll from './pages/Jugadores/IndiceGeneral';
import RegistrarLugar from './pages/Complejos/Registro';
import PartidoDetalle from './pages/Partidos/PartidoDetalle';
import ListaTraspaso from './pages/Traspasos/Indice';
import ListaTraspasoClub from './pages/Traspasos/IndiceClub';
import DetalleTraspaso from './pages/Traspasos/Detalle';
import './assets/css/tailwind.css';
import Toast from './components/Toast'
import {toast} from 'react-toastify'

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
    toast.success('Inicio de sesión exitoso'); // Mostrar notificación de éxito en inicio de sesión
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    toast.info('Sesión cerrada'); // Mostrar notificación al cerrar sesión
  };

  return (
    <SessionProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/sidebar" element={<Sidebar />} />
 
          <Route path="/" element={<ConditionalLayout />}>
          <Route index element={<VentanaPrincipal />} />
          <Route path="/campeonatos/indice" element={<IndiceCampeonato />} />
          <Route path="/categorias/indice/:campeonatoId" element={<ListaCategorias />} />
          <Route path="/partidos/indice/:campeonatoId/:categoriaId" element={<IndicePartido />} />
          <Route path="/tablaposiciones/:categoriaId/:campeonatoId" element={<TablaPosiciones />} />
          </Route>

          {/* Rutas privadas (Solo accesibles si el usuario está logueado) */}
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Sidebar/>}>
              {/* Rutas privadas */}
              <Route path="/campeonatos/registrar" element={<RegistroCampeonato />} />
              <Route path="/campeonatos/editar/:id" element={<EditarCampeonato />} />
              <Route path="/clubes/indice" element={<IndiceClub />} />
              <Route path="/clubes/registrar" element={<RegistrarClub />} />
              <Route path="/clubes/editar/:id" element={<EditarClub />} />
              <Route path="/clubes/Perfil/:id" element={<PerfilClub />} />
              
              <Route path="/categorias/lista" element={<ListaCategorias2 />} />
              <Route path="/categorias/registrar" element={<RegistrarCategoria />} />
              <Route path="/categorias/editar/:id" element={<EditarCategoria />} />
              <Route path="/equipos/indice" element={<ListaEquipo />} />
              <Route path="/equipos/registrar/:clubId" element={<RegistrarEquipo />} />
              <Route path="/equipos/editar/:id" element={<EditarEquipo />} />
              <Route path="/equipos/perfil/:id" element={<PerfilEquipo />} />
              <Route path="/equipos/registrar_jugador_equipo/:id" element={<RegistrarJugadorEquipo />} />

              <Route path="/complejos/registro" element={<RegistrarLugar />} />
              <Route path="/partidos/registrar/:campeonatoId/:categoriaId" element={<RegistrarPartido />} />
              <Route path="/partidos/registrarResultado/:partidoId" element={<RegistrarResultado />} />
              <Route path="/personas/indice" element={<ListaPersona />} />
              <Route path="/personas/registrar" element={<RegistrarPersona />} />
              <Route path="/personas/editar/:id" element={<EditarPersona />} />
              <Route path="/personas/Perfil/:id" element={<PerfilPersona />} />
              <Route path="/presidente_club/registrar/:id" element={<RegistrarPresidenteClub />} />
              <Route path="/jugadores/registrar/:id" element={<RegistrarJugador />} />
              <Route path="/jugadores/indice/:id" element={<ListaJugador />} />
              <Route path="/jugadores/indice" element={<ListaJugadorAll/>} />
              <Route path="/arbitro/registrar" element={<RegistrarArbitro />} />
              <Route path="/arbitro/indice" element={<ListaArbitro />} />
              <Route path="/partidos/partidoDetalle/:partidoId" element={<PartidoDetalle />} />

              <Route path="/traspasos/indice" element={<ListaTraspaso />} />
              <Route path="/traspasos/indice-club" element={<ListaTraspasoClub />} />
              <Route path="/traspasos/detalle/:solicitudId" element={<DetalleTraspaso />} />
            </Route>
          </Route>
        </Routes>
        {/* Aquí va el ToastContainer para que las notificaciones funcionen globalmente */}
        <Toast />
      </Router>
    </SessionProvider>
  );
}

const ConditionalLayout = () => {
  const { user } = useSession();

  // Si el usuario está autenticado, renderiza el Sidebar, si no, renderiza el Layout público
  return user ? <Sidebar /> : <Layout />;
};

// Componente para proteger las rutas privadas
const PrivateRoutes = () => {
  const { user } = useSession();

  // Mostrar un mensaje de carga o pantalla en blanco hasta que el estado del usuario esté determinado
  if (user === null) {
    return <div>Cargando...</div>;  // Esto evita un redireccionamiento temprano
  }

  console.log('Usuario autenticado en PrivateRoutes:', user);

  return user ? <Outlet /> : <Navigate to="/login" />;
};


export default App;
