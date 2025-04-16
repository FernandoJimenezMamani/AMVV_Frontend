import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Reportes/DashboardProgresoPartidos";
import Reportes from "./Reportes/Reportes";
import TransaccionDashboard from "./Reportes/DashboardMonitoreoEquipos"; // Nuevo componente para estado 1
import { toast } from "react-toastify";
import { useSession } from '../context/SessionContext';
import rolMapping from '../constants/roles';
import InicioPresidente from "./PresidenteClub/InicioPresidente";
import VistaDefault from "./VistaDefault";
import PartidosJugadorList from "./Partidos/PartidosJugadorList";
import PartidosArbitroList from "./Partidos/PartidosArbitroList";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const VentanaPrincipalUser = () => {
  const [campeonatoEnCurso, setCampeonatoEnCurso] = useState(null);
  const [campeonatoEnTransaccion, setCampeonatoEnTransaccion] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSession();

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        // Obtener campeonato en curso (estado = 2)
        const responseCurso = await axios.get(`${API_BASE_URL}/campeonatos/obtenerCampeonatosEnCurso/EnCurso`);
        setCampeonatoEnCurso(responseCurso.data || null);

        // Obtener campeonato en transacción (estado = 1)
        const responseTransaccion = await axios.get(`${API_BASE_URL}/campeonatos/obtenerCampeonatosEnTransaccion/EnTransaccion`);
        setCampeonatoEnTransaccion(responseTransaccion.data || null);
        
      } catch (error) {
        toast.error("Error al verificar los campeonatos");
        setCampeonatoEnCurso(null);
        setCampeonatoEnTransaccion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCampeonatos();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  const hasRole = (...roles) => {
    return user && user.rol && roles.includes(user.rol.nombre);
  };  

  return (
    <div className="inicio-container">
      {hasRole(rolMapping.PresidenteAsociacion) && (
        campeonatoEnCurso ? (
          <Dashboard campeonato={campeonatoEnCurso} />
        ) : campeonatoEnTransaccion ? (
          <TransaccionDashboard campeonato={campeonatoEnTransaccion} />
        ) : (
          <Reportes />
        )
      )}
      {(hasRole(rolMapping.PresidenteClub) || hasRole(rolMapping.DelegadoClub))&& (
        <>
        <InicioPresidente presidenteId ={user.id}></InicioPresidente>
        </>
       
      )}
      {!hasRole(rolMapping.PresidenteAsociacion) && 
       !hasRole(rolMapping.PresidenteClub) && (
        <VistaDefault />
      )}
    </div>
  );
};

export default VentanaPrincipalUser;
