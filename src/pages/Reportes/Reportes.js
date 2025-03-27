import React from "react";
import ProgresoPartidos from "./ProgresoPartidos";
import PartidosPendientes from "./PartidosPendientes";
import ComparacionEquipos from "./ComparacionEquipos";
import ComparacionIngresos from "./ComparacionIngresos";
import "../../assets/css/Reportes/Reportes.css";

const Reportes = () => {
  return (
    <div className="reportes-container">
      <div className="reporte-card">
        <ComparacionEquipos />
      </div>
      <div className="reporte-card">
        <ComparacionIngresos />
      </div>
    </div>
  );
};

export default Reportes;
