import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../assets/css/Reportes/ResumenCampeonato.css';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const COLORS = ['#8884d8', '#82ca9d', '#FFBB28', '#FF8042'];

const ResumenCampeonato = () => {
  const { campeonatoId } = useParams();
  const [resumen, setResumen] = useState({
    totalPartidos: 0,
    totalEquipos: 0,
    totalJugadores: 0
  });

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/reportes/resumen/${campeonatoId}`);
        setResumen(response.data);
      } catch (error) {
        toast.error('Error al obtener el resumen');
        console.error('Error al obtener el resumen:', error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/reportes/edad-genero/${campeonatoId}`);
        setCategorias(response.data.distribucion || []);
      } catch (error) {
        toast.error('Error al obtener la distribución de categorías');
        console.error('Error al obtener las categorías:', error);
        setCategorias([]);
      }
    };

    fetchResumen();
    fetchCategorias();
  }, [campeonatoId]);

  return (
    <div className="resumen-container">
      <h2 className="resumen-titulo">Resumen del Campeonato</h2>

      <div className="resumen-card">
        <h3>Total de Partidos Jugados</h3>
        <p className="resumen-numero">{resumen.totalPartidos}</p>
      </div>

      <div className="resumen-card">
        <h3>Total de Equipos Participantes</h3>
        <p className="resumen-numero">{resumen.totalEquipos}</p>
      </div>

      <div className="resumen-card">
        <h3>Total de Jugadores Registrados</h3>
        <p className="resumen-numero">{resumen.totalJugadores}</p>
      </div>

      <h2 className="resumen-titulo">Distribución de Equipos por Edad y Género</h2>
      {categorias.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categorias}
              dataKey="totalEquipos"
              nameKey="grupoEdad"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ grupoEdad, genero, percent }) =>
                `${grupoEdad} - ${genero} ${(percent * 100).toFixed(0)}%`
              }
            >
              {categorias.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p>Cargando datos o no hay información disponible.</p>
      )}
    </div>
  );
};

export default ResumenCampeonato;

