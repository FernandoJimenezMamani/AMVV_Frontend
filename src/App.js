import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Layout from "./components/Layout";
import Sidebar from "./components/Sidebar";
import VentanaPrincipal from "./pages/Ventanaprincipal";
import TablaPosiciones from "./pages/TablaPosiciones";
import Login from "./pages/Iniciodesesion";
import ResetPassword from "./pages/ResetPassword";
import RegistroCampeonato from "./pages/Campeonatos/Registrar";
import IndiceCampeonato from "./pages/Campeonatos/Indice";
import EditarCampeonato from "./pages/Campeonatos/Editar";
import { SessionProvider, useSession } from "./context/SessionContext";
import IndiceClub from "./pages/Clubes/Indice";
import RegistrarClub from "./pages/Clubes/Registrar";
import EditarClub from "./pages/Clubes/Editar";
import PerfilClub from "./pages/Clubes/Perfil";
import ListaCategorias from "./pages/Categorias/Indice";
import ListaCategorias2 from "./pages/Categorias/IndiceTable";
import RegistrarCategoria from "./pages/Categorias/Registrar";
import EditarCategoria from "./pages/Categorias/Editar";
import RegistrarEquipo from "./pages/Equipos/Registrar";
import EditarEquipo from "./pages/Equipos/Editar";
import PerfilEquipo from "./pages/Equipos/Perfil";
import RegistrarPartido from "./pages/Partidos/Registrar";
import IndicePartido from "./pages/Partidos/Indice";
import RegistrarResultado from "./pages/Partidos/RegistrarResultado";
import ListaPersona from "./pages/Personas/Indice";
import RegistrarPersona from "./pages/Personas/Registrar";
import EditarPersona from "./pages/Personas/Editar";
import PerfilPersona from "./pages/Personas/Perfil";
import RegistrarPresidenteClub from "./pages/PresidenteClub/Registrar";
import ListaPresidenteClub from "./pages/PresidenteClub/Indice";
import ListaDelegadoClub from "./pages/DelegadoClub/Indice";
import RegistrarArbitro from "./pages/Arbitros/Registrar";
import ListaArbitro from "./pages/Arbitros/Indice";
import RegistrarJugador from "./pages/Jugadores/Registrar";
import ListaJugadoresClub from "./pages/Jugadores/JugadoresByClub";
import ListaJugador from "./pages/Jugadores/Indice";
import ListaJugadorAll from "./pages/Jugadores/IndiceGeneral";
import ListaLugar from "./pages/Complejos/Indice";
import RegistrarLugar from "./pages/Complejos/Registro";
import PartidoDetalle from "./pages/Partidos/PartidoDetalle";
import ListaTraspaso from "./pages/Traspasos/IndiceSolicitudJugador";
import DetalleTraspaso from "./pages/Traspasos/DetalleJugador";
import ListaJugadoresEquipo from "./pages/Jugadores/IndiceJugadorEquipo";
import ListaPagos from "./pages/Pagos/ListaPagos";
import ListaEquiposPagos from "./pages/Pagos/InscripcionPagos";
import ListaJugadoresTraspaso from "./pages/Traspasos/IndiceJugadoresTraspaso";
import MisSolicitudes from "./pages/Traspasos/misSolicitudes";
import DetalleTraspasoPresidente from "./pages/Traspasos/DetallePresidente";
import IndiceSolicitudesPresidente from "./pages/Traspasos/IndiceSolicitudPresidente";
import DetalleTraspasoPresidenteSolicitante from "./pages/Traspasos/DetalleSolicitante";
import ListaTraspasosPagos from "./pages/Pagos/TraspasoPagos";
import ResumenCampeonato from "./pages/Reportes/ResumenCampeonato";
import GenerarFixture from "./pages/Partidos/GenerarFixture";
import Reportes from "./pages/Reportes/Reportes";
import VentanaPrincipalUser from "./pages/VentanaPrincipalUser";
import ListaClubesUsuario from "./pages/Clubes/ListaClubesUsuario";
import ListaJugadoresClubUsuario from "./pages/Jugadores/ListaJugadoresClubUsuario";
import ListaClubesTraspasos from "./pages/Traspasos/IndiceClubesTraspaso";
import MisSolicitudesJugador from "./pages/Traspasos/misSolicitudesJugador";
import HistorialPagosInscripcion from "./pages/Pagos/HistorialPagosInscripcion";
import EditarPartidoForm from "./pages/Partidos/Editar";
import PartidosArbitroList from "./pages/Partidos/PartidosArbitroList";
import PartidosJugadorList from "./pages/Partidos/PartidosJugadorList";
import HistorialPagosTraspaso from "./pages/Pagos/HistorialPagosTraspasos";
import RegistroEquipo from "./pages/Equipos/Registrar";
import HistorialPagosInscripcionClub from "./pages/Pagos/HistorialPagosInscripcionClub";
import HistorialPagosTraspasoClub from "./pages/Pagos/HistorialPagosTraspasoClub";
import "./assets/css/tailwind.css";
import Toast from "./components/Toast";
import { toast } from "react-toastify";
import { CampeonatoProvider } from "./context/CampeonatoContext";
const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    toast.info("Sesión cerrada"); // Mostrar notificación al cerrar sesión
  };

  return (
    <SessionProvider>
      <CampeonatoProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<ConditionalLayout />}>
            <Route index element={<VentanaPrincipal />} />
            <Route
              path="/tablaposiciones/:categoriaId/:campeonatoId"
              element={<TablaPosiciones />}
            />
            <Route
              path="/partidos/partidoDetalle/:partidoId"
              element={<PartidoDetalle />}
            />
            <Route path="/equipos/perfil/:id" element={<PerfilEquipo />} />
            <Route path="/clubes/Perfil/:id" element={<PerfilClub />} />
            <Route
              path="/clubes/indiceUsuario"
              element={<ListaClubesUsuario />}
            />
            <Route
              path="/jugadores/indiceJugadoresUsuario/:id"
              element={<ListaJugadoresClubUsuario />}
            />
          </Route>

          {/* Rutas privadas (Solo accesibles si el usuario está logueado) */}
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Sidebar />}>
              {/* Rutas privadas */}
              <Route path="/sidebar" element={<Sidebar />} />
              <Route
                path="/ventanaPrincipalUser"
                element={<VentanaPrincipalUser />}
              />
              <Route
                path="/partidos/indice/:campeonatoId/:categoriaId"
                element={<IndicePartido />}
              />
              <Route
                path="/campeonatos/registrar"
                element={<RegistroCampeonato />}
              />
              <Route
                path="/campeonatos/editar/:id"
                element={<EditarCampeonato />}
              />
              <Route path="/clubes/indice" element={<IndiceClub />} />
              <Route path="/clubes/registrar" element={<RegistrarClub />} />
              <Route path="/clubes/editar/:id" element={<EditarClub />} />
              <Route path="/clubes/Perfil/:id" element={<PerfilClub />} />
              <Route
                path="/campeonatos/indice"
                element={<IndiceCampeonato />}
              />
              <Route
                path="/categorias/indice/:campeonatoId"
                element={<ListaCategorias />}
              />
              <Route path="/categorias/lista" element={<ListaCategorias2 />} />
              <Route
                path="/categorias/registrar"
                element={<RegistrarCategoria />}
              />
              <Route
                path="/categorias/editar/:id"
                element={<EditarCategoria />}
              />
              <Route
                path="/equipos/registrar"
                element={<RegistroEquipo />}
              />
              <Route path="/equipos/editar/:id" element={<EditarEquipo />} />
              <Route path="/complejos/indice" element={<ListaLugar />} />
              <Route path="/complejos/registro" element={<RegistrarLugar />} />
              <Route
                path="/partidos/registrar/:campeonatoId/:categoriaId"
                element={<RegistrarPartido />}
              />
              <Route
                path="/partidos/editar/:partidoId"
                element={<EditarPartidoForm />}
              />
              <Route
                path="/partidos/generarFixture/:campeonatoId/:categoriaId"
                element={<GenerarFixture />}
              />
              <Route
                path="/partidos/registrarResultado/:partidoId"
                element={<RegistrarResultado />}
              />
              <Route path="/personas/indice" element={<ListaPersona />} />
              <Route
                path="/personas/registrar"
                element={<RegistrarPersona />}
              />
              <Route path="/personas/editar/:id" element={<EditarPersona />} />
              <Route path="/personas/Perfil/:id" element={<PerfilPersona />} />
              <Route
                path="/presidenteClub/registrar/:id"
                element={<RegistrarPresidenteClub />}
              />
              <Route
                path="/presidenteClub/indice"
                element={<ListaPresidenteClub />}
              />
              <Route
                path="/delegadoClub/indice"
                element={<ListaDelegadoClub />}
              />
              <Route
                path="/jugadores/registrar/:id"
                element={<RegistrarJugador />}
              />
              <Route
                path="/jugadores/indice/:id"
                element={<ListaJugadoresClub />}
              />
              <Route path="/jugadores/indice" element={<ListaJugadorAll />} />
              <Route path="/arbitro/registrar" element={<RegistrarArbitro />} />
              <Route path="/arbitro/indice" element={<ListaArbitro />} />
              <Route
                path="/jugadores/indice-equipo"
                element={<ListaJugadoresEquipo />}
              />
              <Route path="/traspasos/indice" element={<ListaTraspaso />} />
              <Route
                path="/traspasos/detalleJugador/:solicitudId"
                element={<DetalleTraspaso />}
              />
              <Route path="/pagos/tipos" element={<ListaPagos />} />
              <Route
                path="/pagos/Inscripcion"
                element={<ListaEquiposPagos />}
              />
              <Route
                path="/pagos/HistorialInscripcion"
                element={<HistorialPagosInscripcion />}
              />

              <Route
                path="/pagos/HistorialTraspasos"
                element={<HistorialPagosTraspaso />}
              />  
              <Route path="/pagos/Traspaso" element={<ListaTraspasosPagos />} />
              <Route
                path="/traspasos/TraspasoListaJugadores"
                element={<ListaJugadoresTraspaso />}
              />
              <Route
                path="/traspasos/misSolicitudes"
                element={<MisSolicitudes />}
              />
              <Route
                path="/traspasos/misSolicitudesJugador"
                element={<MisSolicitudesJugador />}
              />
              <Route
                path="/traspasos/detallePresidente/:solicitudId"
                element={<DetalleTraspasoPresidente />}
              />
              <Route
                path="/traspasos/detalleSolicitante/:solicitudId"
                element={<DetalleTraspasoPresidenteSolicitante />}
              />
              <Route
                path="/traspasos/indiceSolicitudesPresidente"
                element={<IndiceSolicitudesPresidente />}
              />
              <Route
                path="/traspasos/TraspasoListaClubes"
                element={<ListaClubesTraspasos />}
              />
              <Route
                path="/reportes/resumenCampeonato/:campeonatoId"
                element={<ResumenCampeonato />}
              />
              <Route path="/reportes/IndiceGeneral" element={<Reportes />} />
              <Route path="/partidos/jugador" element={< PartidosJugadorList/>} />
              <Route path="/partidos/arbitro" element={<PartidosArbitroList />} />
              <Route path="/pagos/historialClubTraspaso/:presidenteId" element={<HistorialPagosTraspasoClub />} />
              <Route path="/pagos/historialClubInscripcion/:presidenteId" element={<HistorialPagosInscripcionClub />} />
            </Route>
          </Route>
        </Routes>
        {/* Aquí va el ToastContainer para que las notificaciones funcionen globalmente */}
        <Toast />
      </Router>
      </CampeonatoProvider>
    </SessionProvider>
  );
};

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
    return <div>Cargando...</div>; // Esto evita un redireccionamiento temprano
  }

  console.log("Usuario autenticado en PrivateRoutes:", user);

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default App;
