import React from 'react';
import { Modal } from 'antd';

const ReprogramacionModal = ({ visible, onClose, simulacion, onConfirm }) => {
  if (!simulacion) return null;

  return (
    <Modal
      title="📅 Nueva Programación del Partido"
      open={visible}
      onOk={onConfirm}
      onCancel={onClose}
      className="custom-modal"
    >
      <p><strong>Fecha:</strong> {simulacion.nuevaFechaHora.split(' ')[0]}</p>
      <p><strong>Hora:</strong> {simulacion.nuevaFechaHora.split(' ')[1]}</p>
      <p><strong>Lugar:</strong> {simulacion.nuevoLugar.nombre}</p>
      
      <h3>⚖ Árbitros Asignados</h3>
      <ul>
        {simulacion.arbitrosAsignados.map(arbitro => (
          <li key={arbitro.id}>{arbitro.nombre} {arbitro.apellido}</li>
        ))}
      </ul>
    </Modal>
  );
};

export default ReprogramacionModal;
