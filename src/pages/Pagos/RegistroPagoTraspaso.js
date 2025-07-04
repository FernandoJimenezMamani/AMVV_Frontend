import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/PagosForm.css';
import tipoPagos from '../../constants/pagoTipos';
import estadoPagos from '../../constants/estadoPago';
import { set } from 'date-fns';

Modal.setAppElement('#root'); 
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RegistroPagoTraspaso = ({ isOpen, onClose, traspasoId, onTraspasoCreated }) => {
  const [formData, setFormData] = useState({
    traspaso_id: '',
    club_origen_id: '',
    club_origen_nombre: '',
    club_destino_id: '',
    club_destino_nombre: '',
    jugador_id: '',
    jugador_persona_id: '',
    jugador_ci: '',
    jugador_nombre: '',
    jugador_apellido: '',
    jugador_fecha_nacimiento: '',
    id_persona_presi_det: '',
    nombre_presi_club_dest: '',
    apellido_presi_club_dest: '',
    id_persona_presi_origen : '' ,
    nombre_presi_club_origen: '',
    apellido_presi_club_origen: '', // Fecha actual en formato YYYY-MM-DD
    nombre_campeonato: '',
    costo_traspaso: '',
    fecha_registro: new Date().toISOString().split('T')[0],
    tipo_pago: tipoPagos.Traspaso,
    referencia: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEquipoDebt = async () => {
      if (!traspasoId) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/pagos/getTraspasoDebtById/${traspasoId}`);
        console.log('Response data:', response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
          const traspaso = response.data[0];

          setFormData(prevState => ({
            ...prevState,
            traspaso_id: traspaso.traspaso_id,
            club_origen_id: traspaso.club_origen_id,
            club_origen_nombre: traspaso.club_origen_nombre,
            club_destino_id: traspaso.club_destino_id,
            club_destino_nombre: traspaso.club_destino_nombre,
            jugador_id: traspaso.jugador_id,
            jugador_persona_id:traspaso.jugador_persona_id,
            jugador_nombre: traspaso.jugador_nombre,
            jugador_apellido: traspaso.jugador_apellido,
            jugador_fecha_nacimiento: traspaso.jugador_fecha_nacimiento,
            id_persona_presi_det : traspaso.id_persona_presi_det,
            nombre_presi_club_dest: traspaso.nombre_presi_club_dest,
            apellido_presi_club_dest: traspaso.apellido_presi_club_dest,
            id_persona_presi_origen: traspaso.id_persona_presi_origen,
            nombre_presi_club_origen: traspaso.nombre_presi_club_origen,
            apellido_presi_club_origen: traspaso.apellido_presi_club_origen,
            nombre_campeonato: traspaso.nombre_campeonato,
            costo_traspaso: traspaso.costo_traspaso,
            jugador_ci: traspaso.jugador_ci,
            referencia: `Pago por traspaso de jugador ${traspaso.jugador_nombre} ${traspaso.jugador_apellido} del club ${traspaso.club_origen_nombre} al club ${traspaso.club_destino_nombre}` 
          }));
        } else {
          console.warn('No se encontraron datos para el traspaso.');
        }
      } catch (error) {
        toast.error('Error al obtener el traspaso');
        console.error('Error al obtener el traspaso:', error);
      }
    };

    fetchEquipoDebt();
  }, [traspasoId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log( formData.monto , 'dinero')
      const response = await axios.post(`${API_BASE_URL}/pagos/insertPagoTraspaso`, {
        monto: formData.monto ?? 100,
        fecha: formData.fecha_registro,
        referencia: formData.referencia,
        tipo_pago: tipoPagos.Traspaso,
        traspaso_id: formData.traspaso_id,
        estado: estadoPagos.Efectuado,
        userId: 1 ,
        campeonatoId : formData.campeonato_id,
        jugador_id: formData.jugador_id,
        jugador_traspaso_id : formData.jugador_persona_id,
        club_destino_id : formData.club_destino_id,
        jugador_nombre : formData.jugador_nombre,
        jugador_apellido : formData.jugador_apellido,
        jugador_ci : formData.jugador_ci,
        jugador_fecha_nacimiento : formData.jugador_fecha_nacimiento,
        nombre_campeonato : formData.nombre_campeonato,
        club_origen_nombre : formData.club_origen_nombre,
        club_destino_nombre : formData.club_destino_nombre,
        id_persona_presi_origen : formData.id_persona_presi_origen,
        nombre_presi_club_origen : formData.nombre_presi_club_origen,
        apellido_presi_club_origen : formData.apellido_presi_club_origen,
        id_persona_presi_det : formData.id_persona_presi_det,
        nombre_presi_club_dest : formData.nombre_presi_club_dest,
        apellido_presi_club_dest : formData.apellido_presi_club_dest
      });

      toast.success('Pago registrado con éxito');
      onClose();
      onTraspasoCreated();
    } catch (error) {
      toast.error('Error al registrar el pago');
      console.error('Error en el pago:', error);
    } finally{
      setIsLoading(false);
    }
  };

  return (
    <Modal
  isOpen={isOpen}
  onRequestClose={onClose}
  contentLabel="Registrar Pago de Inscripción"
  className="modal modal-pago"
  overlayClassName="overlay"
>
  <h2 className="modal-title">Registrar Pago de Traspaso</h2>
  <h3 className="modal-subtitle">{formData.nombre_campeonato}</h3>

  <form onSubmit={handleSubmit} className="form-pago">
    {/* Información del equipo */}

    <div className="form-section">
      <h4 className="section-title">Información del jugador</h4>
      
      <div className="form-group">
        <label className="label-pago">Nombre:</label>
        <input type="text" value={`${formData.jugador_nombre} ${formData.jugador_apellido}`} disabled className="input-pago" />
      </div>

      <div className="form-group">
        <label className="label-pago">Carnet de Identidad :</label>
        <input type="text" value={`${formData.jugador_ci}`} disabled className="input-pago" />
      </div>

    </div>
    <div className="form-section">
      <h4 className="section-title">Información del Equipo Solicitado</h4>
      
      <div className="form-group">
        <label className="label-pago">Equipo:</label>
        <input type="text" value={formData.club_origen_nombre} disabled className="input-pago" />
      </div>

      <div className="form-group">
        <label className="label-pago">Presidente:</label>
        <input type="text" value={`${formData.nombre_presi_club_origen} ${formData.apellido_presi_club_origen}`} disabled className="input-pago" />
      </div>

    </div>

    <div className="form-section">
      <h4 className="section-title">Información del Equipo Solicitante</h4>
      
      <div className="form-group">
        <label className="label-pago">Equipo:</label>
        <input type="text" value={formData.club_destino_nombre} disabled className="input-pago" />
      </div>

      <div className="form-group">
        <label className="label-pago">Presidente:</label>
        <input type="text" value={`${formData.nombre_presi_club_dest} ${formData.apellido_presi_club_dest}`} disabled className="input-pago" />
      </div>

    </div>

    {/* Información del pago */}
    <div className="form-section">
      <h4 className="section-title">Información del Pago</h4>

      <div className="form-group">
        <label className="label-pago">Monto:</label>
        <input type="number" name="monto" value={formData.costo_traspaso} disabled className="input-pago" />
      </div>

      <div className="form-group">
        <label className="label-pago">Fecha de Registro:</label>
        <input type="date" name="fecha_registro" value={formData.fecha_registro} disabled className="input-pago" />
      </div>

      <div className="form-group">
        <label className="label-pago">Referencia:</label>
        <textarea 
            name="referencia"  
            value={formData.referencia}  
            onChange={handleChange} 
            className="textarea-pago" 
            disabled 
            required
        />
      </div>
    </div>

    {/* Botones */}
    <div className="form-buttons">
      <button type="button" className="button button-cancel" onClick={onClose} disabled={isLoading} >
        Cancelar
      </button>
      <button type="submit" className="button button-primary" disabled={isLoading}>
        {isLoading ? <span className="spinner"></span> : "Registrar Pago"}
      </button>
    </div>
  </form>
</Modal>

  );
};

export default RegistroPagoTraspaso;
