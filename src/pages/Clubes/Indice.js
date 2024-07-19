import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/ClubesIndice.css'; // Asumimos que tienes este archivo para los estilos

const ListaClubes = () => {
  const [clubes, setClubes] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [clubToDelete, setClubToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubes = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/club/get_club');
        setClubes(response.data);
      } catch (error) {
        console.error('Error al obtener los clubes:', error);
      }
    };

    fetchClubes();
  }, []);

  const handleEditClick = (clubId) => {
    navigate(`/clubes/editar/${clubId}`);
  };

  const handleRegistrarClick = (clubId) => {
    navigate(`/clubes/registrar`);
  };

  const handleDeleteClick = (clubId) => {
    setClubToDelete(clubId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const user_id = 1; // Reemplaza esto según el manejo de autenticación
      await axios.put(`http://localhost:5002/api/club/delete_club/${clubToDelete}`, { user_id });
      setClubes(clubes.filter(club => club.id !== clubToDelete));
      setShowConfirm(false);
      setClubToDelete(null);
    } catch (error) {
      console.error('Error al eliminar el club:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setClubToDelete(null);
  };

  return (
    <div className="clubes-lista">
      <h2>Lista de Clubes</h2>
      <button className="editar-btn"  onClick={() => handleRegistrarClick()}>Registrar</button>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {clubes.map((club) => (
            <tr key={club.id}>
              <td>{club.nombre}</td>
              <td>{club.descripcion}</td>
              <td>
                <button className="editar-btn" onClick={() => handleEditClick(club.id)}>Editar</button>
                <button className="eliminar-btn" onClick={() => handleDeleteClick(club.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirm && (
        <div className="confirm-modal">
          <p>¿Seguro que quieres eliminar este club?</p>
          <button className="confirm-btn" onClick={handleConfirmDelete}>Sí</button>
          <button className="cancel-btn" onClick={handleCancelDelete}>No</button>
        </div>
      )}
    </div>
  );
};

export default ListaClubes;
