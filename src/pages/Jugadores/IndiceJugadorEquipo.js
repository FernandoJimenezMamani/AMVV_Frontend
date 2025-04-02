import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import { Select } from 'antd';
import RegistrarJugador from './Registrar';
import EditarJugador from './Editar';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import { useLocation } from 'react-router-dom';
import { Jugador } from '../../constants/roles';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';
import PerfilJugadorModal from './Perfil';

const { Option } = Select;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ListaJugadoresEquipo = () => {
  const location = useLocation();
  const { clubId, categoriaId ,equipoId} = location.state || {};
  const [jugadores, setJugadores] = useState([]);
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showConfirmRegister, setShowConfirmRegister] = useState(false);
  const [jugadorToFichar, setJugadorToFichar] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);  
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const [filterState, setFilterState] = useState('No filtrar');
  const [searchName, setSearchName] = useState('');
  const [personaToDelete, setPersonaToDelete] = useState(null);
  const [equipo, setEquipo] = useState(null);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [showPerfilModal, setShowPerfilModal] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchJugadores();
  }, []);

  useEffect(() => {
    if (equipoId) {
      fetchEquipoById();
    }
  }, [equipoId]);

   useEffect(() => {
      applyFilters();
    }, [ filterState, searchName, jugadores]);

  const fetchJugadores = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/jugador/get_jugador_club_Category`,
        {
          club_id: clubId,
          categoria_id: categoriaId,
          id_equipo:equipoId
        }
      ); // Cambiado para obtener todos los jugadores
      console.log("Jugadores recibidos:", response.data); 
      setJugadores(response.data);
    } catch (error) {
      toast.error('Error al obtener los jugadores');
      console.error('Error al obtener los jugadores:', error);
    }
  };

  const fetchEquipoById = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/equipo/get_equipo/${equipoId}`);
      console.log('Datos del equipo:', response.data); // Verifica qué datos está devolviendo la API
      setEquipo(response.data);
    } catch (error) {
      toast.error('Error al obtener el equipo');
      console.error('Error al obtener el equipo:', error);
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

  const handleClosePerfilModal = () => {
    setShowPerfilModal(false);
    setSelectedPersonaId(null);  
  };

  const handleFicharClick = (jugadorId) => {
    setJugadorToFichar(jugadores.find(jugador => jugador.jugador_id === jugadorId));
    setShowConfirm(true);
  };

  const handleDeleteClick = (id) => {
    setPersonaToDelete(id);
    setShowConfirm(true);
  };
  

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setPersonaToDelete(null);
  };

  const handleCancelRegister = () => {
    setShowConfirmRegister(false);
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

  const handleConfirmRegister = async (jugador_id) => {
    try{
      const data = {
        equipo_id: equipoId, 
        jugador_id: jugador_id, 
      };
      console.log('Datos a enviar:', data);
      await axios.post(`${API_BASE_URL}/jugador/post_jugadorEquipo`, data);
      toast.success("Jugador registrado exitosamente en el equipo");
      setShowConfirmRegister(false); 
      fetchJugadores();
    }catch (error) {
      toast.error('Error al registrar el usuario');
      console.error('Error al registrar la persona:', error);
    }
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

  const getImagenPerfil = (jugador) => {
    if (jugador.imagen_persona) {
      return jugador.imagen_persona; 
    }
    return jugador.genero === 'V' ? defaultUserMenIcon : defaultUserWomenIcon; 
  };

  return (
    <div className="table-container">
      <h2 className="table-title">
        {equipo ? `Añadir jugadores al Equipo ${equipo.equipo_nombre}` : "Cargando equipo..."}
      </h2>

      <div className="table-filters">
        <p></p>

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
            <th className="table-th-p">Edad</th>
            <th className="table-th-p">C.I</th>
            <th className="table-th-p">Club Actual</th>
            <th className="table-th-p">Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredPersonas.map((jugador) => (
            <tr key={jugador.jugador_id} className="table-row" >
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
                {jugador.edad_jugador}
              </td>
              <td className="table-td-p">
                {jugador.ci_persona}
              </td>
              <td className="table-td-p">
                {jugador.nombre_club || 'Sin Club'}
              </td>

              <td className="table-td-p">

                {/* Botones de acción siempre visibles */}
                <button
                className={`table-button button-add ${jugador.eliminado === 'S' ? 'disabled-button' : ''}`}
                onClick={() => {
                  setJugadorSeleccionado(jugador); // Guarda los datos del jugador seleccionado
                  setShowConfirmRegister(true); // Abre el modal de confirmación
                }}
                disabled={jugador.eliminado === 'S'} // Desactiva el botón si el jugador está eliminado
              >
                <PersonAddAlt1Icon />
              </button>

                <button
                  className={`table-button button-view ${jugador.eliminado === 'S' ? 'disabled-button' : ''}`}
                  onClick={() => handleProfileClick(jugador.persona_id)}
                  disabled={jugador.eliminado === 'S'} // Desactiva el botón si el usuario está eliminado
                >
                  <RemoveRedEyeIcon />
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

      <ConfirmModal
        visible={showConfirmRegister}
        onConfirm={() => handleConfirmRegister(jugadorSeleccionado?.jugador_id)}
        onCancel={handleCancelRegister}
        message={`¿Seguro que quieres añadir al jugador ${jugadorSeleccionado?.nombre_persona} ${jugadorSeleccionado?.apellido_persona}? al equipo ${equipo?.equipo_nombre}`}
      />
    </div>

  );
};


export default ListaJugadoresEquipo;