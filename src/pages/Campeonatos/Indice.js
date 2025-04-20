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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import rolMapping from '../../constants/roles';
import ConfirmModal from '../../components/ConfirmModal';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL

const Campeonatos = () => {
  const [campeonatos, setCampeonatos] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCampId, setSelectedCampId] = useState(null);
  const [showFechasModal, setShowFechasModal] = useState(false);
  const [fechasCampeonato, setFechasCampeonato] = useState([]);
  const [selectedCampeonatoId, setSelectedCampeonatoId] = useState(null);
  const { user } = useSession();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const handleShowFechas = async (campeonatoId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Campeonatos/obtenerFechas/${campeonatoId}`);
      setFechasCampeonato(response.data.fechas);
      setSelectedCampeonatoId(campeonatoId);
      setShowFechasModal(true);
    } catch (error) {
      toast.error('Error al obtener las fechas del campeonato');
      console.error('Error obteniendo fechas:', error);
    }
  };
  
  const handleCloseFechasModal = () => {
    setShowFechasModal(false);
    setFechasCampeonato([]);
    setSelectedCampeonatoId(null);
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

  const handleGeneratePDF = async (fecha) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/partidos/campeonatoPartidosPDF/${selectedCampeonatoId}?fecha=${fecha}`,
        { responseType: 'blob' } 
      );
  
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      toast.error('Error al generar el PDF');
      console.error('Error generando PDF:', error);
    }
  };

  const handleDeleteCampeonato = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/Campeonatos/delete_campeonato/${selectedCampeonatoId}`);
      toast.success("Campeonato eliminado correctamente");
      setCampeonatos(campeonatos.filter(camp => camp.id !== selectedCampeonatoId)); // Actualizar la lista
    } catch (error) {
      toast.error("Error al eliminar el campeonato");
      console.error("Error al eliminar el campeonato:", error);
    } finally {
      setShowConfirmModal(false);
      setSelectedCampeonatoId(null);
    }
  };
  
  const confirmDeleteCampeonato = (campeonatoId) => {
    setSelectedCampeonatoId(campeonatoId);
    setShowConfirmModal(true);
  };
  
  const hasRole = (...roles) => {
    return user && user.rol && roles.includes(user.rol.nombre);
  }; 

  return (
    <div className="campeonatos-container">
      <h2 className="campeonatos-lista-titulo">Lista de Campeonatos</h2>

      <div className="button-container">
      {hasRole(rolMapping.PresidenteAsociacion) && (
        <button className="table-add-button" onClick={handleRegistrarClick}>
          +1 Campeonato
        </button>
        )}
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

      <ConfirmModal
        visible={showConfirmModal}
        onConfirm={handleDeleteCampeonato}
        onCancel={() => setShowConfirmModal(false)}
        message="¿Estás seguro de que deseas eliminar este campeonato?"
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
                  {hasRole(rolMapping.PresidenteAsociacion) && (
                    <>
                    <button className="buttonex button-edit" onClick={() => handleEditClick(campeonato.id)}>
                      <i className="fas fa-edit"></i>
                    </button>
     
                    </>
                  )}
                    <button 
                      className="buttonex button-fechas" 
                      onClick={() => handleShowFechas(campeonato.id)}>
                      <i className="fas fa-calendar-alt"></i> 
                    </button>
                    {showFechasModal && (
                      <div className="fechas-modal-overlay">
                        <div className="fechas-modal">
                          <h2>Fechas del Campeonato</h2>
                          <button className="fechas-modal-close" onClick={handleCloseFechasModal}>X</button>
                          <ul className="fechas-modal-list">
                            {fechasCampeonato.map((fecha, index) => (
                              <li key={index} className="fechas-modal-item">
                                <span>{moment(fecha).format("DD [de] MMMM, YYYY")}</span>
                                <button 
                                  className="fechas-modal-button"
                                  onClick={() => handleGeneratePDF(fecha)}
                                >
                                  <i > <PictureAsPdfIcon/></i> 
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
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
