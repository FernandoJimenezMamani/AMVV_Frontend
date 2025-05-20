import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import RegistroPersona from './Registrar';
import EditarPersona from './Editar';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import defaultUserIcon from '../../assets/img/user-icon.png';
import { PresidenteClub } from '../../constants/roles';
import { Select } from 'antd';
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';
import { useCampeonato } from '../../context/CampeonatoContext';

const { Option } = Select;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaPersonas = () => {
  const [personas, setPersonas] = useState([]);
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [personaToDelete, setPersonaToDelete] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); 
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const [filterRole, setFilterRole] = useState('No filtrar');
  const [filterState, setFilterState] = useState('No filtrar');
  const [searchName, setSearchName] = useState('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { campeonatoEnCurso, campeonatoEnTransaccion } = useCampeonato();
  useEffect(() => {
    fetchPersonas();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterRole, filterState, searchName, personas]);

  const fetchPersonas = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/persona/get_persona`);
      
      setPersonas(res.data);

    } catch (error) {
      console.error('Error al obtener las personas:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...personas];

    // Filtrar por rol
    if (filterRole !== 'No filtrar') {
      filtered = filtered.filter((p) =>
        p.roles.split(', ').includes(filterRole)
      );
    }

    // Filtrar por estado
    if (filterState !== 'No filtrar') {
      filtered = filtered.filter((p) =>
        filterState === 'Activo' ? p.eliminado === 'N' : p.eliminado === 'S'
      );
    }

    // Filtrar por nombre
    if (searchName) {
      filtered = filtered.filter((p) =>
        `${p.nombre} ${p.apellido}`
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }

    setFilteredPersonas(filtered);
  };

  const handleEditClick = (personaId) => {
    setSelectedPersonaId(personaId); 
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPersonaId(null); 
  };

  const handleRegistrarClick = () => {
    setShowFormModal(true);
    console.log('Modal abierto:', showFormModal);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
  };

  const handleDeleteClick = (id,roles) => {
    setPersonaToDelete({ id, roles });
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const user_id = 1; 
      const { id, roles } = personaToDelete; 
  
      await axios.put(`${API_BASE_URL}/persona/delete_persona/${id}`, {
        user_id,
        roles: roles.split(',').map((role) => role.trim()),
      });
  
      toast.success('Usuario desactivado exitosamente');
      fetchPersonas(); 
      setShowConfirm(false); 
      setPersonaToDelete(null); 
    } catch (error) {
      toast.error('Error al desactivar el usuario');
      console.error('Error al eliminar la persona:', error);
    }
  };
  
  

  const handleActivateUser = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/persona/activatePersona/${id}`);
      toast.success('Usuario activado exitosamente');
      fetchPersonas();
    } catch (error) {
      toast.error('Error al activar el usuario');
      console.error('Error al activar usuario:', error);
    }
  };  

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setPersonaToDelete(null);
  };

  const handleProfileClick = (id) => {
    navigate(`/personas/perfil/${id}`);
  };

  const getImagenPerfil = (persona) => {
    if (persona.persona_imagen) {
      return persona.persona_imagen; 
    }
    return persona.genero_persona === 'V' ? defaultUserMenIcon : defaultUserWomenIcon; 
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPersonas.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <div className="table-container">
      <h2 className="table-title">Lista de Usuarios</h2>
      <div className="table-filters">
      <button className="table-add-button" onClick={handleRegistrarClick} >+1 Usuario</button>
      <Select
            className="filter-select"
            placeholder="Filtrar por rol"
            value={filterRole}
            onChange={(value) => setFilterRole(value)}
            style={{ width: 180, marginRight: 10 }}
          >
            <Option value="No filtrar">No filtrar</Option>
            <Option value="Jugador">Jugador</Option>
            <Option value="PresidenteClub">Presidente de Club</Option>
            <Option value="DelegadoClub">Delegado de Club</Option>
            <Option value="Arbitro">Árbitro</Option>
            <Option value="Tesorero">Tesorero</Option>
       </Select>

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
      
      <RegistroPersona
        isOpen={showFormModal}
        onClose={handleCloseModal}
        onPersonaCreated={fetchPersonas} 
      />
      <EditarPersona
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        personaId={selectedPersonaId}  // Pasamos el id como prop
        onPersonaUpdated={fetchPersonas} 
      />
      <table className="table-layout">
        <thead className="table-head">
          <tr>
            <th className="table-th-p">Foto</th>
            <th className="table-th-p">Nombre del Jugador</th>
            <th className="table-th-p">Fecha de Nacimiento</th>
            <th className="table-th-p">C.I</th>
            <th className="table-th-p">Correo</th>
            <th className="table-th-p">Rol</th>
            <th className="table-th-p">Acción</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((p) => (
            <tr key={p.id} className="table-row">
              <td className="table-td-p">
                <img
                  src={getImagenPerfil(p)}
                  alt={`${p.nombre} ${p.apellido}`}
                  className="table-logo"
                />
              </td>


              <td className="table-td-p table-td-name">
                {p.nombre} {p.apellido}
              </td>
              <td className="table-td-p">
                {new Date(p.fecha_nacimiento).toLocaleDateString()}
              </td>
              <td className="table-td-p">
                {p.ci}
              </td>
              <td className="table-td-p">
                {p.correo}
              </td>
              <td className="table-td-p">
                {p.roles.split(', ').map((role, index) => (
                  
                  <div key={index}>{role}</div>
                ))}
              </td>
              <td className="table-td-p">

                <button
                  className={`table-button button-edit ${p.eliminado === 'S' ? 'disabled-button' : ''}`}
                  onClick={() => handleEditClick(p.id)}
                  disabled={p.eliminado === 'S'} // Desactiva el botón si el usuario está eliminado
                >
                  <EditIcon />
                </button>
                {(campeonatoEnTransaccion &&
                  <label className="user-activation-switch">
                  <input
                    type="checkbox"
                    onChange={() =>
                      p.eliminado === 'S' ? handleActivateUser(p.id) : handleDeleteClick(p.id,p.roles)
                    }
                    checked={p.eliminado !== 'S'} // Marcado si no está eliminado
                  />
                  <span className="user-activation-slider"></span>
                </label>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
        <div className="card-container">
          {currentItems.map((p) => (
            <div key={p.id} className="card-item">
              <img
                src={getImagenPerfil(p)}
                alt={`${p.nombre} ${p.apellido}`}
                className="card-photo"
              />
              <div className="card-content">
                <p className="card-title">{p.nombre} {p.apellido}</p>
                <p className="card-subinfo">C.I: {p.ci}</p>
                <div className="card-actions">
                  <button
                    onClick={() => handleEditClick(p.id)}
                    className="card-btn-edit"
                    disabled={p.eliminado === 'S'}
                  >
                    <EditIcon />
                  </button>

                  {campeonatoEnTransaccion && (
                    <label className="user-activation-switch">
                      <input
                        type="checkbox"
                        onChange={() =>
                          p.eliminado === 'S'
                            ? handleActivateUser(p.id)
                            : handleDeleteClick(p.id, p.roles)
                        }
                        checked={p.eliminado !== 'S'}
                      />
                      <span className="user-activation-slider"></span>
                    </label>
                  )}
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

export default ListaPersonas;
