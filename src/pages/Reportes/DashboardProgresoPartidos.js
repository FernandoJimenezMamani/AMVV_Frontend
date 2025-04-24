import React, { useEffect, useState ,useCallback} from "react";
import axios from "axios";
import { Select, Card, Progress ,Button} from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "react-toastify";
import { ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import "../../assets/css/Reportes/DashboardProgresoPartidos.css";
import {  useNavigate } from 'react-router-dom';
import SummarizeIcon from '@mui/icons-material/Summarize';

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL

const DashboardProgresoPartidos = () => {
  const [categorias, setCategorias] = useState([]);
  const [genero, setGenero] = useState("Todos");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [datos, setDatos] = useState(null);
  const [porcentajeProgreso, setPorcentajeProgreso] = useState(0);
  const navigate = useNavigate();
  const [mostrarTooltip, setMostrarTooltip] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categoria/nombres`);
        setCategorias(response.data.categorias);
      } catch (error) {
        toast.error("Error al obtener las categorías");
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchProgreso();
  }, [categoriaSeleccionada, genero]);

  const fetchProgreso = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reportes/progreso-partidosDashboard`, {
        params: {
          categoria: categoriaSeleccionada || "",
          genero: genero !== "Todos" ? genero : "",
        },
      });
      setDatos(response.data);
      calcularProgresoTiempo(response.data);
    } catch (error) {
      toast.error("Error al obtener el progreso de partidos");
    }
  }, [categoriaSeleccionada, genero]);
  

  useEffect(() => {
    if (!datos?.campeonatoId) return;
  
    const websocketURL = `${WEBSOCKET_URL}/dashboardprogreso/${datos.campeonatoId}`;
    const ws = new WebSocket(websocketURL);
  
    ws.onopen = () => console.log("✅ Conexión WebSocket establecida:", websocketURL);
  
    ws.onmessage = (event) => {
      try {
        const mensaje = JSON.parse(event.data);
        if (mensaje.type === "tabla_posiciones_actualizada") {
          console.log("🔄 Actualización detectada, refrescando progreso del campeonato");
          fetchProgreso();
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
  }, [datos?.campeonatoId, fetchProgreso]);
  

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const fechaObj = new Date(fecha);

    const opciones = { day: "numeric", month: "long", year: "numeric" };
    return fechaObj.toLocaleDateString("es-ES", opciones);
  };

  const handleVerReportes = () => {
    navigate(`/reportes/IndiceGeneral`);
  };
  

  const calcularProgresoTiempo = (data) => {
    if (!data || !data.fecha_inicio_campeonato || !data.fecha_fin_campeonato) return;

    const fechaInicio = new Date(data.fecha_inicio_campeonato);
    const fechaFin = new Date(data.fecha_fin_campeonato);
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

  const getColorBarra = () => {
    if (porcentajeProgreso < 50) return "#4CAF50";
    if (porcentajeProgreso < 80) return "#FFC107";
    if (porcentajeProgreso < 100) return "#FF5733";
    return "#A0A0A0";
  };

  const calcularDiasRestantes = () => {
    if (!datos || !datos.fecha_fin_campeonato) return "N/A";
  
    const hoy = new Date();
    const fechaFin = new Date(datos.fecha_fin_campeonato);
  
    const diferenciaMs = fechaFin - hoy;
    const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24)); 
  
    return diasRestantes > 0 ? `${diasRestantes} días restantes` : "Finalizado";
  };
  

  const data = datos
    ? [
        {
          name: "Progreso",
          "Partidos Jugados": datos.partidosJugados,
          "Partidos Faltantes": datos.partidosFaltantes,
          "Partidos Vencidos Sin Registro": datos.partidosVencidosSinRegistro,
        },
      ]
    : [];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">
        📊 Progreso de {datos?.campeonato_nombre || "Campeonato"}
        <span className="parpadeo-indicador"></span>
      </h2>



      <h3 className="section-title">⏳ Tiempo Restante del Campeonato</h3>
      {datos && (
        <div className="progreso-tiempo-container">
          <p className="fecha-text izquierda">{formatFecha(datos.fecha_inicio_campeonato)}</p>
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
          <p className="fecha-text derecha">{formatFecha(datos.fecha_fin_campeonato)}</p>
        </div>
      )}
      <div className="dashboard-filters">
        <Select
          placeholder="Selecciona una categoría"
          className="dashboard-select"
          onChange={(value) => setCategoriaSeleccionada(value)}
        >
          <Option value="">Todas las categorías</Option> 
          {categorias.map((cat) => (
            <Option key={cat} value={cat}>
              {cat}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Selecciona un género"
          className="dashboard-select"
          onChange={(value) => setGenero(value)}
          value={genero}
        >
          <Option value="Todos">Todos</Option>
          <Option value="V">Varones</Option>
          <Option value="D">Damas</Option>
        </Select>
      </div>

      {datos && (
        <div className="dashboard-summary">
          <Card className="summary-card">
            <h3>Total de Partidos: <span>{datos.totalPartidos}</span></h3>
            <p>✅ Jugados: <strong>{datos.partidosJugados}</strong></p>
            <p>⏳ Faltantes: <strong>{datos.partidosFaltantes}</strong></p>
            <p>⚠️ Vencidos Sin Registro: <strong>{datos.partidosVencidosSinRegistro}</strong></p>
            <p>
              🔴 En Vivo: 
              <strong style={{ marginLeft: "6px", position: "relative" }}>
                {datos.partidosEnCurso}
                <span className="punto-vivo" />
              </strong>
            </p>

            <p>📊 Avance: <strong>{((datos.partidosJugados / datos.totalPartidos) * 100).toFixed(1)}%</strong></p>
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
              dataKey="Partidos Jugados"
              fill="#4d9c5a"
              barSize={30}
              onMouseOver={(e) => {
                if (e && e.target) e.target.setAttribute("height", "40");
              }}
              onMouseOut={(e) => {
                if (e && e.target) e.target.setAttribute("height", "30");
              }}
            />
            <Bar
              dataKey="Partidos Faltantes"
              fill="#e0a800"
              barSize={30}
              onMouseOver={(e) => {
                if (e && e.target) e.target.setAttribute("height", "40");
              }}
              onMouseOut={(e) => {
                if (e && e.target) e.target.setAttribute("height", "30");
              }}
            />
            <Bar
              dataKey="Partidos Vencidos Sin Registro"
              fill="#c82333"
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
        <p className="dashboard-message">Selecciona una categoría para ver el progreso.</p>
      )}

        <div className="report-button-container">
        <button className="boton-reportes" type="primary" onClick={handleVerReportes}><SummarizeIcon/> Ver Otros Reportes</button>
        </div>
    </div>
  );
};

export default DashboardProgresoPartidos;
