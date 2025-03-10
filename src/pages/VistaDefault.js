import React from 'react';
import '../assets/css/vistaDefault.css';
import defaultBackground from '../assets/img/logo.png'

const VistaDefault = () => {
  return (
    <div className="vista-default-container">
      <div className="imagen-contenedor">
        <img src={defaultBackground} alt="Vista Default" className="imagen-default" />
      </div>
    </div>
  );
};

export default VistaDefault;
