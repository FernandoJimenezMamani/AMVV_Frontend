import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import RegistroClub from './Registrar';
import EditarClub from './Editar';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useSession } from '../../context/SessionContext';
import rolMapping from '../../constants/roles';
import { Select } from 'antd';

const { Option } = Select;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaClubes = () => {
  const [clubes, setClubes] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [clubToDelete, setClubToDelete] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);  // Controla la apertura del modal de edición
  const [selectedClubId, setSelectedClubId] = useState(null);
  const { user } = useSession();
  const navigate = useNavigate();
  const [filterState, setFilterState] = useState('No filtrar');
  const [filteredClubes, setFilteredClubes] = useState([]);
  useEffect(() => {
    fetchClubes();
  }, []);

  const fetchClubes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/club/get_club`);
      setClubes(response.data);
    } catch (error) {
      toast.error('error')
      console.error('Error al obtener los clubes:', error);
    }
  };

  useEffect(() => {
      let filtered = [...clubes];
    
      if (filterState !== 'No filtrar') {
        filtered = filtered.filter((c) =>
          filterState === 'Activo' ? c.eliminado === 'N' : c.eliminado === 'S'
        );
      }
    
      setFilteredClubes(filtered);
    }, [clubes, filterState]);

  const handleEditClick = (clubId) => {
    setSelectedClubId(clubId);  // Guarda el id del club seleccionado
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedClubId(null);  // Resetea el id seleccionado
  };

  const handleRegistrarClick = () => {
    setShowFormModal(true);
    console.log('Modal abierto:', showFormModal);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
  };

  const handleDeleteClick = (clubId) => {
    setClubToDelete(clubId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const user_id = 1; 
      await axios.put(`${API_BASE_URL}/club/delete_club/${clubToDelete}`, { user_id });
      setClubes(clubes.filter(club => club.id !== clubToDelete));
      setShowConfirm(false);
      setClubToDelete(null);
    } catch (error) {
      toast.error('error')
      console.error('Error al eliminar el club:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setClubToDelete(null);
  };

  const handleProfileClick = (clubId) => {
    navigate(`/clubes/perfil/${clubId}`);
  };

  const hasRole = (...roles) => {
    return user && user.rol && roles.includes(user.rol.nombre);
  };
  
  const handleActivateClub = async (id) => {
    try {
      const user_id = 1; 
      await axios.put(`${API_BASE_URL}/club/activate_club/${id}`, { user_id });
      toast.success('Categoria activado exitosamente');
      fetchClubes();
    } catch (error) {
      toast.error('Error al activar el Categoria');
      console.error('Error al activar Categoria:', error);
    }
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Lista de Clubes</h2>
      <div className="table-filters">
        {hasRole(rolMapping.PresidenteAsociacion) && (
          <button className="table-add-button" onClick={handleRegistrarClick} >+1 club</button>
        )}
        <Select
                  className="filter-select"
                  placeholder="Filtrar por estado"
                  value={filterState}
                  onChange={(value) => setFilterState(value)}
                  style={{ width: 180 }}
                >
                  <Option value="No filtrar">No filtrar</Option>
                  <Option value="Activo">Activo</Option>
                  <Option value="Inactivo">Inactivo</Option>
                </Select>
      </div>
      <RegistroClub
        isOpen={showFormModal}
        onClose={handleCloseModal}
        onClubCreated={fetchClubes} 
      />
      <EditarClub
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        clubId={selectedClubId}  // Pasamos el id como prop
        onClubUpdated={fetchClubes} 
      />
      <table className="table-layout">
        <thead className="table-head">
          <tr>
            <th className="table-th">Logo</th>
            <th className="table-th">Nombre</th>
            <th className="table-th">Descripcion</th>
            <th className="table-th">Acción</th>
          </tr>
        </thead>
        <tbody  >
          {filteredClubes.map((club) => (
            <tr key={club.id} className="table-row">

              <td className="table-td">
                <img src={club.club_imagen} alt={`${club.nombre} logo`} className="table-logo" />
              </td>
              <td className="table-td table-td-name">{club.nombre}</td>
              <td className="table-td table-td-description">{club.descripcion}</td>
              <td className="table-td">
                <button className="table-button button-view" onClick={() => handleProfileClick(club.id)}><RemoveRedEyeIcon/></button>
                {hasRole(rolMapping.PresidenteAsociacion) && (
                  <>
                <button className="table-button button-edit" onClick={() => handleEditClick(club.id)}><EditIcon/></button>
                <label className="user-activation-switch">
                  <input
                    type="checkbox"
                    onChange={() =>
                      club.eliminado === 'S'
                        ? handleActivateClub(club.id)
                        : handleDeleteClick(club.id)
                    }
                    checked={club.eliminado !== 'S'}
                  />
                  <span className="user-activation-slider"></span>
                </label>
                </>
                )}
                </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        visible={showConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="¿Seguro que quieres eliminar este club?"
      />
    </div>

  );
};

export default ListaClubes;
