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
import { Select } from 'antd';
import { useCampeonato } from '../../context/CampeonatoContext';
const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState(null);
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [filterState, setFilterState] = useState('No filtrar');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  const { campeonatoEnCurso, campeonatoEnTransaccion } = useCampeonato();
  const navigate = useNavigate();
  console.log('Campeonato en transacción:', campeonatoEnTransaccion);

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

  useEffect(() => {
      let filtered = [...categorias];
    
      if (filterState !== 'No filtrar') {
        filtered = filtered.filter((c) =>
          filterState === 'Activo' ? c.eliminado === 'N' : c.eliminado === 'S'
        );
      }
    
      setFilteredCategorias(filtered);
    }, [categorias, filterState]);

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
      fetchCategorias();
    } catch (error) {
      toast.error('error')
      console.error('Error al eliminar la categoría:', error);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setCategoriaToDelete(null);
  };

  const handleActivateCategoria = async (id) => {
    try {
      const user_id = 1; 
      await axios.put(`${API_BASE_URL}/categoria/activate_categoria/${id}`, { user_id });
      toast.success('Categoria activado exitosamente');
      fetchCategorias();
    } catch (error) {
      toast.error('Error al activar el Categoria');
      console.error('Error al activar Categoria:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategorias.slice(indexOfFirstItem, indexOfLastItem);
  
  return (
  <div className="table-container">
    <h2 className="table-title">Lista de Categorías</h2>
    <div className="table-filters">
      <button className="table-add-button" onClick={handleRegistrarClick} >+1 Categoria</button>
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
          <th className="table-th">Nombre</th>
          <th className="table-th">Genero</th>
          <th className="table-th">División</th>
          <th className="table-th">Edad Minima</th>
          <th className="table-th">Edad Maxima</th>
          <th className="table-th">Costo de traspaso</th>
          <th className="table-th">Acción</th>
        </tr>
      </thead>
      <tbody>
        {currentItems.map((categoria) => (
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
              {(campeonatoEnTransaccion &&
                <label className="user-activation-switch">
                  <input
                    type="checkbox"
                    onChange={() =>
                      categoria.eliminado === 'S'
                        ? handleActivateCategoria(categoria.id)
                        : handleDeleteClick(categoria.id)
                    }
                    checked={categoria.eliminado !== 'S'}
                  />
                  <span className="user-activation-slider"></span>
                </label>
              )}       
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
          Página {currentPage} de {Math.ceil(filteredCategorias.length / itemsPerPage)}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredCategorias.length / itemsPerPage)}
          className="pagination-button"
        >
          Siguiente
        </button>
      </div>
    <ConfirmModal
        visible={showConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="¿Seguro que quieres eliminar esta categoria?"
      />
  </div>

  );
};

export default ListaCategorias;
