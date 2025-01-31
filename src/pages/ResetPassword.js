import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../assets/css/Inicio_de_sesion.css';

const ResetPassword = () => {
  const [correo, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5002/api/sesion/reset-password', { correo });
      console.log('Respuesta del backend:', response.data);
      toast.success('Si el correo está registrado, recibirá instrucciones para restablecer la contraseña.');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error al solicitar el restablecimiento de contraseña:', error);
      toast.error('Hubo un problema al procesar su solicitud. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Restablecer Contraseña</h1>
        {isSubmitted ? (
          <p>Por favor, revise su correo electrónico para continuar con el proceso de restablecimiento.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="email"
                placeholder="Ingrese su correo electrónico"
                value={correo}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">
              Enviar Instrucciones
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
