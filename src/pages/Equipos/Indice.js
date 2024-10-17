import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';

const ListaEquipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [equipoToDelete, setEquipoToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/equipo/get_equipo');
        setEquipos(response.data);
      } catch (error) {
        toast.error('error')
        console.error('Error al obtener los equipos:', error);
      }
    };

    fetchEquipos();
  }, []);

  const handleEditClick = (equipoId) => {
    navigate(`/equipos/editar/${equipoId}`);
  };

  const handleRegistrarClick = () => {
    navigate(`/equipos/registrar`);
  };

  const handleDeleteClick = (equipoId) => {
    setEquipoToDelete(equipoId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const user_id = 1; 
      await axios.put(`http://localhost:5002/api/equipo/delete_equipo/${equipoToDelete}`, { user_id });
      setEquipos(equipos.filter(equipo => equipo.id !== equipoToDelete));
      setShowConfirm(false);
      setEquipoToDelete(null);
    } catch (error) {
      toast.error('error')
      console.error('Error al eliminar el equipo:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setEquipoToDelete(null);
  };

  return (
    <div className="clubes-lista">
      <h2 className="clubes-lista-titulo">Lista de Equipos</h2>
      <button className="club-button" onClick={handleRegistrarClick}>Registrar Equipo</button>
      <table className="clubes-lista-tabla">
        <thead className="clubes-lista-thead">
          <tr>
            <th>Nombre del Equipo</th>
            <th>Nombre del Club</th>
            <th>Nombre de la Categoría</th>
            <th className="clubes-lista-th">Acción</th>
          </tr>
        </thead>
        <tbody>
          {equipos.map((equipo) => (
            <tr key={equipo.id}>
              <td>{equipo.nombre}</td>
              <td>{equipo.club_nombre}</td>
              <td>{equipo.categoria_nombre}</td>
              <td className="clubes-lista-td">
                <button className="club-button editar-btn" onClick={() => handleEditClick(equipo.id)}>Editar</button>
                <button className="club-button eliminar-btn" onClick={() => handleDeleteClick(equipo.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        visible={showConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="¿Seguro que quieres eliminar este equipo?"
      />
    </div>
  );
};

export default ListaEquipos;
