import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select, Card, Progress ,Button} from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "react-toastify";
import "../../assets/css/Reportes/DashboardMonitoreoEquipos.css";
import SummarizeIcon from '@mui/icons-material/Summarize';
import {  useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL
const DashboardMonitoreoEquipos = () => {
  const [datos, setDatos] = useState(null);
  const [porcentajeProgreso, setPorcentajeProgreso] = useState(0);
  const [mostrarTooltip, setMostrarTooltip] = useState(false);
    const navigate = useNavigate();
  useEffect(() => {
    fetchMonitoreoEquipos();
  }, []);

  const fetchMonitoreoEquipos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reportes/dashboard/monitoreo-equipos`);
      console.log('response', response);
      setDatos(response.data);
      calcularProgresoTiempo(response.data);
    } catch (error) {
      toast.error("Error al obtener el monitoreo de equipos");
    }
  };

  useEffect(() => {
    
      const websocketURL = `${WEBSOCKET_URL}`;
      const ws = new WebSocket(websocketURL);
    
      ws.onopen = () => console.log("✅ Conexión WebSocket establecida:", websocketURL);
    
      ws.onmessage = (event) => {
        try {
          const mensaje = JSON.parse(event.data);
          if (mensaje.type === "pago_registro_inscripcion") {
            console.log("🔄 Actualización detectada, refrescando progreso del campeonato");
            fetchMonitoreoEquipos();
          }
        } catch (error) {
          console.error("❌ Error al procesar mensaje de WebSocket:", error);
        }
      };
    
      ws.onerror = (error) => console.error("⚠️ Error en WebSocket:", error);
      ws.onclose = () => console.log("🔴 Conexión WebSocket cerrada");
    
      return () => {
        ws.close(); // Cerramos WebSocket al desmontar
      };
    }, [ fetchMonitoreoEquipos]);
  

  const data = datos
    ? [
        { name: "Equipos", "Equipos Inscritos": datos.totalEquipos, "Equipos Pagaron": datos.equiposPagaron, "Equipos Pendientes": datos.equiposPendientes }
      ]
    : [];

    const calcularProgresoTiempo = (data) => {
      if (!data || !data.fecha_inicio_transaccion || !data.fecha_fin_transaccion) return;
  
      const fechaInicio = new Date(data.fecha_inicio_transaccion);
      const fechaFin = new Date(data.fecha_fin_transaccion);
      const hoy = new Date();
  
      if (hoy < fechaInicio) {
        setPorcentajeProgreso(0);
      } else if (hoy > fechaFin) {
        setPorcentajeProgreso(100);
      } else {
        const totalDuracion = fechaFin - fechaInicio;
        const tiempoTranscurrido = hoy - fechaInicio;
        const porcentaje = (tiempoTranscurrido / totalDuracion) * 100;
        setPorcentajeProgreso(Math.round(porcentaje));
      }
    };

    const calcularDiasRestantes = () => {
      if (!datos || !datos.fecha_fin_transaccion) return "N/A";
    
      const hoy = new Date();
      const fechaFin = new Date(datos.fecha_fin_transaccion);
    
      const diferenciaMs = fechaFin - hoy;
      const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24)); 
    
      return diasRestantes > 0 ? `${diasRestantes} días restantes` : "Finalizado";
    };
    
    const getColorBarra = () => {
      if (porcentajeProgreso < 50) return "#4CAF50";
      if (porcentajeProgreso < 80) return "#FFC107";
      if (porcentajeProgreso < 100) return "#FF5733";
      return "#A0A0A0";
    };

    const formatFecha = (fecha) => {
      if (!fecha) return "";
      const fechaObj = new Date(fecha);
  
      const opciones = { day: "numeric", month: "long", year: "numeric" };
      return fechaObj.toLocaleDateString("es-ES", opciones);
    };

    const handleVerReportes = () => {
      navigate(`/reportes/IndiceGeneral`);
    };

    const handleVerHistorialTraspasos = () => {
      navigate(`/pagos/HistorialTraspasos`);
    };

    const handleVerHistorialInscripcion = () => {
      navigate(`/pagos/HistorialInscripcion`);
    };
  
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Monitoreo Inscripción de Equipos <span className="parpadeo-indicador"></span></h2>
      
      <h3 className="section-title">⏳ Tiempo Restante para Inscripción</h3>
        {datos && (
                <div className="progreso-tiempo-container">
                  <p className="fecha-text izquierda">{formatFecha(datos.fecha_inicio_transaccion)}</p>
                  <div className="barra-progreso-container">
                    <div className="barra-progreso"
                      onMouseEnter={() => setMostrarTooltip(true)}
                      onMouseLeave={() => setMostrarTooltip(false)}
                    >
                      <Progress
                        percent={porcentajeProgreso}
                        showInfo={false}
                        strokeColor={getColorBarra()}
                        className="barra-progreso"
                      />
                      <div
                        className="circulo-progreso"
                        style={{ left: `${porcentajeProgreso}%`, backgroundColor: getColorBarra() }}
                      ></div>
        
                      {mostrarTooltip && (
                        <div className="tooltip-dias-restantes">
                          {calcularDiasRestantes()}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="fecha-text derecha">{formatFecha(datos.fecha_fin_transaccion)}</p>
                </div>
              )}

              {datos && (
                      <div className="dashboard-summary">
                        <Card className="summary-card">
                          <h3>Total de Equipos Inscritos: <span>{datos.totalEquipos}</span></h3>
                          <p>✅ Equipos Confirmados: <strong>{datos.equiposPagaron}</strong></p>
                          <p>⏳ Equipos Con Deudas: <strong>{datos.equiposPendientes}</strong></p>
                        </Card>
                      </div>
                    )}
      {datos ? (
       <ResponsiveContainer width="100%" height={250}>
       <BarChart layout="vertical" data={data}>
         <XAxis 
           type="number" 
           tick={{ fill: "#333", fontSize: 14, fontWeight: "bold" }} 
         />
         <YAxis 
           type="category" 
           dataKey="name" 
           width={100} 
           tick={{ fill: "#555", fontSize: 14, fontWeight: "bold"  }} 
         />
         <Tooltip
           cursor={{ fill: "rgba(200, 200, 200, 0.2)" }}
           content={({ payload }) => {
             if (!payload || payload.length === 0) return null;
             return (
               <div className="custom-tooltip">
                 {payload.map((entry, index) => (
                   <p key={index} style={{ color: entry.color, fontWeight: "bold" }}>
                     {entry.name}: {entry.value}
                   </p>
                 ))}
               </div>
             );
           }}
         />
         <Legend 
           wrapperStyle={{ fontSize: "14px", fontWeight: "bold", color: "black" }} 
           iconType="circle" 
         />
         <Bar
           dataKey="Equipos Inscritos"
           fill="#2196F3"
           barSize={30}
           onMouseOver={(e) => {
             if (e && e.target) e.target.setAttribute("height", "40");
           }}
           onMouseOut={(e) => {
             if (e && e.target) e.target.setAttribute("height", "30");
           }}
         />
         <Bar
           dataKey="Equipos Pagaron"
           fill="#4CAF50"
           barSize={30}
           onMouseOver={(e) => {
             if (e && e.target) e.target.setAttribute("height", "40");
           }}
           onMouseOut={(e) => {
             if (e && e.target) e.target.setAttribute("height", "30");
           }}
         />
         <Bar
           dataKey="Equipos Pendientes"
           fill="#FFC107"
           barSize={30}
           onMouseOver={(e) => {
             if (e && e.target) e.target.setAttribute("height", "40");
           }}
           onMouseOut={(e) => {
             if (e && e.target) e.target.setAttribute("height", "30");
           }}
         />
       </BarChart>
     </ResponsiveContainer>
     
      ) : (
        <p className="dashboard-message">Cargando datos...</p>
      )}
      <div className="report-button-container">
        <button className="boton-reportes" type="primary" onClick={handleVerReportes}><SummarizeIcon/> Ver Otros Reportes</button>
        <button className="boton-reportes" type="primary" onClick={handleVerHistorialTraspasos}><HistoryIcon/> Ver Historial de Traspasos</button>
        <button className="boton-reportes" type="primary" onClick={handleVerHistorialInscripcion}><HistoryIcon/> Ver Historial de Inscripciones</button>
        </div>
    </div>
  );
};

export default DashboardMonitoreoEquipos;
