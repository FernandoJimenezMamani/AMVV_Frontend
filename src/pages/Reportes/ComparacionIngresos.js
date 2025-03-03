import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import "../../assets/css/Reportes/ComparacionIngresos.css";

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ComparacionIngresos = () => {
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
          const response = await axios.get(`${API_BASE_URL}/reportes/comparar-ingresos/${campeonatoA}/${campeonatoB}`);
          setDatos(response.data);
        } catch (error) {
          console.error("Error al obtener la comparación de ingresos:", error);
        }
      };
      fetchDatos();
    }
  }, [campeonatoA, campeonatoB]);

  return (
    <div className="comparacion-ingresos-container">
      <h2 className="comparacion-ingresos-titulo">Comparación de Ingresos por Campeonato</h2>

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
        <BarChart data={datos} barSize={50}>
          <XAxis dataKey="campeonato_nombre" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend />
          <Bar dataKey="total_ingresos" fill="#FF5733" name="Total Ingresos ($)" />
        </BarChart>
      </ResponsiveContainer>

      <div className="comparacion-detalle">
        {datos.map((camp) => (
          <p key={camp.campeonato_id}>
            <strong>{camp.campeonato_nombre}:</strong> ${camp.total_ingresos.toFixed(2)}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ComparacionIngresos;
