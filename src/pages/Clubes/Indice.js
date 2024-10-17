import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
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
        toast.error('error')
        console.error('Error al obtener los clubes:', error);
      }
    };

    fetchClubes();
  }, []);

  const handleEditClick = (clubId) => {
    navigate(`/clubes/editar/${clubId}`);
  };

  const handleRegistrarClick = () => {
    navigate(`/clubes/registrar`);
  };

  const handleDeleteClick = (clubId) => {
    setClubToDelete(clubId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const user_id = 1; 
      await axios.put(`http://localhost:5002/api/club/delete_club/${clubToDelete}`, { user_id });
      setClubes(clubes.filter(club => club.id !== clubToDelete));
      setShowConfirm(false);
      setClubToDelete(null);
    } catch (error) {
      toast.error('error')
      console.error('Error al eliminar el club:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setClubToDelete(null);
  };

  const handleProfileClick = (clubId) => {
    navigate(`/clubes/perfil/${clubId}`);
  };

  return (
    <div className="clubes-lista">
      <h2 className="clubes-lista-titulo">Lista de Clubes</h2>
      <table className="clubes-lista-tabla">
        <thead className="clubes-lista-thead">
          <tr>
            <th></th>
            <th>Logo</th>
            <th className="clubes-lista-th">Nombre</th>
            <th className="clubes-lista-th">Acción</th>
          </tr>
        </thead>
        <tbody>
          {clubes.map((club) => (
            <tr key={club.id}>
              <td></td>
              <td className="clubes-lista-td"><img src={club.club_imagen} alt={`${club.nombre} logo`} className="club-logo" /></td>
              <td className="clubes-lista-td-nombre">{club.nombre}</td>
              <td className="clubes-lista-td">
                <button className="club-button perfil-btn" onClick={() => handleProfileClick(club.id)}>Perfil</button>
                <button className="club-button editar-btn" onClick={() => handleEditClick(club.id)}>Editar</button>
                <button className="club-button eliminar-btn" onClick={() => handleDeleteClick(club.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        visible={showConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="¿Seguro que quieres eliminar este club?"
      />
    </div>
  );
};

export default ListaClubes;
