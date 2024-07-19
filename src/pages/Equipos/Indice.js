import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/ClubesIndice.css'; // Asumimos que tienes este archivo para los estilos

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
      const user_id = 1; // Reemplaza esto según el manejo de autenticación
      await axios.put(`http://localhost:5002/api/equipo/delete_equipo/${equipoToDelete}`, { user_id });
      setEquipos(equipos.filter(equipo => equipo.id !== equipoToDelete));
      setShowConfirm(false);
      setEquipoToDelete(null);
    } catch (error) {
      console.error('Error al eliminar el equipo:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setEquipoToDelete(null);
  };

  return (
    <div className="clubes-lista">
      <h2>Lista de Equipos</h2>
      <button className="editar-btn" onClick={handleRegistrarClick}>Registrar</button>
      <table>
        <thead>
          <tr>
            <th>Nombre del Equipo</th>
            <th>Nombre del Club</th>
            <th>Nombre de la Categoría</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {equipos.map((equipo) => (
            <tr key={equipo.id}>
              <td>{equipo.nombre}</td>
              <td>{equipo.club_nombre}</td> {/* Mostrar el nombre del club */}
              <td>{equipo.categoria_nombre}</td> {/* Mostrar el nombre de la categoría */}
              <td>
                <button className="editar-btn" onClick={() => handleEditClick(equipo.id)}>Editar</button>
                <button className="eliminar-btn" onClick={() => handleDeleteClick(equipo.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirm && (
        <div className="confirm-modal">
          <p>¿Seguro que quieres eliminar este equipo?</p>
          <button className="confirm-btn" onClick={handleConfirmDelete}>Sí</button>
          <button className="cancel-btn" onClick={handleCancelDelete}>No</button>
        </div>
      )}
    </div>
  );
};

export default ListaEquipos;
