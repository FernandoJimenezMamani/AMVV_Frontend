import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';

const ListaArbitros = () => {
  const [arbitros, setArbitros] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [arbitroToDelete, setArbitroToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArbitros = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/arbitro/get_arbitros');
        console.log("Arbitros recibidos:", response.data);
        setArbitros(response.data);
      } catch (error) {
        console.error('Error al obtener los árbitros:', error);
      }
    };

    fetchArbitros();
  }, []);

  const handleEditClick = (arbitroId) => {
    navigate(`/arbitros/editar/${arbitroId}`);
  };

  const handleDeleteClick = (arbitroId) => {
    setArbitroToDelete(arbitroId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const user_id = 1; // Simulación de usuario autenticado
      await axios.put(`http://localhost:5002/api/arbitro/delete_arbitro/${arbitroToDelete}`, { user_id });
      setArbitros(arbitros.filter(arbitro => arbitro.id !== arbitroToDelete));
      setShowConfirm(false);
      setArbitroToDelete(null);
    } catch (error) {
      console.error('Error al eliminar el árbitro:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setArbitroToDelete(null);
  };

  return (
    <div className="clubes-lista">
      <h2 className="clubes-lista-titulo">Lista de Árbitros</h2>
      <table className="clubes-lista-tabla">
        <thead className="clubes-lista-thead">
          <tr>
            <th>Foto</th>
            <th className="clubes-lista-th">Nombre del Árbitro</th>
            <th className="clubes-lista-th">Fecha de Nacimiento</th>
            <th className="clubes-lista-th">Acción</th>
          </tr>
        </thead>
        <tbody>
          {arbitros.map((arbitro) => (
            <tr key={arbitro.id}>
              <td className="clubes-lista-td">
                <img src={arbitro.persona_imagen} alt={`${arbitro.nombre} ${arbitro.apellido}`} className="club-logo" />
              </td>
              <td className="clubes-lista-td-nombre">
                {arbitro.nombre} {arbitro.apellido}
              </td>
              <td className="clubes-lista-td">
                {new Date(arbitro.fecha_nacimiento).toLocaleDateString()}
              </td>
              <td className="clubes-lista-td">
                <button className="club-button editar-btn" onClick={() => handleEditClick(arbitro.id)}>Editar</button>
                <button className="club-button eliminar-btn" onClick={() => handleDeleteClick(arbitro.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        visible={showConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="¿Seguro que quieres eliminar este árbitro?"
      />
    </div>
  );
};

export default ListaArbitros;
