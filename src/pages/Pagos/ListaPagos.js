import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import pagoTiposMapping from "../../constants/pagoTipos";
import "../../assets/css/Pagos/ListaPagos.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaPagos = () => {
  const navigate = useNavigate();
  const [campeonato, setCampeonato] = useState(null);
  const [pagosPendientes, setPagosPendientes] = useState({
    Inscripcion: 0,
    Traspaso: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumenCampeonato = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/pagos/resumen-campeonato`);
        const data = response.data;

        setCampeonato(data.campeonato);
        setPagosPendientes({
          Inscripcion: data.totalEquiposConDeuda || 0,
          Traspaso: data.totalTraspasosPendientes || 0,
        });

      } catch (error) {
        console.error("Error al obtener el resumen del campeonato:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumenCampeonato();
  }, []);

  const handleViewDetails = (tipo) => {
    navigate(`/pagos/${tipo}`);
  };

  if (loading) {
    return <div className="loading-message">Cargando información de pagos...</div>;
  }

  return (
    <div className="pagos-container">
      <h2 className="pagos-lista-titulo">
        Pagos para el {campeonato ? campeonato.nombre : "campeonato"}
      </h2>

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
