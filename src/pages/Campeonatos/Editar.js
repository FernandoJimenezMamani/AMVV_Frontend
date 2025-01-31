import React, { useEffect, useState } from "react";
import axios from "axios";
import { DatePicker, TimePicker } from "antd";
import Modal from "react-modal";
import moment from "moment";
import "../../assets/css/registroModal.css";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EditarCampeonato = ({ isOpen, onClose, campId , onCampEdited }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    fecha_inicio_transaccion: "",
    hora_inicio_transaccion: "",
    fecha_fin_transaccion: "",
    hora_fin_transaccion: "",
    fecha_inicio_campeonato: "",
    hora_inicio_campeonato: "",
    fecha_fin_campeonato: "",
    hora_fin_campeonato: "",
  });

  useEffect(() => {
    if (campId) {
      fetchCampeonato();
    }
  }, [campId]);

  const fetchCampeonato = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Campeonatos/${campId}`);
      const {
        nombre,
        fecha_inicio_transaccion,
        hora_inicio_transaccion,
        fecha_fin_transaccion,
        hora_fin_transaccion,
        fecha_inicio_campeonato,
        hora_inicio_campeonato,
        fecha_fin_campeonato,
        hora_fin_campeonato,
      } = response.data;
  
      console.log("Datos del campeonato recibidos del servidor:", response.data);
  
      // Asignar directamente al estado
      setFormData({
        nombre,
        fecha_inicio_transaccion, // Fecha ya separada
        hora_inicio_transaccion, // Hora ya separada
        fecha_fin_transaccion,
        hora_fin_transaccion,
        fecha_inicio_campeonato,
        hora_inicio_campeonato,
        fecha_fin_campeonato,
        hora_fin_campeonato,
      });
  
      console.log("Estado inicial de formData después de cargar los datos:", {
        nombre,
        fecha_inicio_transaccion,
        hora_inicio_transaccion,
        fecha_fin_transaccion,
        hora_fin_transaccion,
        fecha_inicio_campeonato,
        hora_inicio_campeonato,
        fecha_fin_campeonato,
        hora_fin_campeonato,
      });
    } catch (error) {
      toast.error("Error al obtener los datos del campeonato");
      console.error("Error fetching campeonato data:", error);
    }
  };
  

  const handleDateChange = (name, value) => {
    const formattedDate = value ? value.format("YYYY-MM-DD") : "";
    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedDate,
    }));
  };

  const handleTimeChange = (name, value) => {
    console.log(`Cambiando hora para ${name}:`, value ? value.format("HH:mm:ss") : null);
  
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value ? value.format("HH:mm:ss") : null,
      };
      console.log("Nuevo estado actualizado en formData:", updatedData);
      return updatedData;
    });
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const inicioTransaccion = moment(
        `${formData.fecha_inicio_transaccion} ${formData.hora_inicio_transaccion}`,
        "YYYY-MM-DD HH:mm:ss"
      );
      const finTransaccion = moment(
        `${formData.fecha_fin_transaccion} ${formData.hora_fin_transaccion}`,
        "YYYY-MM-DD HH:mm:ss"
      );
      const inicioCampeonato = moment(
        `${formData.fecha_inicio_campeonato} ${formData.hora_inicio_campeonato}`,
        "YYYY-MM-DD HH:mm:ss"
      );
      const finCampeonato = moment(
        `${formData.fecha_fin_campeonato} ${formData.hora_fin_campeonato}`,
        "YYYY-MM-DD HH:mm:ss"
      );

      await axios.put(`${API_BASE_URL}/Campeonatos/edit/${campId}`, {
        nombre: formData.nombre,
        fecha_inicio_transaccion: inicioTransaccion.format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        fecha_fin_transaccion: finTransaccion.format("YYYY-MM-DD HH:mm:ss"),
        fecha_inicio_campeonato: inicioCampeonato.format("YYYY-MM-DD HH:mm:ss"),
        fecha_fin_campeonato: finCampeonato.format("YYYY-MM-DD HH:mm:ss"),
      });

      toast.success("Campeonato editado con éxito");
      onCampEdited();
      onClose();
    } catch (error) {
      toast.error("Error al editar el campeonato");
      console.error("Error al editar el campeonato:", error);
    }
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

      <form onSubmit={handleSubmit}>
        {/* Fechas de Transacción */}
        <div className="form-group">
          <label className="custom-picker-label">Transacción</label>
          <div className="input-group">
            <DatePicker
              className="custom-picker"
              value={
                formData.fecha_inicio_transaccion
                  ? moment(formData.fecha_inicio_transaccion, "YYYY-MM-DD")
                  : null
              }
              onChange={(value) =>
                handleDateChange("fecha_inicio_transaccion", value)
              }
              disabledDate={(current) =>
                current && current < moment().startOf("day")
              }
              onOpenChange={(open) => {
                if (open) {
                  setFormData((prevData) => ({
                    ...prevData,
                    fecha_inicio_transaccion: null, // Limpia el valor al abrir
                  }));
                }
              }}
            />
            <TimePicker
              className="custom-picker"
              value={formData.hora_inicio_transaccion
                ? moment(formData.hora_inicio_transaccion, "HH:mm:ss")
                : null}
              onChange={(value) => handleTimeChange("hora_inicio_transaccion", value)}
              onOpenChange={(open) => {
                if (open) {
                  setFormData((prevData) => ({
                    ...prevData,
                    hora_inicio_transaccion: null, // Limpia el campo al abrir el TimePicker
                  }));
                }
              }}
              format="HH:mm:ss"
            />
          </div>
        </div>

        {/* Fin de Transacción */}
        <div className="form-group">
          <div className="input-group">
            <DatePicker
              className="custom-picker"
              value={
                formData.fecha_fin_transaccion
                  ? moment(formData.fecha_fin_transaccion, "YYYY-MM-DD")
                  : null
              }
              onChange={(value) =>
                handleDateChange("fecha_fin_transaccion", value)
              }
              onOpenChange={(open) => {
                if (open) {
                  setFormData((prevData) => ({
                    ...prevData,
                    fecha_fin_transaccion: null, // Limpia el valor al abrir
                  }));
                }
              }}
              disabledDate={(current) =>
                current &&
                current < moment(formData.fecha_inicio_transaccion, "YYYY-MM-DD")
              }
            />
            <TimePicker
              className="custom-picker"
              value={
                formData.hora_fin_transaccion
                  ? moment(formData.hora_fin_transaccion, "HH:mm:ss")
                  : null
              }
              onOpenChange={(open) => {
                if (open) {
                  setFormData((prevData) => ({
                    ...prevData,
                    hora_fin_transaccion: null, // Limpia el campo al abrir el TimePicker
                  }));
                }
              }}
              onChange={(value) =>
                handleTimeChange("hora_fin_transaccion", value)
              }
              format="HH:mm:ss"
            />
          </div>
        </div>

        {/* Fechas de Campeonato */}
        <div className="form-group">
          <label className="custom-picker-label">Campeonato</label>
          <div className="input-group">
            <DatePicker
              className="custom-picker"
              value={
                formData.fecha_inicio_campeonato
                  ? moment(formData.fecha_inicio_campeonato, "YYYY-MM-DD")
                  : null
              }
              onChange={(value) =>
                handleDateChange("fecha_inicio_campeonato", value)
              }
              onOpenChange={(open) => {
                if (open) {
                  setFormData((prevData) => ({
                    ...prevData,
                    fecha_inicio_campeonato: null, // Limpia el valor al abrir
                  }));
                }
              }}
              
              disabledDate={(current) =>
                current &&
                current < moment(formData.fecha_fin_transaccion, "YYYY-MM-DD")
              }
            />
            <TimePicker
              className="custom-picker"
              value={
                formData.hora_inicio_campeonato
                  ? moment(formData.hora_inicio_campeonato, "HH:mm:ss")
                  : null
              }
              onChange={(value) =>
                handleTimeChange("hora_inicio_campeonato", value)
              }
              
              onOpenChange={(open) => {
                if (open) {
                  setFormData((prevData) => ({
                    ...prevData,
                    hora_inicio_campeonato: null, // Limpia el campo al abrir el TimePicker
                  }));
                }
              }}
              format="HH:mm:ss"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="input-group">
            <DatePicker
              className="custom-picker"
              value={
                formData.fecha_fin_campeonato
                  ? moment(formData.fecha_fin_campeonato, "YYYY-MM-DD")
                  : null
              }
              onChange={(value) =>
                handleDateChange("fecha_fin_campeonato", value)
              }

              onOpenChange={(open) => {
                if (open) {
                  setFormData((prevData) => ({
                    ...prevData,
                    fecha_fin_campeonato: null, // Limpia el valor al abrir
                  }));
                }
              }}
              
              disabledDate={(current) =>
                current &&
                current < moment(formData.fecha_inicio_campeonato, "YYYY-MM-DD")
              }
            />
            <TimePicker
              className="custom-picker"
              value={
                formData.hora_fin_campeonato
                  ? moment(formData.hora_fin_campeonato, "HH:mm:ss")
                  : null
              }
              onChange={(value) =>
                handleTimeChange("hora_fin_campeonato", value)
              }
              onOpenChange={(open) => {
                if (open) {
                  setFormData((prevData) => ({
                    ...prevData,
                    hora_fin_campeonato: null, // Limpia el campo al abrir el TimePicker
                  }));
                }
              }}
              format="HH:mm:ss"
            />
          </div>
        </div>

        {/* Nombre del Campeonato */}
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            readOnly
            className="input-field"
          />
        </div>

        <div className="form-buttons">
          <button
            type="button"
            className="button button-cancel"
            onClick={onClose}
          >
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
