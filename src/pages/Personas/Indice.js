import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/IndiceTabla.css'; 

const ListaPersonas = () => {
  const [personas, setPersonas] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [personaToDelete, setPersonaToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/persona/get_persona');
        setPersonas(response.data);
      } catch (error) {
        console.error('Error al obtener las personas:', error);
      }
    };

    fetchPersonas();
  }, []);

  const handleEditClick = (personaId) => {
    navigate(`/personas/editar/${personaId}`);
  };

  const handleDeleteClick = (personaId) => {
    setPersonaToDelete(personaId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const user_id = 1; 
      await axios.put(`http://localhost:5002/api/persona/delete_persona/${personaToDelete}`, { user_id });
      setPersonas(personas.filter(persona => persona.id !== personaToDelete));
      setShowConfirm(false);
      setPersonaToDelete(null);
    } catch (error) {
      console.error('Error al eliminar la persona:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setPersonaToDelete(null);
  };

  const handleProfileClick = (personaId) => {
    navigate(`/personas/perfil/${personaId}`);
  };

  return (
    <div className="clubes-lista">
      <h2 className="clubes-lista-titulo">Lista de Personas</h2>
      <table className="clubes-lista-tabla">
        <thead className="clubes-lista-thead">
          <tr>
            <th ></th>
            <th>Foto</th>
            <th className="clubes-lista-th">Nombre del jugador</th>
            <th className="clubes-lista-th">Fecha de Nacimiento</th>
            <th className="clubes-lista-th">Acción</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((persona) => (
            <tr key={persona.id}>
              <td></td>
              <td className="clubes-lista-td"><img src={persona.persona_imagen} alt={`${persona.nombre} ${persona.apellido}`} className="club-logo" /></td>
              <td className="clubes-lista-td-nombre">{persona.nombre} {persona.apellido}</td>
              <td className="clubes-lista-td">{new Date(persona.fecha_nacimiento).toLocaleDateString()}</td>
              <td className="clubes-lista-td">
                <button className="club-button perfil-btn" onClick={() => handleProfileClick(persona.id)}>Perfil</button>
                <button className="club-button editar-btn" onClick={() => handleEditClick(persona.id)}>Editar</button>
                <button className="club-button eliminar-btn" onClick={() => handleDeleteClick(persona.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirm && (
        <div className="confirm-modal">
          <p>¿Seguro que quieres eliminar esta persona?</p>
          <button className="confirm-btn" onClick={handleConfirmDelete}>Sí</button>
          <button className="cancel-btn" onClick={handleCancelDelete}>No</button>
        </div>
      )}
    </div>
  );
};

export default ListaPersonas;
