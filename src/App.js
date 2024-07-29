import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import VentanaPrincipal from './pages/Ventanaprincipal';
import Login from './pages/Iniciodesesion';
import RegistroCampeonato from './pages/Campeonatos/Registrar';
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
          {/* Rutas para Club */}
          <Route path="/clubes/indice" element={<IndiceClub />} />
          <Route path="/clubes/registrar" element={<RegistrarClub />} />
          <Route path="/clubes/editar/:id" element={<EditarClub />} />
          <Route path="/clubes/Perfil/:id" element={<PerfilClub />} />
            {/* Rutas para Categorías */}
            <Route path="/categorias/indice" element={<ListaCategorias />} />
          <Route path="/categorias/registrar" element={<RegistrarCategoria />} />
          <Route path="/categorias/editar/:id" element={<EditarCategoria />} />
          {/* Rutas para Equipos */}
          <Route path="/equipos/indice" element={<ListaEquipo />} />
          <Route path="/equipos/registrar" element={<RegistrarEquipo />} />
          <Route path="/equipos/editar/:id" element={<EditarEquipo />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
