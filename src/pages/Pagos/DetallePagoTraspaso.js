import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../assets/css/PagosForm.css';

Modal.setAppElement('#root');
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DetallePagoTraspaso = ({ isOpen, onClose, traspasoId, campeonatoId }) => {
  const [pago, setPago] = useState(null);

  useEffect(() => {
    const fetchPagoTraspaso = async () => {
      if (!traspasoId || !campeonatoId) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/pagos/historial-traspasos/${campeonatoId}`);
        const pagos = response.data || [];

        const encontrado = pagos.find(p => p.traspaso_id === traspasoId);

        setPago(encontrado || null);
      } catch (error) {
        toast.error('Error al obtener el pago de traspaso');
        console.error('Error:', error);
      }
    };

    fetchPagoTraspaso();
  }, [traspasoId, campeonatoId]);

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!pago) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Detalle de Pago de Traspaso"
      className="modal modal-pago"
      overlayClassName="overlay"
    >
      <h2 className="modal-title">Detalle de Pago de Traspaso</h2>
      <h3 className="modal-subtitle">{pago.nombre_campeonato}</h3>

      <form className="form-pago">
        {/* Jugador */}
        <div className="form-section">
          <h4 className="section-title">Información del Jugador</h4>
          <div className="form-group">
            <label className="label-pago">Nombre:</label>
            <input type="text" value={`${pago.jugador_nombre} ${pago.jugador_apellido}`} disabled className="input-pago" />
          </div>
          <div className="form-group">
            <label className="label-pago">CI:</label>
            <input type="text" value={pago.jugador_ci} disabled className="input-pago" />
          </div>
        </div>

        {/* Origen */}
        <div className="form-section">
          <h4 className="section-title">Club de Origen</h4>
          <div className="form-group">
            <label className="label-pago">Club:</label>
            <input type="text" value={pago.club_origen_nombre} disabled className="input-pago" />
          </div>
          <div className="form-group">
            <label className="label-pago">Presidente:</label>
            <input type="text" value={`${pago.nombre_presi_club_origen} ${pago.apellido_presi_club_origen}`} disabled className="input-pago" />
          </div>
        </div>

        {/* Destino */}
        <div className="form-section">
          <h4 className="section-title">Club de Destino</h4>
          <div className="form-group">
            <label className="label-pago">Club:</label>
            <input type="text" value={pago.club_destino_nombre} disabled className="input-pago" />
          </div>
          <div className="form-group">
            <label className="label-pago">Presidente:</label>
            <input type="text" value={`${pago.nombre_presi_club_dest} ${pago.apellido_presi_club_dest}`} disabled className="input-pago" />
          </div>
        </div>

        {/* Pago */}
        <div className="form-section">
          <h4 className="section-title">Información del Pago</h4>
          <div className="form-group">
            <label className="label-pago">Monto:</label>
            <input type="text" value={`${pago.monto_real} Bs`} disabled className="input-pago" />
          </div>
          <div className="form-group">
            <label className="label-pago">Fecha:</label>
            <input type="text" value={formatFecha(pago.pago_fecha)} disabled className="input-pago" />
          </div>
          <div className="form-group">
            <label className="label-pago">Referencia:</label>
            <textarea value={pago.pago_referencia} disabled className="textarea-pago" />
          </div>
        </div>

        <div className="form-buttons">
          <button className="button button-cancel" onClick={onClose}>Cerrar</button>
        </div>
      </form>
    </Modal>
  );
};

export default DetallePagoTraspaso;
