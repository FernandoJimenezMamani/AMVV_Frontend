import React, { useState } from 'react';
import axios from 'axios';
import { DatePicker, TimePicker } from 'antd';
import moment from 'moment';
import Modal from 'react-modal';
import '../../assets/css/registroModal.css';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

Modal.setAppElement('#root'); 

const RegistroCampeonato = ({ isOpen, onClose, onCampCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_inicio_transaccion: '',
    hora_inicio_transaccion: null,
    fecha_fin_transaccion: '',
    hora_fin_transaccion: null,
    fecha_inicio_campeonato: '',
    hora_inicio_campeonato: null,
    fecha_fin_campeonato: '',
    hora_fin_campeonato: null,
  });

  const updateNombreCampeonato = () => {
    const { fecha_inicio_campeonato} = formData;
  
    if (fecha_inicio_campeonato ) {
      const inicio = moment(fecha_inicio_campeonato);
      const year = inicio.year();
      const month = inicio.month() + 1; 
      const period = month >= 1 && month <= 6 ? 'A' : 'B';
      const nombre = `Campeonato ${year}-${period}`;
      
      setFormData((prevData) => ({
        ...prevData,
        nombre,
      }));
    }
  };  

  const handleDateChange = (name, value) => {
    const formattedDate = value ? value.format('YYYY-MM-DD') : '';
  
    const updatedFormData = {
      ...formData,
      [name]: formattedDate,
    };
  
    setFormData(updatedFormData);
    if (name === 'fecha_inicio_campeonato' || name === 'fecha_fin_campeonato') {
      updateNombreCampeonato(updatedFormData);
    }
  };
  
  
  const handleTimeChange = (name, value) => {
    if (!value) {
      return; // Salir si no hay un valor seleccionado
    }
  
    const formattedTime = value.format('HH:mm:ss'); // Formatea la hora
    console.log(`Hora seleccionada (${name}):`, formattedTime);
  
    // Actualiza el estado
    setFormData((prevState) => ({
      ...prevState,
      [name]: formattedTime,
    }));
  };
  
  
  
  const resetForm = () => {
    setFormData({
      nombre: '',
      fecha_inicio_transaccion: '',
      hora_inicio_transaccion: null,
      fecha_fin_transaccion: '',
      hora_fin_transaccion: null,
      fecha_inicio_campeonato: '',
      hora_inicio_campeonato:null,
      fecha_fin_campeonato: '',
      hora_fin_campeonato: null,
    });
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos obligatorios
    const camposFaltantes = [];
  
    if (!formData.nombre) camposFaltantes.push('Nombre');
    if (!formData.fecha_inicio_transaccion || !formData.hora_inicio_transaccion) camposFaltantes.push('Inicio de transacciones');
    if (!formData.fecha_fin_transaccion || !formData.hora_fin_transaccion) camposFaltantes.push('Fin de transacciones');
    if (!formData.fecha_inicio_campeonato || !formData.hora_inicio_campeonato) camposFaltantes.push('Inicio del campeonato');
    if (!formData.fecha_fin_campeonato || !formData.hora_fin_campeonato) camposFaltantes.push('Fin del campeonato');
  
    if (camposFaltantes.length > 0) {
      toast.warn(`Complete los siguientes campos: ${camposFaltantes.join(', ')}`);
      return;
    }
  
    try {
      const inicioTransaccion = formData.fecha_inicio_transaccion
        ? moment(`${formData.fecha_inicio_transaccion} ${formData.hora_inicio_transaccion}`, 'YYYY-MM-DD HH:mm:ss')
        : null;
  
      const finTransaccion = formData.fecha_fin_transaccion
        ? moment(`${formData.fecha_fin_transaccion} ${formData.hora_fin_transaccion}`, 'YYYY-MM-DD HH:mm:ss')
        : null;
  
      const inicioCampeonato = formData.fecha_inicio_campeonato
        ? moment(`${formData.fecha_inicio_campeonato} ${formData.hora_inicio_campeonato}`, 'YYYY-MM-DD HH:mm:ss')
        : null;
  
      const finCampeonato = formData.fecha_fin_campeonato
        ? moment(`${formData.fecha_fin_campeonato} ${formData.hora_fin_campeonato}`, 'YYYY-MM-DD HH:mm:ss')
        : null;
  
      // Enviar los valores en formato compatible con SQL Server
      await axios.post(`${API_BASE_URL}/Campeonatos/insert`, {
        nombre: formData.nombre,
        fecha_inicio_transaccion: inicioTransaccion.format('YYYY-MM-DD HH:mm:ss'),
        fecha_fin_transaccion: finTransaccion.format('YYYY-MM-DD HH:mm:ss'),
        fecha_inicio_campeonato: inicioCampeonato.format('YYYY-MM-DD HH:mm:ss'),
        fecha_fin_campeonato: finCampeonato.format('YYYY-MM-DD HH:mm:ss'),
      });
      
  
      toast.success('Campeonato registrado con éxito');
      onClose();
      onCampCreated();
    } catch (error) {
      const mensaje = error.response?.data?.message || 'Error al registrar el campeonato';
      toast.error(mensaje);
    }    
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Registrar Campeonato"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="modal-title">Registrar Campeonato</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className='custom-picker-label'>Seleccione un rango de fechas para movimientos y transacciones</label>
          <div className="input-group">
            <DatePicker
              className="custom-picker"
              placeholder="Fecha de inicio"
              onChange={(value) => handleDateChange('fecha_inicio_transaccion', value)}
              disabledDate={(current) => current && current < moment().startOf('day')}
            />
            <TimePicker
              className="custom-picker"
              placeholder="Hora de inicio"
              value={formData.hora_inicio_transaccion ? moment(formData.hora_inicio_transaccion, 'HH:mm:ss') : null}
              onChange={(value) => handleTimeChange('hora_inicio_transaccion', value)}
              format="HH:mm:ss"
              onOpenChange={(open) => {
                if (open) {
                  setFormData((prevData) => ({
                    ...prevData,
                    hora_inicio_transaccion: null, // Limpia el campo al abrir el TimePicker
                  }));
                }
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-group">
            <DatePicker
              className="custom-picker"
              placeholder="Fecha de fin"
              onChange={(value) => handleDateChange('fecha_fin_transaccion', value)}
              disabled={!formData.fecha_inicio_transaccion}
              disabledDate={(current) =>
              current && current < moment(formData.fecha_inicio_transaccion)
              }
            />
           <TimePicker
              className="custom-picker"
              placeholder="Hora de fin"
              value={formData.hora_fin_transaccion ? moment(formData.hora_fin_transaccion, 'HH:mm:ss') : null}
              onChange={(value) => handleTimeChange('hora_fin_transaccion', value)}
              format="HH:mm:ss"
              disabled={!formData.fecha_inicio_transaccion}
              onOpenChange={(open) => {
                if (open) {
                  setFormData((prevData) => ({
                    ...prevData,
                    hora_fin_transaccion: null, // Limpia el campo al abrir el TimePicker
                  }));
                }
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className='custom-picker-label'>Selecione fechas para el inicio y fin del campeonato</label>
          <div className="input-group">
            <DatePicker
              className="custom-picker"
              placeholder="Fecha de inicio"
              onChange={(value) => handleDateChange('fecha_inicio_campeonato', value)}
              disabled={!formData.fecha_fin_transaccion}
              disabledDate={(current) =>
                current &&
                current <
                  moment(`${formData.fecha_fin_transaccion} `)
              }
            />
           <TimePicker
              className="custom-picker"
              placeholder="Hora de inicio"
              value={formData.hora_inicio_campeonato ? moment(formData.hora_inicio_campeonato, 'HH:mm:ss') : null}
              onChange={(value) => handleTimeChange('hora_inicio_campeonato', value)}
              format="HH:mm:ss"
              disabled={!formData.fecha_fin_transaccion}
              onOpenChange={(open) => {
                if (open) {
                  setFormData((prevData) => ({
                    ...prevData,
                    hora_inicio_campeonato: null, // Limpia el campo al abrir el TimePicker
                  }));
                }
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-group">
            <DatePicker
              className="custom-picker"
              placeholder="Fecha de fin"
              onChange={(value) => handleDateChange('fecha_fin_campeonato', value)}
              disabled={!formData.fecha_inicio_campeonato}
              disabledDate={(current) =>
                current && current < moment(formData.fecha_inicio_campeonato)
              }
            />
            <TimePicker
              className="custom-picker"
              placeholder="Hora de fin"
              value={formData.hora_fin_campeonato ? moment(formData.hora_fin_campeonato, 'HH:mm:ss') : null}
              onChange={(value) => handleTimeChange('hora_fin_campeonato', value)}
              format="HH:mm:ss"
              disabled={!formData.fecha_inicio_campeonato}
              onOpenChange={(open) => {
                if (open) {
                  setFormData((prevData) => ({
                    ...prevData,
                    hora_fin_campeonato: null, // Limpia el campo al abrir el TimePicker
                  }));
                }
              }}
            />
          </div>
        </div>

        <div className="form-group">
        <input
          type="text"
          placeholder="Nombre"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className="input-field"
        />
        </div>

        <div className="form-buttons">
          <button type="button" className="button button-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="button button-primary">
            Registrar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RegistroCampeonato;
