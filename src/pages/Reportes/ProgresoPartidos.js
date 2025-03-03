import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "antd";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../../assets/css/Reportes/ProgresoPartidos.css";

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const COLORS = ["#4CAF50", "#FFC107"];

const ProgresoPartidos = () => {
  const [campeonatos, setCampeonatos] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState(null);
  const [datos, setDatos] = useState({
    totalPartidos: 0,
    partidosJugados: 0,
    partidosFaltantes: 0,
  });

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/campeonatos/select`);
        setCampeonatos(response.data);
      } catch (error) {
        console.error("Error al obtener campeonatos:", error);
      }
    };
    fetchCampeonatos();
  }, []);

  useEffect(() => {
    if (selectedCampeonato) {
      const fetchProgreso = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/reportes/progreso/${selectedCampeonato}`);
          setDatos(response.data);
        } catch (error) {
          console.error("Error al obtener el progreso:", error);
        }
      };
      fetchProgreso();
    }
  }, [selectedCampeonato]);

  const data = [
    { name: "Partidos Jugados", value: datos.partidosJugados },
    { name: "Partidos Faltantes", value: datos.partidosFaltantes },
  ];

  return (
    <div className="progreso-container">
      <h2 className="progreso-titulo">Progreso del Campeonato</h2>

      <Select
        className="reporte-dropdown"
        placeholder="Selecciona un campeonato"
        onChange={(value) => setSelectedCampeonato(value)}
      >
        {campeonatos.map((camp) => (
          <Option key={camp.id} value={camp.id}>
            {camp.nombre}
          </Option>
        ))}
      </Select>

      <div className="progreso-card">
        <h3>Total de Partidos</h3>
        <p className="progreso-numero">{datos.totalPartidos}</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="progreso-detalle">
        <p><strong>✅ Partidos Jugados:</strong> {datos.partidosJugados}</p>
        <p><strong>⏳ Partidos Faltantes:</strong> {datos.partidosFaltantes}</p>
      </div>
    </div>
  );
};

export default ProgresoPartidos;
