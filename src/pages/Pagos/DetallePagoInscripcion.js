import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import '../../assets/css/PagosForm.css';

Modal.setAppElement('#root');
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DetallePagoInscripcion = ({ isOpen, onClose, equipoId, campeonatoId }) => {
  const [pagosEquipo, setPagosEquipo] = useState([]);

  useEffect(() => {
    const fetchHistorialPagos = async () => {
      if (!equipoId || !campeonatoId) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/pagos/historial-inscripcion/${campeonatoId}`);
        const pagos = response.data || [];

        const pagosFiltrados = pagos.filter(p => p.equipoId === equipoId);
        setPagosEquipo(pagosFiltrados);
      } catch (error) {
        toast.error('Error al cargar el historial de pagos');
        console.error('Error al cargar historial de pagos:', error);
      }
    };

    fetchHistorialPagos();
  }, [equipoId, campeonatoId]);

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Historial de Pagos de Inscripción"
      className="modal modal-pago"
      overlayClassName="overlay"
    >
      <h2 className="modal-title">Detalle del Pago</h2>

      {pagosEquipo.length === 0 ? (
        <p>No hay pagos registrados para este equipo.</p>
      ) : (
        pagosEquipo.map((pago, idx) => (
          <form key={idx} className="form-pago">
            {/* SECCIÓN: INFORMACIÓN DEL EQUIPO */}
            <div className="form-section">
              <h4 className="section-title">Información del Equipo</h4>

              <div className="form-group">
                <label className="label-pago">Equipo:</label>
                <input type="text" value={pago.equipo} disabled className="input-pago" />
              </div>

              <div className="form-group">
                <label className="label-pago">Categoría:</label>
                <input type="text" value={pago.categoria} disabled className="input-pago" />
              </div>

              <div className="form-group">
                <label className="label-pago">Género:</label>
                <input type="text" value={pago.genero === 'V' ? 'Varones' : 'Damas'} disabled className="input-pago" />
              </div>
            </div>

            {/* SECCIÓN: INFORMACIÓN DEL PAGO */}
            <div className="form-section">
              <h4 className="section-title">Información del Pago</h4>

              <div className="form-group">
                <label className="label-pago">Monto:</label>
                <input type="text" value={`${pago.monto} Bs`} disabled className="input-pago" />
              </div>

              <div className="form-group">
                <label className="label-pago">Fecha:</label>
                <input type="text" value={formatFecha(pago.fecha)} disabled className="input-pago" />
              </div>

              <div className="form-group">
                <label className="label-pago">Referencia:</label>
                <input type="text" value={pago.referencia} disabled className="input-pago" />
              </div>
            </div>
          </form>
        ))
      )}

      <div className="form-buttons">
        <button className="button button-cancel" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default DetallePagoInscripcion;
