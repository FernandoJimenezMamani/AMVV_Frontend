import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Inicio_de_sesion.css';
import logo from '../assets/img/logo.png';
import { useSession } from '../context/SessionContext';
import { toast } from 'react-toastify';
import HomeIcon from '@mui/icons-material/Home';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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
      const response = await axios.post(`${API_BASE_URL}/sesion/login`, formData, { withCredentials: true });
  
      const { requireRoleSelection, roles, token, user } = response.data;
  
      if (requireRoleSelection) {
        setRoles(roles); 
      } else {
        login({ user, token }); 
        onLoginSuccess(user);
        navigate('/ventanaPrincipalUser');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      const mensaje = error.response?.data?.message || 'Error inesperado al iniciar sesión';
      toast.warn(mensaje);
    }
    
  };  

  const handleRoleSelection = async () => {
    if (!selectedRoleId) {
      toast.warn('Seleccione un rol para continuar');
      return;
    }
  
    try {
      const response = await axios.post(
        `${API_BASE_URL}/sesion/login`,
        { ...formData, selectedRoleId },
        { withCredentials: true }
      );
  
      const { token, user } = response.data; 
      login({ user, token }); 
      onLoginSuccess(user);
      navigate('/ventanaPrincipalUser');
    } catch (error) {
      console.error('Error al procesar el rol seleccionado:', error);
      const mensaje = error.response?.data?.message || 'Ocurrió un error al procesar su rol';
      toast.warn(mensaje);
    }
    
  };
  
  const handleForgotPassword = () => {
    navigate('/reset-password');
  };

  const handleGoHome = () => {
    navigate('/'); 
  };

  return (
    <div className="login-container">

    <button className="home-button" onClick={handleGoHome}>
      <HomeIcon className="home-icon" />
    </button>
      <div className="login-box">
        <img src={logo} alt="Login" className="login-image" />
        <h1>INICIO DE SESIÓN</h1>
        {roles.length > 0 ? (
          <div className="role-selection-container">
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
