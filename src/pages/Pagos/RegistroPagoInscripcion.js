import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/PagosForm.css';
import tipoPagos from '../../constants/pagoTipos';
import estadoPagos from '../../constants/estadoPago';

Modal.setAppElement('#root'); 
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RegistroPagoInscripcion = ({ isOpen, onClose, equipoId }) => {
  const [formData, setFormData] = useState({
    equipo_id: '',
    equipo_nombre: '',
    Categoria: '',
    costo_inscripcion: '',
    genero: '',
    campeonato_id: '',
    campeonato_nombre: '',
    estado_equipo: '',
    nombre_club: '',
    imagen_club: '',
    monto: '',
    fecha_registro: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
    tipo_pago: tipoPagos.Inscripcion,
    referencia: '',
  });

  useEffect(() => {
    const fetchEquipoDebt = async () => {
      if (!equipoId) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/pagos/getEquipoDebtById/${equipoId}`);
        console.log('Response data:', response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
          const equipo = response.data[0];

          setFormData(prevState => ({
            ...prevState,
            equipo_id: equipo.equipo_id,
            equipo_nombre: equipo.equipo_nombre,
            Categoria: equipo.Categoria,
            costo_inscripcion: equipo.costo_inscripcion,
            genero: equipo.genero,
            campeonato_id: equipo.campeonato_id,
            campeonato_nombre: equipo.campeonato_nombre,
            estado_equipo: equipo.estado_equipo,
            nombre_club: equipo.nombre_club,
            imagen_club: equipo.imagen_club,
            monto: equipo.costo_inscripcion,
            referencia: `Inscripción equipo ${equipo.equipo_nombre}, ${equipo.campeonato_nombre}` 
          }));
        } else {
          console.warn('No se encontraron datos para el equipo.');
        }
      } catch (error) {
        toast.error('Error al obtener el equipo');
        console.error('Error al obtener el equipo:', error);
      }
    };

    fetchEquipoDebt();
  }, [equipoId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/pagos/insert`, {
        monto: formData.monto,
        fecha: formData.fecha_registro,
        referencia: formData.referencia,
        tipo_pago: tipoPagos.Inscripcion,
        EquipoId: formData.equipo_id,
        estado: estadoPagos.Efectuado,
        userId: 1 ,
        campeonatoId : formData.campeonato_id
      });

      toast.success('Pago registrado con éxito');
      console.log('Pago creado:', response.data);
      onClose();
    } catch (error) {
      toast.error('Error al registrar el pago');
      console.error('Error en el pago:', error);
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
  <h2 className="modal-title">Registrar Pago de Inscripción</h2>
  <h3 className="modal-subtitle">{formData.campeonato_nombre}</h3>

  <form onSubmit={handleSubmit} className="form-pago">
    {/* Información del equipo */}
    <div className="form-section">
      <h4 className="section-title">Información del Equipo</h4>
      
      <div className="form-group">
        <label className="label-pago">Equipo:</label>
        <input type="text" value={formData.equipo_nombre} disabled className="input-pago" />
      </div>

      <div className="form-group">
        <label className="label-pago">Categoría:</label>
        <input type="text" value={formData.Categoria} disabled className="input-pago" />
      </div>

      <div className="form-group">
        <label className="label-pago">Costo de Inscripción:</label>
        <input type="text" value={formData.costo_inscripcion} disabled className="input-pago" />
      </div>
    </div>

    {/* Información del pago */}
    <div className="form-section">
      <h4 className="section-title">Información del Pago</h4>

      <div className="form-group">
        <label className="label-pago">Monto:</label>
        <input type="number" name="monto" value={formData.monto} disabled className="input-pago" />
      </div>

      <div className="form-group">
        <label className="label-pago">Fecha de Registro:</label>
        <input type="date" name="fecha_registro" value={formData.fecha_registro} disabled className="input-pago" />
      </div>

      <div className="form-group">
        <label className="label-pago">Referencia:</label>
        <input type="text" name="referencia"  value={formData.referencia}  onChange={handleChange} className="input-pago" disabled required />
      </div>
    </div>

    {/* Botones */}
    <div className="form-buttons">
      <button type="button" className="button button-cancel" onClick={onClose}>
        Cancelar
      </button>
      <button type="submit" className="button button-primary">
        Registrar Pago
      </button>
    </div>
  </form>
</Modal>

  );
};

export default RegistroPagoInscripcion;
