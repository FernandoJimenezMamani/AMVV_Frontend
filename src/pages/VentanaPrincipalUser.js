import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Reportes/DashboardProgresoPartidos";
import Reportes from "./Reportes/Reportes";
import TransaccionDashboard from "./Reportes/DashboardMonitoreoEquipos"; // Nuevo componente para estado 1
import { toast } from "react-toastify";
import { useSession } from '../context/SessionContext';
import rolMapping from '../constants/roles';
import InicioPresidente from "./PresidenteClub/InicioPresidente";
import VistaDefault from "./VistaDefault";
import InicioJugador from "./Jugadores/InicioJugador";
import "../assets/css/Inicio.css"; // Asegúrate de tener este archivo CSS para estilos

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL

const VentanaPrincipalUser = () => {
  const [campeonatoEnCurso, setCampeonatoEnCurso] = useState(null);
  const [campeonatoEnTransaccion, setCampeonatoEnTransaccion] = useState(null);
  const [campeonatoActivo, setCampeonatoActivo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useSession();

  const connectWebSocket = () => {
    const socket = new WebSocket(WEBSOCKET_URL);
  
    socket.onopen = () => {
      console.log('WebSocket conectado');
    };
  
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Mensaje recibido:', data);
    
        // Verificar que sea una actualización de estados
        if (data.type === 'estado_campeonato_actualizado' && Array.isArray(data.cambios)) {
          fetchCampeonatoActivo();
          setCampeonatos((prevCampeonatos) =>
            prevCampeonatos.map((campeonato) => {
              const cambio = data.cambios.find((c) => c.id === campeonato.id);
              return cambio ? { ...campeonato, estado: cambio.nuevoEstado } : campeonato;
            })
          );
        }
      } catch (error) {
        console.error('Error procesando el mensaje del WebSocket:', error);
      }
    };
  
    socket.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };
  
    socket.onclose = (event) => {
      console.log('WebSocket desconectado. Código:', event.code);
      // Intentar reconectar si el cierre no fue intencional (código distinto a 1000 o 1001)
      if (event.code !== 1000 && event.code !== 1001) {
        setTimeout(() => {
          console.log('Reintentando conexión WebSocket...');
          connectWebSocket(); // Reconectar
        }, 5000); // Intentar reconectar después de 5 segundos
      }
    };
  
    return socket;
  };

   useEffect(() => {
      const socket = connectWebSocket();
      return () => socket.close();
    }, []);

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        // Obtener campeonato en curso (estado = 2)
        const responseCurso = await axios.get(`${API_BASE_URL}/campeonatos/obtenerCampeonatosEnCurso/EnCurso`);
        setCampeonatoEnCurso(responseCurso.data || null);

        // Obtener campeonato en transacción (estado = 1)
        const responseTransaccion = await axios.get(`${API_BASE_URL}/campeonatos/obtenerCampeonatosEnTransaccion/EnTransaccion`);
        setCampeonatoEnTransaccion(responseTransaccion.data || null);
        
      } catch (error) {
        toast.error("Error al verificar los campeonatos");
        setCampeonatoEnCurso(null);
        setCampeonatoEnTransaccion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCampeonatos();
    fetchCampeonatoActivo();
  }, []);

  const fetchCampeonatoActivo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/campeonatos/obtenerCampeonatoActivo/activo`);
      setCampeonatoActivo(response.data);
      console.log("Campeonato activo:", response.data);
    } catch (error) {
      setCampeonatoActivo(null);
    }
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  const hasRole = (...roles) => {
    return user && user.rol && roles.includes(user.rol.nombre);
  };  

  const mostrarInfoCampeonato = (user) => {
    if (!user?.rol?.nombre) return false;
    return ![rolMapping.PresidenteAsociacion, rolMapping.Tesorero].includes(user.rol.nombre);
  };
  
  const sumarHoras = (fecha, horas) => {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setHours(nuevaFecha.getHours() + horas);
    return nuevaFecha;
  };
  
  const getTextoFecha = (campeonato) => {
    const ahora = new Date();
  
    const inicioTrans = sumarHoras(new Date(campeonato.fecha_inicio_transaccion), 4);
    const finTrans = sumarHoras(new Date(campeonato.fecha_fin_transaccion), 4);
    const inicioCamp = sumarHoras(new Date(campeonato.fecha_inicio_campeonato), 4);
    const finCamp = sumarHoras(new Date(campeonato.fecha_fin_campeonato), 4);
  
    if (ahora < inicioTrans) {
      return `La etapa de transacción inicia el ${inicioTrans.toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
    } else if (ahora >= inicioTrans && ahora < finTrans) {
      return `La etapa de transacción finaliza el ${finTrans.toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
    } else if (ahora >= finTrans && ahora < inicioCamp) {
      return `El campeonato inicia el ${inicioCamp.toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
    } else if (ahora >= inicioCamp && ahora < finCamp) {
      return `El campeonato finaliza el ${finCamp.toLocaleDateString("es-ES", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
    }
  
    return null;
  };

  return (
    <div className="inicio-container">
      {campeonatoActivo && mostrarInfoCampeonato(user) && (
        <div className="info-campeonato">
          <h3>{campeonatoActivo.nombre}</h3>
          <p>{getTextoFecha(campeonatoActivo)}</p>
        </div>
      )}

      {(hasRole(rolMapping.PresidenteAsociacion) || hasRole(rolMapping.Tesorero)) && (
        campeonatoEnTransaccion ? (
          <TransaccionDashboard campeonato={campeonatoEnTransaccion} />
        ) : hasRole(rolMapping.PresidenteAsociacion) && campeonatoEnCurso ? (
          <Dashboard campeonato={campeonatoEnCurso} />
        ) : hasRole(rolMapping.PresidenteAsociacion) ? (
          <Reportes />
        ) : null
      )}

      {(hasRole(rolMapping.PresidenteClub) || hasRole(rolMapping.DelegadoClub))&& (
        <>
        <InicioPresidente presidenteId ={user.id}></InicioPresidente>
        </>
       
      )}
      {(hasRole(rolMapping.Jugador) )&& (
        <>
        <InicioJugador jugadorId ={user.id}></InicioJugador>
        </>
       
      )}
      {!hasRole(rolMapping.PresidenteAsociacion) && 
       !hasRole(rolMapping.PresidenteClub) && (
        <VistaDefault />
      )}
    </div>
  );
};

export default VentanaPrincipalUser;
