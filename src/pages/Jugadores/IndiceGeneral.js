import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import RegistrarJugador from './Registrar';
import EditarJugador from './Editar';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import { Select } from 'antd';


const { Option } = Select;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaJugadoresAll = () => {

  const [jugadores, setJugadores] = useState([]);
  const [presidente, setPresidente] = useState([]);
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmTraspaso,setShowConfirmTraspaso] = useState(false);
  const [jugadorToFichar, setJugadorToFichar] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);  
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const [filterState, setFilterState] = useState('No filtrar');
  const [searchName, setSearchName] = useState('');
  const [personaToDelete, setPersonaToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchJugadores();
    fetchPresidente();
  }, []);

   useEffect(() => {
      applyFilters();
    }, [ filterState, searchName, jugadores]);

  const fetchJugadores = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jugador/jugadores`); // Cambiado para obtener todos los jugadores
      console.log("Jugadores recibidos:", response.data); 
      setJugadores(response.data);
    } catch (error) {
      toast.error('Error al obtener los jugadores');
      console.error('Error al obtener los jugadores:', error);
    }
  };

  const fetchPresidente = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user')); // Convierte el JSON a objeto
      const userId = user?.id;
      console.log('hola perra', userId)
      const response = await axios.get(`${API_BASE_URL}/presidente_club/get_presidenteById/${userId}`); // Cambiado para obtener todos los jugadores
      console.log("presidente recibidos:", response.data); 
    
      setPresidente(response.data);
    } catch (error) {
      toast.error('Error al obtener los jugadores');
      console.error('Error al obtener los jugadores:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...jugadores];

    // Filtrar por estado
    if (filterState !== 'No filtrar') {
      filtered = filtered.filter((jugador) =>
        filterState === 'Activo' ? jugador.eliminado === 'N' : jugador.eliminado === 'S'
      );
    }

    // Filtrar por nombre
    if (searchName) {
      filtered = filtered.filter((jugador) =>
        `${jugador.nombre_persona} ${jugador.apellido_persona}`
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }

    setFilteredPersonas(filtered);
  };

  const handleProfileClick = (jugadorId) => {
    navigate(`/personas/perfil/${jugadorId}`);
  };

  const handleFicharClick = (jugadorId) => {
    setJugadorToFichar(jugadores.find(jugador => jugador.jugador_id === jugadorId));
    setShowConfirmTraspaso(true);
  };

  const handleDeleteClick = (id) => {
    setPersonaToDelete(id);
    setShowConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setPersonaToDelete(null);
  };

  const handleConfirmFichar = async () => {
    if (!jugadorToFichar) return;
  
    try {
  
      // Llama al endpoint de crear traspaso en el backend
      await axios.post(`${API_BASE_URL}/traspaso/crear`, {
        jugador_id: jugadorToFichar.jugador_id,
        club_origen_id: jugadorToFichar.club_id, // Usamos el ID del club actual del jugador
        club_destino_id: presidente.club_presidente, // Usamos el ID del club del presidente como destino
        fecha_solicitud: new Date().toISOString().slice(0, 10),
        estado_solicitud: 'PENDIENTE'
      });
  
      toast.success('Traspaso solicitado correctamente');
      setShowConfirmTraspaso(false);
      setJugadorToFichar(null);
    } catch (error) {
      toast.error('Error al solicitar el traspaso');
      console.error('Error al crear el traspaso:', error);
      setShowConfirm(false);
      setJugadorToFichar(null);
    }
  };  

  const handleEditClick = (personaId) => {
    setSelectedPersonaId(personaId);  // Guarda el id de persona seleccionado
    setShowEditModal(true);
  };

  const handleCancelFichar = () => {
    setShowConfirmTraspaso(false);
    setJugadorToFichar(null);
  };

  const handleRegistrarClick = () => {
    setShowFormModal(true);
    console.log('Modal abierto:', showFormModal);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPersonaId(null);  // Resetea el id seleccionado
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const user_id = 1; // Cambiar esto si necesitas un valor dinámico
      await axios.put(`${API_BASE_URL}/persona/delete_persona/${personaToDelete}`, { user_id });
      toast.success('Usuario desactivado exitosamente');
      fetchJugadores();
      setShowConfirm(false); // Cierra el modal
      setPersonaToDelete(null); // Limpia el ID almacenado
    } catch (error) {
      toast.error('Error al desactivar el usuario');
      console.error('Error al eliminar la persona:', error);
    }
  };
  

  const handleActivateUser = async (id) => {
    try {
      // Lógica para activar al usuario
      await axios.put(`${API_BASE_URL}/persona/activatePersona/${id}`);
      toast.success('Usuario activado exitosamente');
      fetchJugadores(); // Actualiza la lista de usuarios
    } catch (error) {
      toast.error('Error al activar el usuario');
      console.error('Error al activar usuario:', error);
    }
  };  

  return (
    <div className="table-container">
      <h2 className="table-title">Jugadores</h2>
      <div className="table-filters">
      <button className="table-add-button" onClick={handleRegistrarClick} >+1 Jugador</button>
      <Select
            className="filter-select"
            placeholder="Filtrar por estado"
            value={filterState}
            onChange={(value) => setFilterState(value)}
            style={{ width: 180, marginRight: 10 }}
          >
            <Option value="No filtrar">No filtrar</Option>
            <Option value="Activo">Activo</Option>
            <Option value="Inactivo">Inactivo</Option>
        </Select>

          <input
            type="text"
            placeholder="Buscar por nombre"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="search-box"
          />
      </div>
      
      <RegistrarJugador
        isOpen={showFormModal}
        onClose={handleCloseModal}
        onJugadorCreated={fetchJugadores} 
      />
      <EditarJugador
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        jugadorId={selectedPersonaId}  // Pasamos el id como prop
        onJugadorUpdated={fetchJugadores} 
      />
      <table className="table-layout">
        <thead className="table-head">
          <tr>
            <th className="table-th-p">Foto</th>
            <th className="table-th-p">Nombre del Jugador</th>
            <th className="table-th-p">Fecha de Nacimiento</th>
            <th className="table-th-p">Club Actual</th>
            <th className="table-th-p">Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredPersonas.map((jugador) => (
            <tr key={jugador.jugador_id} className="table-row">
              <td className="table-td-p">
                <img
                  src={jugador.imagen_persona}
                  alt={`${jugador.nombre} ${jugador.apellido}`}
                  className="table-logo"
                />
              </td>
              <td className="table-td-p">
                {jugador.nombre_persona} {jugador.apellido_persona}
              </td>
              <td className="table-td-p">
                {new Date(jugador.fecha_nacimiento_persona).toLocaleDateString()}
              </td>
              <td className="table-td-p">
                {jugador.nombre_club || 'Sin Club'}
              </td>

              <td className="table-td-p">

                {/* Botones de acción siempre visibles */}
                <button
                  className={`table-button button-view ${jugador.eliminado === 'S' ? 'disabled-button' : ''}`}
                  onClick={() => handleProfileClick(jugador.id)}
                  disabled={jugador.eliminado === 'S'} // Desactiva el botón si el usuario está eliminado
                >
                  <RemoveRedEyeIcon />
                </button>

                <button
                  className={`table-button button-edit ${jugador.eliminado === 'S' ? 'disabled-button' : ''}`}
                  onClick={() => handleEditClick(jugador.persona_id)}
                  disabled={jugador.eliminado === 'S'} // Desactiva el botón si el usuario está eliminado
                >
                  <EditIcon />
                </button>

                <label className="user-activation-switch">
                  <input
                    type="checkbox"
                    onChange={() =>
                      jugador.eliminado === 'S' ? handleActivateUser(jugador.persona_id) : handleDeleteClick(jugador.persona_id)
                    }
                    checked={jugador.eliminado !== 'S'} // Marcado si no está eliminado
                  />
                  <span className="user-activation-slider"></span>
                </label>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        visible={showConfirmTraspaso}
        onConfirm={handleConfirmFichar}
        onCancel={handleCancelFichar}
        message="¿Seguro que quieres fichar a este jugador?"
      />

      <ConfirmModal
        visible={showConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="¿Seguro que quieres eliminar esta persona?"
      />
      
    </div>

  );
};

export default ListaJugadoresAll;
