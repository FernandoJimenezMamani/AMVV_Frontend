import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';

const ListaPersonas = () => {
  const [personas, setPersonas] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [personaToDelete, setPersonaToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const res = await axios.get('http://localhost:5002/api/persona/get_persona');
        setPersonas(res.data);
      } catch (error) {
        console.error('Error al obtener las personas:', error);
      }
    };

    fetchPersonas();
  }, []);

  const handleEditClick = (id) => {
    navigate(`/personas/editar/${id}`);
  };

  const handleDeleteClick = (id) => {
    setPersonaToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const user_id = 1;
      await axios.put(`http://localhost:5002/api/persona/delete_persona/${personaToDelete}`, { user_id });
      setPersonas(personas.filter(p => p.id !== personaToDelete));
      setShowConfirm(false);
      setPersonaToDelete(null);
    } catch (error) {
      toast.error('error')
      console.error('Error al eliminar la persona:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setPersonaToDelete(null);
  };

  const handleProfileClick = (id) => {
    navigate(`/personas/perfil/${id}`);
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Lista de Personas</h2>
      <table className="table-layout">
        <thead className="table-head">
          <tr>
            <th></th>
            <th>Foto</th>
            <th className="table-th">Nombre del Jugador</th>
            <th className="table-th">Fecha de Nacimiento</th>
            <th className="table-th">Acción</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((p) => (
            <tr key={p.id} className="table-row">
              <td></td>
              <td className="table-td">
                <img
                  src={p.persona_imagen}
                  alt={`${p.nombre} ${p.apellido}`}
                  className="table-logo"
                />
              </td>
              <td className="table-td table-td-name">
                {p.nombre} {p.apellido}
              </td>
              <td className="table-td">
                {new Date(p.fecha_nacimiento).toLocaleDateString()}
              </td>
              <td className="table-td">
                <button
                  className="table-button button-view"
                  onClick={() => handleProfileClick(p.id)}
                >
                  Perfil
                </button>
                <button
                  className="table-button button-edit"
                  onClick={() => handleEditClick(p.id)}
                >
                  Editar
                </button>
                <button
                  className="table-button button-delete"
                  onClick={() => handleDeleteClick(p.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        visible={showConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="¿Seguro que quieres eliminar esta persona?"
      />
    </div>

  );
};

export default ListaPersonas;
