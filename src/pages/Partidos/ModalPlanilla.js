import React from "react";
import "../../assets/css/ModalPlanilla.css"; // Estilos aparte

const ModalPlanilla = ({ isOpen,imageUrl, onClose }) => {
    if (!isOpen || !imageUrl) return null;

  return (
    <div className="modal-planilla-overlay" onClick={onClose}>
      <div className="modal-planilla-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-planilla-close" onClick={onClose}>✖</button>
        <h2 className="modal-planilla-titulo">Planilla del Partido</h2>
        <div className="modal-planilla-imagen-container">
          <img
            src={imageUrl}
            alt="Planilla del partido"
            className="modal-planilla-imagen"
          />
        </div>
      </div>
    </div>
  );
};

export default ModalPlanilla;
