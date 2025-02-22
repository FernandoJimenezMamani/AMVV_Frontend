import React, { useEffect, useState, useCallback  } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../assets/css/TablaPosiciones.css'; 
import { toast } from 'react-toastify';
import estadosMapping from '../constants/campeonatoEstados';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL

const ListaEquipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [titulo, setTitulo] = useState('');
  const { categoriaId, campeonatoId } = useParams();
  const [estadoCampeonato, setEstadoCampeonato] = useState(null); 

  const fetchTitulo = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Campeonatos/get_campeonato_categoria/${campeonatoId}/${categoriaId}`);
      console.log('response', response);
      setTitulo(`${response.data.campeonato_nombre} - ${response.data.categoria_nombre}`);
      setEstadoCampeonato(response.data.estado); 
    } catch (error) {
      toast.error('Error al obtener el título');
      console.error('Error al obtener el título:', error);
    }
  }, [campeonatoId, categoriaId]);

  // Función para obtener los equipos (tabla de posiciones)
  const fetchEquipos = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Campeonatos/get_campeonato_posiciones/${categoriaId}/${campeonatoId}`);
      setEquipos(response.data);
    } catch (error) {
      toast.error('Error al obtener los equipos');
      console.error('Error al obtener los equipos:', error);
    }
  }, [campeonatoId, categoriaId]);

  useEffect(() => {
    fetchTitulo();
    fetchEquipos();
  }, [fetchTitulo, fetchEquipos]);

  useEffect(() => {
    if (!campeonatoId || !categoriaId) {
      return;
    }
  
    const websocketURL = `${WEBSOCKET_URL}/tablaposiciones/${campeonatoId}/${categoriaId}`;
  
    const ws = new WebSocket(websocketURL);
  
    ws.onopen = () => {
      console.log('✅ Conexión WebSocket establecida:', websocketURL);
    };
  
    ws.onmessage = (event) => {
      try {
        const mensaje = JSON.parse(event.data);
  
        if (mensaje.type === "actualizacion_estados") {
          console.log('🔄 Actualización detectada, refrescando equipos');
          fetchEquipos();
        }
      } catch (error) {
        console.error('❌ Error al procesar mensaje de WebSocket:', error);
      }
    };
  
    ws.onerror = (error) => {
      console.error('⚠️ Error en WebSocket:', error);
    };
  
    ws.onclose = () => {
      console.log('🔴 Conexión WebSocket cerrada');
    };
  
    return () => {
      ws.close();
    };
  }, [campeonatoId, categoriaId, fetchEquipos]);
  

  return (
    <div className="clubes-lista">
      <h2 className="clubes-lista-titulo">{titulo}</h2>
      {estadoCampeonato === 2 && (
          <div className="campeonato-en-curso">
            <span className="status-indicator"></span> En curso
          </div>
        )}
      <table className="clubes-lista-tabla">
        <thead className="clubes-lista-thead">
          <tr>
            <th className="table-positions-th">Posicion</th>
            <th className="table-positions-th">Equipo</th>
            <th className="table-positions-th">PJ</th>
            <th className="table-positions-th">PG</th>
            <th className="table-positions-th">PP</th>
            <th className="table-positions-th">SF</th>
            <th className="table-positions-th">SC</th>
            <th className="table-positions-th">DS</th>
            <th className="table-positions-th">PF</th>
            <th className="table-positions-th">PC</th>
            <th className="table-positions-th">DP</th>
            <th className="table-positions-th">PTS</th>
          </tr>
        </thead>
        <tbody>
          {equipos.map((equipo, index) => (
            <tr key={equipo.equipo_id}>
              <td className="table-positions-td">{index + 1}</td> 
              <td className="table-positions-td">
                <div className="equipo-container"> 
                  <img src={equipo.escudo} alt={`${equipo.nombre} logo`} className="club-logo-table"/>
                  {equipo.equipo_nombre}
                </div>
              </td>
              <td className="table-positions-td">{equipo.partidos_jugados}</td>
              <td className="table-positions-td">{equipo.partidos_ganados}</td>
              <td className="table-positions-td">{equipo.partidos_perdidos}</td>
              <td className="table-positions-td">{equipo.sets_a_favor}</td>
              <td className="table-positions-td">{equipo.sets_en_contra}</td>
              <td className="table-positions-td">{equipo.diferencia_sets}</td>
              <td className="table-positions-td">{equipo.puntos_a_favor}</td>
              <td className="table-positions-td">{equipo.puntos_en_contra}</td>
              <td className="table-positions-td">{equipo.diferencia_puntos}</td>
              <td className="table-positions-td">{equipo.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaEquipos;
