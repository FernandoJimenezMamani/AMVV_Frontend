import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/css/Campeonato/Indice.css';
import { useSession } from '../../context/SessionContext';
import { useNavigate } from 'react-router-dom';

const Campeonatos = () => {
  const [campeonatos, setCampeonatos] = useState([]);
  const { user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/Campeonatos/select');
        setCampeonatos(response.data);
      } catch (error) {
        console.error('Error al obtener los campeonatos:', error);
      }
    };

    fetchCampeonatos();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/categorias/indice/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/Campeonatos/Editar/${id}`);
  };

  return (
    <div className="campeonatos-container">
      {campeonatos.map(campeonato => (
        <div key={campeonato.id} className="campeonato-card">
          <h2 className="campeonato-nombre">{campeonato.nombre}</h2>
          <p className="campeonato-fecha">Inicio: {new Date(campeonato.fecha_inicio).toLocaleDateString()}</p>
          <div className="campeonato-buttons">
            <button className="buttonex" onClick={() => handleViewDetails(campeonato.id)}>Ver Detalles</button>
            <button className="buttonex" onClick={() => handleEdit(campeonato.id)}>Editar</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Campeonatos;
