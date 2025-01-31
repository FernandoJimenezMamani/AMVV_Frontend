import React, { useState , useEffect } from "react";
import Modal from "react-modal";
import "../../assets/css/registroModal.css"; // Aplicamos los mismos estilos

Modal.setAppElement("#root"); // Necesario para accesibilidad

const RegistroPago = ({ isOpen, onClose, equipo, onSubmit }) => {
  // Mueve useState antes de la condición
  const [monto, setMonto] = useState("");

  useEffect(() => {
    if (equipo) {
      setMonto(equipo.costo_inscripcion || "");
    }
  }, [equipo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ equipoId: equipo.id, monto });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Registrar Pago"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="modal-title">Registrar Pago</h2>

      {/* Información del equipo */}
      <div className="form-group">
        <p className="modal-text"><strong>Equipo:</strong> {equipo.equipo_nombre}</p>
        <p className="modal-text"><strong>Club:</strong> {equipo.nombre_club}</p>
        <p className="modal-text"><strong>Categoría:</strong> {equipo.Categoria}</p>
        <p className="modal-text"><strong>Género:</strong> {equipo.genero}</p>
        <p className="modal-text"><strong>Deuda:</strong> {equipo.costo_inscripcion} Bs</p>
      </div>

      {/* Input del monto */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="modal-label">Monto a pagar:</label>
          <input
            type="number"
            className="input-field-u"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
          />
        </div>

        {/* Botones */}
        <div className="form-buttons">
          <button type="button" className="button button-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="button button-primary">Registrar Pago</button>
        </div>
      </form>
    </Modal>
  );
};

export default RegistroPago;
