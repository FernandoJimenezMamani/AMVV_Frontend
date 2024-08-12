import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { DatePicker, Modal } from 'antd';
import moment from 'moment';
import '../../assets/css/Registro.css';  

const { RangePicker } = DatePicker;

const EditarCampeonato = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_rango: [moment(), moment().add(1, 'days')]
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchCampeonato = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/Campeonatos/${id}`);
        const { nombre, fecha_inicio, fecha_fin } = response.data;
        setFormData({
          nombre: nombre,
          fecha_rango: [moment(fecha_inicio), moment(fecha_fin)]
        });
      } catch (error) {
        console.error('Error fetching campeonato data:', error);
      }
    };

    fetchCampeonato();
  }, [id]);

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

      // Normalize the name for comparison
      const normalizedNombre = formData.nombre.replace(/\s+/g, '').toUpperCase();

      // Check if the championship name already exists
      const checkNameResult = await axios.get('http://localhost:5002/api/Campeonatos/check-name', {
        params: { nombre: normalizedNombre, excludeId: id }
      });

      if (checkNameResult.data.exists) {
        alert('El nombre del campeonato ya existe');
        return;
      }

      const response = await axios.put(`http://localhost:5002/api/Campeonatos/edit/${id}`, {
        nombre: formData.nombre,
        fecha_inicio: fecha_inicio.toISOString(),
        fecha_fin: fecha_fin.toISOString()
      });
      console.log(response.data);
      alert('Campeonato editado exitosamente');
      navigate('/campeonatos/indice');
    } catch (error) {
      console.error('Error al editar el campeonato:', error);
      alert('Error al editar el campeonato');
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
      <h2>Editar Campeonato</h2>
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
          <button id="RegCampBtn" type="submit">Guardar Cambios</button>
        </div>
      </form>
      <Modal
        title="Confirmación"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="custom-modal"
      >
        <p>¿Estás seguro de que deseas guardar los cambios?</p>
      </Modal>
    </div>
  );
};

export default EditarCampeonato;
