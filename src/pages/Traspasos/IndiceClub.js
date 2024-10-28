import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Tabs } from 'antd';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';

const IndiceClub = () => {
  const [enviados, setEnviados] = useState([]);
  const [recibidos, setRecibidos] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("enviados");

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const clubJugador_id = sessionStorage.getItem('clubJugador_id');
        const clubPresidente_id = sessionStorage.getItem('clubPresidente_id');

        const club_id = clubPresidente_id || clubJugador_id;

        if (!token) {
          toast.error('No se encontró el token de autenticación');
          return;
        }
        if (!club_id) {
          toast.error('No se encontró el ID del club');
          return;
        }

        // Fetch Enviados
        const responseEnviados = await axios.get(`http://localhost:5002/api/traspaso/club/enviados/${club_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setEnviados(responseEnviados.data);

        // Fetch Recibidos
        const responseRecibidos = await axios.get(`http://localhost:5002/api/traspaso/club/recibidos/${club_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setRecibidos(responseRecibidos.data);
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

  // Función para convertir el estado de aprobación a texto legible
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
      <h2 className="clubes-lista-titulo">Solicitudes de Traspaso - Club</h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Enviados" key="enviados">
          <table className="clubes-lista-tabla">
            <thead>
              <tr>
                <th>Jugador</th>
                <th>Club Origen</th>
                <th>Club Destino</th>
                <th>Fecha de Solicitud</th>
                <th>Estado Jugador</th>
                <th>Estado Club</th>
              </tr>
            </thead>
            <tbody>
              {enviados.map((solicitud) => (
                <tr key={solicitud.id}>
                  <td>{solicitud.jugador && solicitud.jugador.persona 
                    ? `${solicitud.jugador.persona.nombre} ${solicitud.jugador.persona.apellido}` 
                    : 'Sin Jugador'}
                  </td>
                  <td>{solicitud.clubOrigen ? solicitud.clubOrigen.nombre : 'Sin Club Origen'}</td>
                  <td>{solicitud.clubDestino ? solicitud.clubDestino.nombre : 'Sin Club Destino'}</td>
                  <td>{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</td>
                  <td>{getEstadoTexto(solicitud.aprobado_por_jugador)}</td>
                  <td>{getEstadoTexto(solicitud.aprobado_por_club)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Recibidos" key="recibidos">
          <table className="clubes-lista-tabla">
            <thead>
              <tr>
                <th>Jugador</th>
                <th>Club Origen</th>
                <th>Club Destino</th>
                <th>Fecha de Solicitud</th>
                <th>Estado Jugador</th>
                <th>Estado Club</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {recibidos.map((solicitud) => (
                <tr key={solicitud.id}>
                  <td>{solicitud.jugador && solicitud.jugador.persona 
                    ? `${solicitud.jugador.persona.nombre} ${solicitud.jugador.persona.apellido}` 
                    : 'Sin Jugador'}
                  </td>
                  <td>{solicitud.clubOrigen ? solicitud.clubOrigen.nombre : 'Sin Club Origen'}</td>
                  <td>{solicitud.clubDestino ? solicitud.clubDestino.nombre : 'Sin Club Destino'}</td>
                  <td>{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</td>
                  <td>{getEstadoTexto(solicitud.aprobado_por_jugador)}</td>
                  <td>{getEstadoTexto(solicitud.aprobado_por_club)}</td>
                  <td>
                    <button onClick={() => handleVerDetalle(solicitud.id)}>Ver Detalle</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default IndiceClub;
