import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import RegistroDelegado from './Registrar';
import EditarDelegado from './Editar';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';
import { PresidenteClub } from '../../constants/roles';
import { Select } from 'antd';
import PerfilDelegadoModal from './Perfil';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
const { Option } = Select;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaDelegadoClub = () => {
  const [presidentes, setPresidentes] = useState([]);
  const [filteredPresidentes, setFilteredPresidentes] = useState([]);
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  
  useEffect(() => {
    fetchPresidentes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterRole, filterState, searchPresidente, presidentes]);

  const fetchPresidentes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/presidente_club/get_delegado_club`);
      
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
      await axios.put(`${API_BASE_URL}/persona/delete_persona/${presidenteToDelete}`, { user_id });
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

  const getImagenPerfil = (jugador) => {
      if (jugador.persona_imagen) {
        return jugador.persona_imagen; 
      }
      return jugador.genero === 'V' ? defaultUserMenIcon : defaultUserWomenIcon; 
    };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPresidentes.slice(indexOfFirstItem, indexOfLastItem);
  
  return (
    <div className="table-container">
      <h2 className="table-title">Lista de Delegados de Clubes</h2>
      <div className="table-filters">
      <button className="table-add-button" onClick={handleRegistrarClick} >+1 Delegado</button>
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
      
      <RegistroDelegado
        isOpen={showFormModal}
        onClose={handleCloseModal}
        onDelegadoCreated={fetchPresidentes} 
      />
      <EditarDelegado
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        delegadoId={selectedPresidenteId}  // Pasamos el id como prop
        onDelegadoUpdated={fetchPresidentes} 
      />

    <PerfilDelegadoModal
              isOpen={showPerfilModal}
              onClose={handleClosePerfilModal}
              delegadoId={selectedPresidenteId}  
      />
      <table className="table-layout">
        <thead className="table-head">
          <tr>
            <th className="table-th-p">Foto</th>
            <th className="table-th-p">Nombre del Delegado</th>
            <th className="table-th-p">Fecha de Nacimiento</th>
            <th className="table-th-p">C.I</th>
            <th className="table-th-p">Correo</th>
            <th className="table-th-p">Club</th>
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
                    onClick={() => handleProfileClick(p.id)}
                    className="card-btn-view"
                    disabled={p.eliminado === 'S'}
                  >
                    <RemoveRedEyeIcon />
                  </button>
                  <button
                    onClick={() => handleEditClick(p.id)}
                    className="card-btn-edit"
                    disabled={p.eliminado === 'S'}
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
          Página {currentPage} de {Math.ceil(filteredPresidentes.length / itemsPerPage)}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredPresidentes.length / itemsPerPage)}
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

export default ListaDelegadoClub;
