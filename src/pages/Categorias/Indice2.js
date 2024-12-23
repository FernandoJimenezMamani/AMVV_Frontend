import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/IndiceTabla.css'; 
import { toast } from 'react-toastify';

const ListaCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/categoria/get_categoria');
        setCategorias(response.data);
      } catch (error) {
        toast.error('error')
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  const handleEditClick = (categoriaId) => {
    navigate(`/categorias/editar/${categoriaId}`);
  };

  const handleRegistrarClick = () => {
    navigate(`/categorias/registrar`);
  };

  const handleDeleteClick = (categoriaId) => {
    setCategoriaToDelete(categoriaId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const user_id = 1; // Reemplaza esto según el manejo de autenticación
      await axios.put(`http://localhost:5002/api/categoria/delete_categoria/${categoriaToDelete}`, { user_id });
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
  <table className="table-layout">
    <thead className="table-head">
      <tr>
        <th>Nombre</th>
        <th className="table-th">Acción</th>
      </tr>
    </thead>
    <tbody>
      {categorias.map((categoria) => (
        <tr key={categoria.id} className="table-row">
          <td className="table-td table-td-name">{categoria.nombre}</td>
          <td className="table-td">
            <button
              className="table-button button-edit"
              onClick={() => handleEditClick(categoria.id)}
            >
              Editar
            </button>
            <button
              className="table-button button-delete"
              onClick={() => handleDeleteClick(categoria.id)}
            >
              Eliminar
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {showConfirm && (
    <div className="modal-container">
      <p>¿Seguro que quieres eliminar esta categoría?</p>
      <button className="modal-button" onClick={handleConfirmDelete}>
        Sí
      </button>
      <button className="modal-cancel-button" onClick={handleCancelDelete}>
        No
      </button>
    </div>
  )}
</div>

  );
};

export default ListaCategorias;
