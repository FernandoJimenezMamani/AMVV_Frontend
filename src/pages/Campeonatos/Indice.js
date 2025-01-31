import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/css/Campeonato/Indice.css';
import { useSession } from '../../context/SessionContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import RegistroCampeonato from './Registrar';
import EditarCampeonato from './Editar';
import moment from "moment";
import "moment/locale/es"; 
import campeonatoEstado from '../../constants/campeonatoEstados';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Campeonatos = () => {
  const [campeonatos, setCampeonatos] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCampId, setSelectedCampId] = useState(null);
  const { user } = useSession();
  const navigate = useNavigate();

  const connectWebSocket = () => {
    const socket = new WebSocket('ws://localhost:5002');
  
    socket.onopen = () => {
      console.log('WebSocket conectado');
    };
  
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Mensaje recibido:', data);
    
        // Verificar que sea una actualización de estados
        if (data.type === 'actualizacion_estados' && Array.isArray(data.cambios)) {
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
    fetchCampeonatos();
    const socket = connectWebSocket();
    return () => socket.close();
  }, []);

  const fetchCampeonatos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Campeonatos/select`);
      setCampeonatos(response.data);
    } catch (error) {
      toast.error('Error al obtener los campeonatos');
      console.error('Error al obtener los campeonatos:', error);
    }
  };

  const handleRegistrarClick = () => {
    setShowFormModal(true);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
  };

  const handleEditClick = (campId) => {
    setSelectedCampId(campId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedCampId(null);
  };

  const handleViewDetails = (id) => {
    navigate(`/categorias/indice/${id}`);
  };

  return (
    <div className="campeonatos-container">
      <h2 className="campeonatos-lista-titulo">Lista de Campeonatos</h2>

      <div className="button-container">
        <button className="table-add-button" onClick={handleRegistrarClick}>
          +1 Campeonato
        </button>
      </div>

      <RegistroCampeonato
        isOpen={showFormModal}
        onClose={handleCloseModal}
        onCampCreated={fetchCampeonatos}
      />
      <EditarCampeonato
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        campId={selectedCampId}
        onCampEdited={fetchCampeonatos}
      />

      <div className="cards-wrapper">
        {campeonatos.map((campeonato) => (
          <div key={campeonato.id} className="campeonato-card">
            {/* Indicador de estado del campeonato */}
            <div className="campeonato-estado">
              {campeonato.estado === campeonatoEstado.transaccionProceso ? (
                <div className="estado-en-preparacion">
                  <span className="punto-verde"></span>
                  <span>Preparación</span>
                </div>
              ) : campeonato.estado === campeonatoEstado.campeoantoEnCurso ? (
                <div className="estado-en-curso">
                  <span className="punto-verde"></span>
                  <span>En curso</span>
                </div>
              ) : campeonato.estado === campeonatoEstado.enEspera ? (
                <div className="estado-en-espera">
                  <span className="punto-verde"></span>
                  <span>En espera</span>
                </div>
              ): (
                <div className="estado-finalizado">
                  <span className="punto-rojo"></span>
                  <span>Finalizado</span>
                </div>
              )}
            </div>


            <h2 className="campeonato-nombre">{campeonato.nombre}</h2>
            <p className="campeonato-transaccion">
              <strong>Inicio de movimientos y transacciones:</strong>{" "}
              {moment.parseZone(campeonato.fecha_inicio_transaccion).format("DD [de] MMMM, YYYY HH:mm [hrs]")}
              <br />
              <strong>Fin de movimientos y transacciones:</strong>{" "}
              {moment.parseZone(campeonato.fecha_fin_transaccion).format("DD [de] MMMM, YYYY HH:mm [hrs]")}
            </p>
            <p className="campeonato-fecha">
              <strong>Inicio Campeonato:</strong>{" "}
              {moment.parseZone(campeonato.fecha_inicio_campeonato).format("DD [de] MMMM, YYYY HH:mm [hrs]")}
              <br />
              <strong>Fin del campeonato:</strong>{" "}
              {moment.parseZone(campeonato.fecha_fin_campeonato).format("DD [de] MMMM, YYYY HH:mm [hrs]")}
            </p>
            <div className="campeonato-buttons">
              <button className="buttonex button-view" onClick={() => handleViewDetails(campeonato.id)}>
                <i className="fas fa-eye"></i>
              </button>
              {(campeonato.estado === campeonatoEstado.campeoantoEnCurso || 
                campeonato.estado === campeonatoEstado.transaccionProceso || 
                campeonato.estado === campeonatoEstado.enEspera ) && (
                  <>
                    <button className="buttonex button-edit" onClick={() => handleEditClick(campeonato.id)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="buttonex button-delete">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campeonatos;
