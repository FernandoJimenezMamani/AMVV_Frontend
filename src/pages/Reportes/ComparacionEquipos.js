import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import "../../assets/css/Reportes/ComparacionEquipos.css";

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ComparacionEquipos = () => {
  const [campeonatos, setCampeonatos] = useState([]);
  const [campeonatoA, setCampeonatoA] = useState(null);
  const [campeonatoB, setCampeonatoB] = useState(null);
  const [datos, setDatos] = useState([]);

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
    if (campeonatoA && campeonatoB) {
      const fetchDatos = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/reportes/comparar-equipos/${campeonatoA}/${campeonatoB}`);
          setDatos(response.data);
        } catch (error) {
          console.error("Error al obtener la comparación de equipos:", error);
        }
      };
      fetchDatos();
    }
  }, [campeonatoA, campeonatoB]);

  return (
    <div className="comparacion-equipos-container">
      <h2 className="comparacion-equipos-titulo">Comparación de Equipos por Campeonato</h2>

      <div className="comparacion-selects">
        <Select
          className="comparacion-dropdown"
          placeholder="Selecciona el primer campeonato"
          onChange={(value) => setCampeonatoA(value)}
        >
          {campeonatos.map((camp) => (
            <Option key={camp.id} value={camp.id}>
              {camp.nombre}
            </Option>
          ))}
        </Select>

        <Select
          className="comparacion-dropdown"
          placeholder="Selecciona el segundo campeonato"
          onChange={(value) => setCampeonatoB(value)}
        >
          {campeonatos.map((camp) => (
            <Option key={camp.id} value={camp.id}>
              {camp.nombre}
            </Option>
          ))}
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datos} layout="vertical" barSize={50}>
          <XAxis type="number" />
          <YAxis dataKey="campeonato_nombre" type="category" width={150} />
          <Tooltip />
          <Legend />
          <Bar dataKey="total_equipos" fill="#4CAF50" name="Total Equipos" />
        </BarChart>
      </ResponsiveContainer>

      <div className="comparacion-detalle">
        {datos.map((camp) => (
          <p key={camp.campeonato_id}>
            <strong>{camp.campeonato_nombre}:</strong> {camp.total_equipos} equipos
          </p>
        ))}
      </div>
    </div>
  );
};

export default ComparacionEquipos;
