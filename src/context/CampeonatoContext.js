import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CampeonatoContext = createContext();

export const CampeonatoProvider = ({ children }) => {
  const [campeonatoEnCurso, setCampeonatoEnCurso] = useState(null);
  const [campeonatoEnTransaccion, setCampeonatoEnTransaccion] = useState(null);

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const [curso, transaccion] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/campeonatos/obtenerCampeonatosEnCurso/EnCurso`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/campeonatos/obtenerCampeonatosEnTransaccion/EnTransaccion`),
        ]);
        setCampeonatoEnCurso(curso.data || null);
        setCampeonatoEnTransaccion(transaccion.data || null);
      } catch (err) {
        console.error("Error al obtener campeonatos:", err);
      }
    };

    fetchCampeonatos();
  }, []);

  return (
    <CampeonatoContext.Provider value={{ campeonatoEnCurso, campeonatoEnTransaccion }}>
      {children}
    </CampeonatoContext.Provider>
  );
};

export const useCampeonato = () => useContext(CampeonatoContext);
export { CampeonatoContext };
