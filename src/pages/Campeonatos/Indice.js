import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/css/Campeonato/Indice.css';
import { useSession } from '../../context/SessionContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import RegistroCampeonato from './Registrar';
import EditarCampeonato from './Editar';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Campeonatos = () => {
  const [campeonatos, setCampeonatos] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); 
  const [selectedCampId, setSelectedCampId] = useState(null);
  const { user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampeonatos();
  }, []);

  const fetchCampeonatos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Campeonatos/select`);
      setCampeonatos(response.data);
    } catch (error) {
      toast.error('error')
      console.error('Error al obtener los campeonatos:', error);
    }
  };

  const handleRegistrarClick = () => {
    setShowFormModal(true);
    console.log('Modal abierto:', showFormModal);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
  };

  const handleEditClick = (campId ) => {
    console.log('ID seleccionado:', campId);  
    setSelectedCampId(campId );  // Guarda el id del club seleccionado
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedCampId(null);  // Resetea el id seleccionado
  };

  const handleViewDetails = (id) => {
    navigate(`/categorias/indice/${id}`);
  };

  return (
    <div className="campeonatos-container">
    <h2 className="campeonatos-lista-titulo">Lista de Campeonatos</h2>
  
    {/* Nuevo contenedor para el botón */}
    <div className="button-container">
      <button className="table-add-button" onClick={handleRegistrarClick}>
        +1 Campeonato
      </button>
    </div>
  
    {/* Modal de Registro */}
    <RegistroCampeonato
      isOpen={showFormModal}
      onClose={handleCloseModal}
      onCampCreated={fetchCampeonatos}
    />
    <EditarCampeonato
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        campId={selectedCampId}  // Pasamos el id como prop
      />
    {/* Contenedor de tarjetas */}
    <div className="cards-wrapper">
      {campeonatos.map((campeonato) => (
        <div key={campeonato.id} className="campeonato-card">
          <h2 className="campeonato-nombre">{campeonato.nombre}</h2>
          <p className="campeonato-fecha">
            Inicio: {new Date(campeonato.fecha_inicio).toLocaleDateString()}
          </p>
          <div className="campeonato-buttons">
            <button className="buttonex button-view" onClick={() => handleViewDetails(campeonato.id)}>
              <i className="fas fa-eye"></i>
            </button>
            <button className="buttonex button-edit" onClick={() => handleEditClick(campeonato.id)}>
              <i className="fas fa-edit"></i>
            </button>
            <button className="buttonex button-delete">
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default Campeonatos;