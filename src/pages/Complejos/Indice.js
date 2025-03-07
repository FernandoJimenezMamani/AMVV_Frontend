import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/ConfirmModal';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import RegistroComplejo from './Registro';
import EditarComplejo from './Editar';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MapaDetalle from '../../components/MapaDetalle';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaLugar = () => {
  const [complejos, setComplejos] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [complejoToDelete, setComplejoToDelete] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedComplejoId, setSelectedComplejoId] = useState(null);
  const navigate = useNavigate();
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [latitud , setLatitud] = useState(null)
  const [longitud , setLongitud] = useState(null)

  useEffect(() => {
    fetchComplejos();
  }, []);

  const fetchComplejos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lugar/select`);
      console.log(complejos);
      setComplejos(response.data);
    } catch (error) {
      toast.error('Error al obtener los complejos');
      console.error('Error al obtener los complejos:', error);
    }
  };

  const handleEditClick = (complejoId) => {
    setSelectedComplejoId(complejoId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedComplejoId(null);
  };

  const handleRegistrarClick = () => {
    setShowFormModal(true);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
  };

  const handleDeleteClick = (complejoId) => {
    setComplejoToDelete(complejoId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const user_id = 1;
      await axios.put(`${API_BASE_URL}/complejo/delete_complejo/${complejoToDelete}`, { user_id });
      setComplejos(complejos.filter(complejo => complejo.id !== complejoToDelete));
      setShowConfirm(false);
      setComplejoToDelete(null);
    } catch (error) {
      toast.error('Error al eliminar el complejo');
      console.error('Error al eliminar el complejo:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setComplejoToDelete(null);
  };

  const handleProfileClick = (complejo) => {
    setLatitud(complejo.latitud)
    setLongitud(complejo.longitud)
    setIsMapModalOpen(true)
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Lista de Complejos Deportivos</h2>
      <button className="table-add-button" onClick={handleRegistrarClick}>+1 Complejo</button>
      <RegistroComplejo
        isOpen={showFormModal}
        onClose={handleCloseModal}
        onComplejoCreated={fetchComplejos} 
      />
       <EditarComplejo
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        complejoId={selectedComplejoId}  // Pasamos el id como prop
        onComplejoUpdated={fetchComplejos} 
      />
      <table className="table-layout">
        <thead className="table-head">
          <tr>
            <th className="table-th">Nombre</th>
            <th className="table-th">Dirección</th>
            <th className="table-th">Acción</th>
          </tr>
        </thead>
        <tbody>
          {complejos.map((complejo) => (
            <tr key={complejo.id} className="table-row">
              <td className="table-td table-td-name">{complejo.nombre}</td>
              <td className="table-td table-td-address">{complejo.direccion}</td>
              <td className="table-td">
                <button className="table-button button-view" onClick={() => handleProfileClick(complejo)}>
                  <RemoveRedEyeIcon />
                </button>
                
                <button className="table-button button-edit" onClick={() => handleEditClick(complejo.id)}>
                  <EditIcon />
                </button>
                
                <button className="table-button button-delete" onClick={() => handleDeleteClick(complejo.id)}>
                  <DeleteForeverIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <MapaDetalle 
      isOpen={isMapModalOpen}
      onClose={() => setIsMapModalOpen(false)}
      lat={latitud}
      lng={longitud}
    />

      <ConfirmModal
        visible={showConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="¿Seguro que quieres eliminar este complejo?"
      />
    </div>
  );
};

export default ListaLugar;
