import React from "react";
import { useNavigate } from "react-router-dom";
import pagoTiposMapping from "../../constants/pagoTipos";
import "../../assets/css/Pagos/ListaPagos.css";

const ListaPagos = () => {
  const navigate = useNavigate();

  const pagosPendientes = {
    Inscripcion: 5,
    Traspaso: 3,
    Multa: 7,
    Sancion: 2,
  };

  const handleViewDetails = (tipo) => {
    navigate(`/pagos/${tipo}`);
  };

  return (
    <div className="pagos-container">
      <h2 className="pagos-lista-titulo">Lista de Tipos de Pagos</h2>

      <div className="pagos-cards-wrapper">
        {Object.keys(pagoTiposMapping).map((tipo) => (
          <div key={tipo} className="pago-card">
            <h2 className="pago-titulo">{pagoTiposMapping[tipo]}</h2>
            <p className="pago-pendientes">
              <strong>Pagos pendientes:</strong> {pagosPendientes[tipo] || 0}
            </p>
            <div className="pago-buttons">
              <button className="button-view-pago" onClick={() => handleViewDetails(tipo)}>
                <i className="fas fa-eye"></i> Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaPagos;
