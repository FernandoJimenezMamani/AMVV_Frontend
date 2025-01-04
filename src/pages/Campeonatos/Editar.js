import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { DatePicker } from 'antd';
import Modal from 'react-modal';
import moment from 'moment';
import '../../assets/css/registroModal.css'; 
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const { RangePicker } = DatePicker;

const EditarCampeonato = ({isOpen, onClose,campId}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    fecha_rango: [moment(), moment().add(1, 'days')]
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchCampeonato = async () => {
      if (!campId) return;  // Evita ejecutar si el campId es null o undefined
      try {
        const response = await axios.get(`${API_BASE_URL}/Campeonatos/${campId}`);
        const { nombre, fecha_inicio, fecha_fin } = response.data;
        setFormData({
          nombre: nombre,
          fecha_rango: [moment(fecha_inicio), moment(fecha_fin)]
        });
      } catch (error) {
        toast.error('Error al obtener los datos del campeonato');
        console.error('Error fetching campeonato data:', error);
      }
    };
    fetchCampeonato();
  }, [campId]);
  

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
      const checkNameResult = await axios.get(`${API_BASE_URL}/Campeonatos/check-name`, {
        params: { nombre: normalizedNombre, excludeId: campId }
      });

      if (checkNameResult.data.exists) {
        alert('El nombre del campeonato ya existe');
        return;
      }

      const response = await axios.put(`${API_BASE_URL}/Campeonatos/edit/${campId}`, {
        nombre: formData.nombre,
        fecha_inicio: fecha_inicio.toISOString(),
        fecha_fin: fecha_fin.toISOString()
      });
      console.log(response.data);
      toast.success('Editado con éxito');
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
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Editar Campeonato"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="modal-title">Editar Campeonato</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <RangePicker
            required
            className="input-field custom-range-picker"
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
            Guardar Cambios
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditarCampeonato;
