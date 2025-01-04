import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/IndiceTabla.css'; 
import { toast } from 'react-toastify';
import RegistroCategoria from './Registrar';
import EditarCategoria from './Editar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmModal from '../../components/ConfirmModal';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categoria/get_categoria`);
      setCategorias(response.data);
    } catch (error) {
      toast.error('error')
      console.error('Error al obtener las categorías:', error);
    }
  };

  const handleEditClick = (categoriaId) => {
    setSelectedCategoriaId(categoriaId);  // Guarda el id del club seleccionado
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedCategoriaId(null);  // Resetea el id seleccionado
  };

  const handleRegistrarClick = () => {
    setShowFormModal(true);
    console.log('Modal abierto:', showFormModal);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
  };

  const handleDeleteClick = (categoriaId) => {
    setCategoriaToDelete(categoriaId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const user_id = 1; // Reemplaza esto según el manejo de autenticación
      await axios.put(`${API_BASE_URL}/categoria/delete_categoria/${categoriaToDelete}`, { user_id });
      setCategorias(categorias.filter(categoria => categoria.id !== categoriaToDelete));
      setShowConfirm(false);
      setCategoriaToDelete(null);
    } catch (error) {
      toast.error('error')
      console.error('Error al eliminar la categoría:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setCategoriaToDelete(null);
  };

  return (
  <div className="table-container">
    <h2 className="table-title">Lista de Categorías</h2>
    <button className="table-add-button" onClick={handleRegistrarClick} >+1 Categoria</button>
    <RegistroCategoria
        isOpen={showFormModal}
        onClose={handleCloseModal}
        onCategoriaCreated={fetchCategorias} 
      />
      <EditarCategoria
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        categoriaId={selectedCategoriaId}  // Pasamos el id como prop
        onCategoriaUpdated={fetchCategorias} 
      />
    <table className="table-layout">
      <thead className="table-head">
        <tr>
          <th>Nombre</th>
          <th>Genero</th>
          <th>División</th>
          <th>Edad Minima</th>
          <th>Edad Maxima</th>
          <th>Costo de traspaso</th>
          <th className="table-th">Acción</th>
        </tr>
      </thead>
      <tbody>
        {categorias.map((categoria) => (
          <tr key={categoria.id} className="table-row">
            <td className="table-td table-td-name">{categoria.nombre}</td>
            
            {/* Genero: Varones, Damas o Mixto */}
            <td className="table-td table-td-name">
              {categoria.genero === 'V' ? 'Varones' :
              categoria.genero === 'D' ? 'Damas' :
              categoria.genero === 'M' ? 'Mixto' : 'No especificado'}
            </td>

            {/* División: Mayores o Menores */}
            <td className="table-td table-td-name">
              {categoria.division === 'MY' ? 'Mayores' :
              categoria.division === 'MN' ? 'Menores' : 'No especificado'}
            </td>

            <td className="table-td table-td-name">
              {categoria.edad_minima !== null && categoria.edad_minima !== undefined  && categoria.edad_minima !== 0
                ? categoria.edad_minima 
                : 'No especificado'}
            </td>

            <td className="table-td table-td-name">
              {categoria.edad_maxima !== null && categoria.edad_maxima !== undefined && categoria.edad_minima !== 0
                ? categoria.edad_maxima 
                : 'No especificado'}
            </td>

            <td className="table-td table-td-name">
              {categoria.costo_traspaso !== null && categoria.costo_traspaso !== undefined 
                ? categoria.costo_traspaso 
                : 'No especificado'}
            </td>

            <td className="table-td">
              <button
                className="table-button button-edit"
                onClick={() => handleEditClick(categoria.id)}
              >
               <EditIcon/>
              </button>
              <button
                className="table-button button-delete"
                onClick={() => handleDeleteClick(categoria.id)}
              >
                <DeleteForeverIcon/>
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
        message="¿Seguro que quieres eliminar este club?"
      />
  </div>

  );
};

export default ListaCategorias;
