import React, { useState } from 'react';
import axios from 'axios';
import { DatePicker } from 'antd';
import moment from 'moment';
import '../../assets/css/Campeonato.css';

const { RangePicker } = DatePicker;

const RegistroCampeonato = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_rango: [moment(), moment().add(1, 'days')]
  });

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
      const response = await axios.post('/campeonato/insert', {
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

  return (
    <div className="registro-campeonato">
      <h2>Registrar Campeonato</h2>
      <form onSubmit={handleSubmit}>
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
          <RangePicker
            className="custom-range-picker"
            showTime
            value={formData.fecha_rango}
            onChange={handleDateChange}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder={['Fecha de inicio', 'Fecha de fin']}
          />
        </div>
        <div className="form-group">
          <button id="RegCampBtn" type="submit">Registrar</button>
        </div>
      </form>
    </div>
  );
};

export default RegistroCampeonato;
