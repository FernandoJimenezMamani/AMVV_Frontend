import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import RegistrarJugador from './Registrar';
import EditarJugador from './Editar';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PerfilJugadorModal from './Perfil';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';
import { Select } from 'antd';
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';
import rolMapping from '../../constants/roles';

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
  const [showPerfilModal, setShowPerfilModal] = useState(false);  
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const [filterState, setFilterState] = useState('No filtrar');
  const [searchName, setSearchName] = useState('');
  const [personaToDelete, setPersonaToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Número de jugadores por página  
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
    setSelectedPersonaId(jugadorId);  
    setShowPerfilModal(true);
  };

  const handleDeleteClick = (id) => {
    setPersonaToDelete(id);
    setShowConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setPersonaToDelete(null);
  };

  const handleEditClick = (personaId) => {
    setSelectedPersonaId(personaId);  
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
    setSelectedPersonaId(null);  
  };

  const handleClosePerfilModal = () => {
    setShowPerfilModal(false);
    setSelectedPersonaId(null);  
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
  };

  const handleConfirmDelete = async () => {
    console.log("ID a eliminar:", personaToDelete); 
    try {
      const user_id = 1; 
      await axios.put(`${API_BASE_URL}/persona/delete_persona/${personaToDelete}`, { user_id , roles:rolMapping.Jugador});
      toast.success('Usuario desactivado exitosamente');
      fetchJugadores();
      setShowConfirm(false); 
      setPersonaToDelete(null); 
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
  
  const getImagenPerfil = (jugador) => {
    if (jugador.imagen_persona) {
      return jugador.imagen_persona; 
    }
    return jugador.genero_persona === 'V' ? defaultUserMenIcon : defaultUserWomenIcon; 
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPersonas.slice(indexOfFirstItem, indexOfLastItem);
  
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
        jugadorId={selectedPersonaId}  
        onJugadorUpdated={fetchJugadores} 
      />

      <PerfilJugadorModal
        isOpen={showPerfilModal}
        onClose={handleClosePerfilModal}
        jugadorId={selectedPersonaId}  
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
          {currentItems.map((jugador) => (
            <tr key={jugador.jugador_id} className="table-row">
              <td className="table-td-p">
                <img
                  src={getImagenPerfil(jugador)}
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

                <button
                  className={`table-button button-view ${jugador.eliminado === 'S' ? 'disabled-button' : ''}`}
                  onClick={() => handleProfileClick(jugador.persona_id)}
                  disabled={jugador.eliminado === 'S'} 
                >
                  <RemoveRedEyeIcon />
                </button>

                <button
                  className={`table-button button-edit ${jugador.eliminado === 'S' ? 'disabled-button' : ''}`}
                  onClick={() => handleEditClick(jugador.persona_id)}
                  disabled={jugador.eliminado === 'S'} 
                >
                  <EditIcon />
                </button>

                
              </td>
            </tr>
          ))}
        </tbody>
        
      </table>
      <div className="card-container">
        {currentItems.map((jugador) => (
          <div key={jugador.jugador_id} className="card-item">
            <img
              src={getImagenPerfil(jugador)}
              alt={`${jugador.nombre_persona} ${jugador.apellido_persona}`}
              className="card-photo"
            />
            <div className="card-content">
              <p className="card-title">{jugador.nombre_persona} {jugador.apellido_persona}</p>
              <div className="card-actions">
                <button
                  onClick={() => handleProfileClick(jugador.persona_id)}
                  className="card-btn-view"
                  disabled={jugador.eliminado === 'S'}
                >
                  <RemoveRedEyeIcon />
                </button>
                <button
                  onClick={() => handleEditClick(jugador.persona_id)}
                  className="card-btn-edit"
                  disabled={jugador.eliminado === 'S'}
                >
                  <EditIcon />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination-container">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Anterior
        </button>

        <span className="pagination-info">
          Página {currentPage} de {Math.ceil(filteredPersonas.length / itemsPerPage)}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredPersonas.length / itemsPerPage)}
          className="pagination-button"
        >
          Siguiente
        </button>
      </div>


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
