import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import RegistroArbitro from './Registrar';
import EditarArbitro from './Editar';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';
import { PresidenteClub } from '../../constants/roles';
import { Select } from 'antd';
import PerfilArbitroModal from './Perfil';

const { Option } = Select;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaArbitro = () => {
  const [arbitros, setArbitros] = useState([]);
  const [filteredPresidentes, setFilteredPresidentes] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [presidenteToDelete, setPersonaToDelete] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);  
  const [selectedPresidenteId, setSelectedPresidenteId] = useState(null);
  const [filterRole, setFilterRole] = useState('No filtrar');
  const [filterState, setFilterState] = useState('No filtrar');
  const [searchPresidente, setSearchPresidente] = useState('');
  const [showPerfilModal, setShowPerfilModal] = useState(false);  
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchArbitros();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterRole, filterState, searchPresidente, arbitros]);

  const fetchArbitros = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/arbitro/get_arbitros`);
      
      setArbitros(res.data);

    } catch (error) {
      console.error('Error al obtener las personas:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...arbitros];

    if (filterRole !== 'No filtrar') {
      filtered = filtered.filter((p) =>
        p.roles.split(', ').includes(filterRole)
      );
    }

    if (filterState !== 'No filtrar') {
      filtered = filtered.filter((p) =>
        filterState === 'Activo' ? p.eliminado === 'N' : p.eliminado === 'S'
      );
    }

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
    setSelectedPresidenteId(personaId);  
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPresidenteId(null);  
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
      const user_id = 1; 
      await axios.put(`${API_BASE_URL}/persona/delete_persona/${presidenteToDelete}`, { user_id });
      toast.success('Usuario desactivado exitosamente');
      fetchArbitros();
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
      fetchArbitros(); 
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
    setSelectedPersonaId(jugadorId);  
    setShowPerfilModal(true);
  };

  const handleClosePerfilModal = () => {
    setShowPerfilModal(false);
    setSelectedPersonaId(null);  
  };

  const getImagenPerfil = (arbitro) => {
    if (arbitro.persona_imagen) {
      return arbitro.persona_imagen; 
    }
    return arbitro.genero_persona === 'V' ? defaultUserMenIcon : defaultUserWomenIcon; 
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPresidentes.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="table-container">
      <h2 className="table-title">Lista de Arbitros</h2>
      <div className="table-filters">
      <button className="table-add-button" onClick={handleRegistrarClick} >+1 Arbitro</button>
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
      
      <RegistroArbitro
        isOpen={showFormModal}
        onClose={handleCloseModal}
        onPersonaCreated={fetchArbitros} 
      />
      <EditarArbitro
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        personaId={selectedPresidenteId}  // Pasamos el id como prop
        onPersonaUpdated={fetchArbitros} 
      />

      <PerfilArbitroModal
        isOpen={showPerfilModal}
        onClose={handleClosePerfilModal}
        arbitroId={selectedPersonaId}  
      />
      <table className="table-layout">
        <thead className="table-head">
          <tr>
            <th className="table-th-p">Foto</th>
            <th className="table-th-p">Nombre del Arbitro</th>
            <th className="table-th-p">Fecha de Nacimiento</th>
            <th className="table-th-p">C.I</th>
            <th className="table-th-p">Correo</th>
            <th className="table-th-p">Acción</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((p) => (
            <tr key={p.id} className="table-row">
              <td className="table-td-p">
                <img
                  src={getImagenPerfil(p) }
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

export default ListaArbitro;
