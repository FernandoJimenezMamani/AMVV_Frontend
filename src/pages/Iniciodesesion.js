import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Inicio_de_sesion.css';
import logo from '../assets/img/logo.png';
import { useSession } from '../context/SessionContext';
import { toast } from 'react-toastify';

const InicioDeSesion = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    correo: '',
    contraseña: '',
  });
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const { login } = useSession();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/api/sesion/login', formData, { withCredentials: true });
      console.log('Respuesta del backend:', response.data);
  
      const { requireRoleSelection, roles, token, user } = response.data;
  
      if (requireRoleSelection) {
        setRoles(roles); // Actualiza el estado para mostrar los roles
      } else {
        login({ user, token }); // Inicia sesión directamente si no hay selección de rol
        onLoginSuccess(user);
        navigate('/sidebar');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.warn('Revise sus credenciales');
    }
  };  

  const handleRoleSelection = async () => {
    if (!selectedRoleId) {
      toast.warn('Seleccione un rol para continuar');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:5002/api/sesion/login',
        { ...formData, selectedRoleId },
        { withCredentials: true }
      );
  
      const { token, user } = response.data; // `user` ya incluye el rol seleccionado
      login({ user, token }); // Guarda usuario y token en el contexto
      onLoginSuccess(user);
      navigate('/sidebar');
    } catch (error) {
      console.error('Error al procesar el rol seleccionado:', error);
      toast.warn('Ocurrió un error al procesar su rol');
    }
  };
  
  const handleForgotPassword = () => {
    navigate('/reset-password');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="Login" className="login-image" />
        <h1>INICIO DE SESIÓN</h1>
        {roles.length > 0 ? (
          <div>
            <h2>Seleccione un rol</h2>
            <div className="input-container">
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="role-select"
              >
                <option value="" disabled>
                  -- Seleccione un rol --
                </option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.nombre}
                  </option>
                ))}
              </select>
            </div>
            <button className="login-button" onClick={handleRoleSelection}>
              Continuar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="text"
                name="correo"
                placeholder="Nombre de usuario o correo"
                value={formData.correo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                name="contraseña"
                placeholder="Contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                required
              />
            </div>
            <div className="forgot-password">
              <a href="#" onClick={handleForgotPassword}>¿Olvidó su contraseña?</a>
            </div>
            <button type="submit" className="login-button">
              Iniciar sesión
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default InicioDeSesion;
