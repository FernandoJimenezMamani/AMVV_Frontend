import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../assets/css/ChangePasswordModal.css';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CambiarContrasenia = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  Modal.setAppElement('#root'); // 🔹 Mejora accesibilidad para react-modal

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Todos los campos deben ser proporcionados');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('La nueva contraseña y la confirmación no coinciden');
      return;
    }

    try {
      setLoading(true); // 🔹 Activa estado de carga antes de enviar
      let token = sessionStorage.getItem('token') || Cookies.get('token');
      if (!token) {
        console.error('❌ Token no encontrado en sessionStorage ni Cookies');
        toast.error('Error: No se encontró el token');
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/sesion/change-password`,
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔹 Envía el token en el header
          },
        }
      );

      toast.success(response.data.message);
      onClose(); // 🔹 Cierra el modal tras éxito
      setCurrentPassword(''); // 🔹 Limpia el formulario
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false); // 🔹 Desactiva estado de carga
    }
  };

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    className="change-password-modal-content"
    overlayClassName="modal-overlay"
    >
        <h2 className="change-password-modal-title">Cambiar Contraseña</h2>
        <form onSubmit={handleChangePassword} className="change-password-form">
            <label>Contraseña Actual</label>
            <input
            type="password"
            placeholder="Ingrese su contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            />

            <label>Nueva Contraseña</label>
            <input
            type="password"
            placeholder="Ingrese su nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            />

            <label>Confirmar Nueva Contraseña</label>
            <input
            type="password"
            placeholder="Confirme su nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            />

            <div className="change-password-modal-buttons">
            <button type="submit" className="change-password-btn-submit" disabled={loading}>
                {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>
            <button type="button" className="change-password-btn-cancel" onClick={onClose}>
                Cancelar
            </button>
            </div>
        </form>
    </Modal>
  );
};

export default CambiarContrasenia;
