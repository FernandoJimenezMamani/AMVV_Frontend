import React from 'react';
import { Modal } from 'antd'; // O cualquier otra librería que uses para el Modal
import '../assets/css/Registro.css'

const ConfirmModal = ({ visible, onConfirm, onCancel, message }) => {
  return (
    <Modal
      title="Confirmación"
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      className="custom-modal"
    >
      <p>{message}</p>
    </Modal>
  );
};

export default ConfirmModal;
