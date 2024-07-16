import React, { useState } from 'react';
import axios from 'axios';
import { DatePicker } from 'antd';
import moment from 'moment';
import '../../assets/css/Campeonato.css';

const { RangePicker } = DatePicker; 
const RegistroCampeonato = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_inicio: '',
    fecha_fin: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
 
  const handleDateChange = (date, dateString, name) => {
    setFormData({
      ...formData,
      [name]: date
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/campeonato/insert', formData);
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
            placeholder='Nombre'
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Rango de Fechas:</label>
          <RangePicker
            showTime
            value={formData.fecha_rango}
            onChange={handleDateChange}
            format="YYYY-MM-DD HH:mm:ss"
          />
        </div>
 
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegistroCampeonato;
