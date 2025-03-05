import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Clubes/ListaClubesUsuario.css"; 

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaClubesUsuario = () => {
  const [clubes, setClubes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClubes();
  }, []);

  const fetchClubes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/club/get_club`);
      setClubes(response.data);
    } catch (error) {
      console.error("Error al obtener los clubes:", error);
    }
  };

  const handleClubClick = (clubId) => {
    navigate(`/clubes/perfil/${clubId}`);
  };

  return (
    <div className="clubes-container">
      <h2 className="clubes-title">Clubes</h2>
      <div className="clubes-grid">
        {clubes.map((club) => (
          <div
            key={club.id}
            className="club-card"
            onClick={() => handleClubClick(club.id)}
          >
            <img
              src={club.club_imagen}
              alt={`${club.nombre} logo`}
              className="club-logo"
            />
            <h3 className="club-name">{club.nombre}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaClubesUsuario;
