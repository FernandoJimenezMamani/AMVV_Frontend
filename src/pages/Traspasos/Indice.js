import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';

const Indice = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          toast.error('No se encontró el token de autenticación');
          return;
        }

        const response = await axios.get(`http://localhost:5002/api/traspaso/jugador`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setSolicitudes(response.data);
      } catch (error) {
        toast.error('Error al obtener las solicitudes de traspaso');
        console.error('Error al obtener solicitudes de traspaso:', error);
      }
    };

    fetchSolicitudes();
  }, []);

  const handleVerDetalle = (solicitudId) => {
    navigate(`/traspasos/detalle/${solicitudId}`);
  };

  // Función para convertir los valores a los estados correspondientes
  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'P':
        return 'Pendiente';
      case 'S':
        return 'Aceptado';
      case 'R':
        return 'Rechazado';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="clubes-lista">
      <h2 className="clubes-lista-titulo">Solicitudes de Traspaso</h2>
      <table className="clubes-lista-tabla">
        <thead>
          <tr>
            <th>Club Origen</th>
            <th>Club Destino</th>
            <th>Fecha de Solicitud</th>
            <th>Estado Jugador</th>
            <th>Estado Club</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {solicitudes.map((solicitud) => (
            <tr key={solicitud.id}>
              <td>{solicitud.clubOrigen ? solicitud.clubOrigen.nombre : 'Sin Club Origen'}</td>
              <td>{solicitud.clubDestino ? solicitud.clubDestino.nombre : 'Sin Club Destino'}</td>
              <td>{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</td>
              <td>{getEstadoTexto(solicitud.aprobado_por_jugador)}</td>
              <td>{getEstadoTexto(solicitud.aprobado_por_club)}</td>
              <td>
                {solicitud.estado_solicitud === 'PENDIENTE' ? (
                  <button onClick={() => handleVerDetalle(solicitud.id)}>Ver Detalle</button>
                ) : solicitud.estado_solicitud === 'RECHAZADO' ? (
                  <span>No disponible</span>
                ) : (
                  <button onClick={() => handleVerDetalle(solicitud.id)}>Ver Detalle</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Indice;
