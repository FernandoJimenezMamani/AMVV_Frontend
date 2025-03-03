import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Reportes/DashboardProgresoPartidos";
import Reportes from "./Reportes/Reportes";
import TransaccionDashboard from "./Reportes/DashboardMonitoreoEquipos"; // Nuevo componente para estado 1
import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const VentanaPrincipalUser = () => {
  const [campeonatoEnCurso, setCampeonatoEnCurso] = useState(null);
  const [campeonatoEnTransaccion, setCampeonatoEnTransaccion] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="inicio-container">
      {campeonatoEnCurso ? (
        <Dashboard campeonato={campeonatoEnCurso} />
      ) : campeonatoEnTransaccion ? (
        <TransaccionDashboard campeonato={campeonatoEnTransaccion} />
      ) : (
        <Reportes />
      )}
    </div>
  );
};

export default VentanaPrincipalUser;
