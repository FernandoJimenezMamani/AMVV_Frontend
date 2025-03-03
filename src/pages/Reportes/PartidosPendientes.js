import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import "../../assets/css/Reportes/PartidosPendientes.css";

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PartidosPendientes = () => {
  const [campeonatos, setCampeonatos] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState(null);
  const [datos, setDatos] = useState({
    totalPartidos: 0,
    partidosSinRegistro: 0,
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
      const fetchDatos = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/reportes/pendientes/${selectedCampeonato}`);
          setDatos(response.data);
        } catch (error) {
          console.error("Error al obtener los partidos sin registro:", error);
        }
      };
      fetchDatos();
    }
  }, [selectedCampeonato]);

  const data = [
    { name: "Total Partidos", value: datos.totalPartidos },
    { name: "Pendientes de Registro", value: datos.partidosSinRegistro },
  ];

  return (
    <div className="partidos-pendientes-container">
      <h2 className="partidos-pendientes-titulo">Partidos Pendientes de Registro</h2>

      <Select
        className="partidos-dropdown"
        placeholder="Selecciona un campeonato"
        onChange={(value) => setSelectedCampeonato(value)}
      >
        {campeonatos.map((camp) => (
          <Option key={camp.id} value={camp.id}>
            {camp.nombre}
          </Option>
        ))}
      </Select>

      <div className="partidos-pendientes-card">
        <h3>Total de Partidos: <span className="partidos-numero">{datos.totalPartidos}</span></h3>
        <h3>⚠️ Pendientes de Registro: <span className="partidos-numero">{datos.partidosSinRegistro}</span></h3>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} barSize={60}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#FFBB28" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PartidosPendientes;
