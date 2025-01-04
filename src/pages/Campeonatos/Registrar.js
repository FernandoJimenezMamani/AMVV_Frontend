import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DatePicker } from 'antd';
import moment from 'moment';
import Modal from 'react-modal';
import '../../assets/css/registroModal.css';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

Modal.setAppElement('#root'); // Configuración importante para accesibilidad

const { RangePicker } = DatePicker;

const RegistroCampeonato = ({ isOpen, onClose, onCampCreated }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_rango: [moment(), moment().add(1, 'days')]
  });

  useEffect(() => {
    if (formData.fecha_rango && formData.fecha_rango.length === 2) {
      updateNombre();
    }
  }, [formData.fecha_rango]);

  const updateNombre = () => {
    const [fecha_inicio] = formData.fecha_rango;
    const year = fecha_inicio.year();
    const month = fecha_inicio.month() + 1; 
    const period = month >= 1 && month <= 6 ? 'A' : 'B';
    const nombre = `Campeonato ${year}-${period}`;
    setFormData((prevData) => ({
      ...prevData,
      nombre: nombre
    }));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateChange = (dates) => {
    setFormData({
      ...formData,
      fecha_rango: dates
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const [fecha_inicio, fecha_fin] = formData.fecha_rango;
      await axios.post(`${API_BASE_URL}/Campeonatos/insert`, {
        nombre: formData.nombre,
        fecha_inicio: fecha_inicio.toISOString(),
        fecha_fin: fecha_fin.toISOString()
      });
      toast.success('Campeonato registrado con éxito');
      onClose();  // Cerrar el modal después de registrar
      onCampCreated();
    } catch (error) {
      toast.error('Error al registrar el campeonato');
      console.error('Error al crear el campeonato:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Registrar Campeonato"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="modal-title">Registrar Campeonato</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
        <RangePicker
          required
          className="custom-range-picker input-field"
          value={formData.fecha_rango}
          onChange={handleDateChange}
          format="YYYY-MM-DD"
          placeholder={['Fecha de inicio', 'Fecha de fin']}
        />

        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
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
