import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../assets/css/TablaPosiciones.css'; 

const ListaEquipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const { categoriaId, campeonatoId } = useParams(); 

  useEffect(() => {
    const fetchTitulo = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/Campeonatos/get_campeonato_categoria/${campeonatoId}/${categoriaId}`);
        setTitulo(`${response.data.campeonato_nombre} - ${response.data.categoria_nombre}`);
      } catch (error) {
        console.error('Error al obtener el título:', error);
      }
    };

    const fetchEquipos = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/posiciones/get_positions/${categoriaId}/${campeonatoId}`);
        setEquipos(response.data);
      } catch (error) {
        console.error('Error al obtener los equipos:', error);
      }
    };

    fetchTitulo();
    fetchEquipos();
  }, [categoriaId, campeonatoId]);

  return (
    <div className="clubes-lista">
      <h2 className="clubes-lista-titulo">{titulo}</h2>
      <table className="clubes-lista-tabla">
        <thead className="clubes-lista-thead">
          <tr>
            <th></th>
            <th>Equipo</th>
            <th>PJ</th>
            <th>PG</th>
            <th>PP</th>
            <th>SF</th>
            <th>SC</th>
            <th>DS</th>
            <th>PF</th>
            <th>PC</th>
            <th>DP</th>
            <th>PTS</th>
          </tr>
        </thead>
        <tbody>
          {equipos.map((equipo) => (
            <tr key={equipo.equipo_id}>
              <td><img src={equipo.escudo} alt={`${equipo.nombre} logo`} className="club-logo-table"/></td>
              <td>{equipo.equipo_nombre}</td>
              <td>{equipo.partidos_jugados}</td>
              <td>{equipo.partidos_ganados}</td>
              <td>{equipo.partidos_perdidos}</td>
              <td>{equipo.sets_a_favor}</td>
              <td>{equipo.sets_en_contra}</td>
              <td>{equipo.diferencia_sets}</td>
              <td>{equipo.puntos_a_favor}</td>
              <td>{equipo.puntos_en_contra}</td>
              <td>{equipo.diferencia_puntos}</td>
              <td>{equipo.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaEquipos;
