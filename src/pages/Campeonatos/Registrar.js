import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DatePicker, Modal } from 'antd';
import moment from 'moment';
import '../../assets/css/Registro.css'; 

const { RangePicker } = DatePicker;

const RegistroCampeonato = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_rango: [moment(), moment().add(1, 'days')]
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
    try {
      const [fecha_inicio, fecha_fin] = formData.fecha_rango;
      const response = await axios.post('http://localhost:5002/api/Campeonatos/insert', {
        nombre: formData.nombre,
        fecha_inicio: fecha_inicio.toISOString(),
        fecha_fin: fecha_fin.toISOString()
      });
      console.log(response.data);
      alert('Campeonato creado exitosamente');
    } catch (error) {
      console.error('Error al crear el campeonato:', error);
      alert('Error al crear el campeonato');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    showModal();
  };

  return (
    <div className="registro-campeonato">
      <h2>Registrar Campeonato</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <RangePicker
            required
            className="custom-range-picker"
            showTime
            value={formData.fecha_rango}
            onChange={handleDateChange}
            format="YYYY-MM-DD HH:mm:ss"
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
          />
        </div>
        <div className="form-group">
          <button id="RegCampBtn" type="submit">Registrar</button>
        </div>
      </form>
      <Modal
        title="Confirmación"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="custom-modal"
      >
        <p>¿Estás seguro de que deseas crear este registro?</p>
      </Modal>
    </div>
  );
};

export default RegistroCampeonato;
