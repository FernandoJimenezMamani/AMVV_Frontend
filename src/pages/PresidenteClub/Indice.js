import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import RegistroPresidente from './Registrar';
import EditarPresidente from './Editar';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import defaultUserIcon from '../../assets/img/user-icon.png';
import { PresidenteClub } from '../../constants/roles';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import { Select } from 'antd';
import PerfilPresidenteModal from './Perfil';

const { Option } = Select;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaPresidenteClub = () => {
  const [presidentes, setPresidentes] = useState([]);
  const [filteredPresidentes, setFilteredPresidentes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [presidenteToDelete, setPersonaToDelete] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);  // Controla la apertura del modal de edición
  const [selectedPresidenteId, setSelectedPresidenteId] = useState(null);
  const [filterRole, setFilterRole] = useState('No filtrar');
  const [filterState, setFilterState] = useState('No filtrar');
  const [searchPresidente, setSearchPresidente] = useState('');
  const navigate = useNavigate();
  const [showPerfilModal , setShowPerfilModal] = useState(false)

  useEffect(() => {
    fetchPresidentes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterRole, filterState, searchPresidente, presidentes]);

  const fetchPresidentes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/presidente_club/get_presidente_club`);
      
      setPresidentes(res.data);

    } catch (error) {
      console.error('Error al obtener las personas:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...presidentes];

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
    if (searchPresidente) {
      filtered = filtered.filter((p) =>
        `${p.nombre} ${p.apellido}`
          .toLowerCase()
          .includes(searchPresidente.toLowerCase())
      );
    }

    setFilteredPresidentes(filtered);
  };

  const handleEditClick = (personaId) => {
    setSelectedPresidenteId(personaId);  // Guarda el id de persona seleccionado
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPresidenteId(null);  // Resetea el id seleccionado
  };

  const handleRegistrarClick = () => {
    setShowFormModal(true);
    console.log('Modal abierto:', showFormModal);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
  };

  const handleDeleteClick = (id) => {
    setPersonaToDelete(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const user_id = 1; // Cambiar esto si necesitas un valor dinámico
      await axios.put(`${API_BASE_URL}/presidente_club/delete_presidente/${presidenteToDelete}`, { user_id });
      toast.success('Usuario desactivado exitosamente');
      fetchPresidentes();
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
      fetchPresidentes(); // Actualiza la lista de usuarios
    } catch (error) {
      toast.error('Error al activar el usuario');
      console.error('Error al activar usuario:', error);
    }
  };  

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setPersonaToDelete(null);
  };

  const handleProfileClick = (jugadorId) => {
    setSelectedPresidenteId(jugadorId);  
    setShowPerfilModal(true);
  };

  const handleClosePerfilModal = () => {
    setShowPerfilModal(false);
    setSelectedPresidenteId(null);  
  };


  return (
    <div className="table-container">
      <h2 className="table-title">Lista de Presidentes de Clubes</h2>
      <div className="table-filters">
      <button className="table-add-button" onClick={handleRegistrarClick} >+1 Presidente</button>
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
            value={searchPresidente}
            onChange={(e) => setSearchPresidente(e.target.value)}
            className="search-box"
          />
      </div>
      
      <RegistroPresidente
        isOpen={showFormModal}
        onClose={handleCloseModal}
        onPresidenteCreated={fetchPresidentes} 
      />
      <EditarPresidente
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        presidenteId={selectedPresidenteId}  // Pasamos el id como prop
        onPresidenteUpdated={fetchPresidentes} 
      />

      <PerfilPresidenteModal
              isOpen={showPerfilModal}
              onClose={handleClosePerfilModal}
              presidenteId={selectedPresidenteId}  
      />
      <table className="table-layout">
        <thead className="table-head">
          <tr>
            <th className="table-th-p">Foto</th>
            <th className="table-th-p">Nombre del Jugador</th>
            <th className="table-th-p">Fecha de Nacimiento</th>
            <th className="table-th-p">C.I</th>
            <th className="table-th-p">Correo</th>
            <th className="table-th-p">Club</th>
            <th className="table-th-p">Acción</th>
          </tr>
        </thead>
        <tbody>
          {filteredPresidentes.map((p) => (
            <tr key={p.id} className="table-row">
              <td className="table-td-p">
                <img
                  src={p.persona_imagen ? p.persona_imagen : defaultUserIcon}
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
                {p.nombre_club ? (
                  <>
                    {p.nombre_club} 
                  </>
                ) : (
                  <>
                   Sin club asignado  <SportsVolleyballIcon/>
                  </>
                 
                )}
              </td>

              <td className="table-td-p">

                {/* Botones de acción siempre visibles */}
                <button
                  className={`table-button button-view ${p.eliminado === 'S' ? 'disabled-button' : ''}`}
                  onClick={() => handleProfileClick(p.id)}
                  disabled={p.eliminado === 'S'} // Desactiva el botón si el usuario está eliminado
                >
                  <RemoveRedEyeIcon />
                </button>

                <button
                  className={`table-button button-edit ${p.eliminado === 'S' ? 'disabled-button' : ''}`}
                  onClick={() => handleEditClick(p.id)}
                  disabled={p.eliminado === 'S'} // Desactiva el botón si el usuario está eliminado
                >
                  <EditIcon />
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

export default ListaPresidenteClub;
