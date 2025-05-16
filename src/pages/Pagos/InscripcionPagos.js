import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import RegistroPagoInscripcion from './RegistroPagoInscripcion';
import Club_defecto from '../../assets/img/Club_defecto.png';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaEquiposPagos = () => {
  const [equipos, setEquipos] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedEquipoId, setSelectedEquipoId] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchEquipo, setSearchEquipo] = useState('');
  useEffect(() => {
    fetchClubes();
  }, []);

  const fetchClubes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pagos/getEquiposDebt`);
      setEquipos(response.data);
    } catch (error) {
      toast.error('error')
      console.error('Error al obtener los clubes:', error);
    }
  };

  const handleRegistrarClick = (EquipoId) => {
    setSelectedEquipoId(EquipoId);
    setShowFormModal(true);
    console.log('Modal abierto:', showFormModal);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
  };
  
  const setValueGenero = (genero) => {
    if(genero === 'V'){
      return 'Varones'
    }else{
      return 'Damas'
    }
  }

  const handleHistorialClick = () => {
    navigate('/pagos/HistorialInscripcion');
  }

  const getImagenClub = (club) => {
    if (club.club_imagen) {
      return club.club_imagen; 
    }
    return Club_defecto;
  };
  const filteredEquipos = equipos.filter(e =>
    e.equipo_nombre.toLowerCase().includes(searchEquipo.toLowerCase())
  );

    const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEquipos.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="table-container">
      <h2 className="table-title">Deuda por inscripción</h2>
      <div className="table-filters">
      <button className="table-add-button" onClick={handleHistorialClick} >Historial</button>
          <input
            type="text"
            placeholder="Buscar por equipo"
            value={searchEquipo}
            onChange={(e) => setSearchEquipo(e.target.value)}
            className="search-box"
          />
      </div>
      <RegistroPagoInscripcion
        isOpen={showFormModal}
        onClose={handleCloseModal}
        onEquipoRegistered={fetchClubes} 
        equipoId={selectedEquipoId}
      />
      <table className="table-layout">
        <thead className="table-head">
          <tr>
            <th className="table-th">Club Logo</th>
            <th className="table-th">Equipo</th>
            <th className="table-th">Nombre Club</th>
            <th className="table-th">Categoria</th>
            <th className="table-th">Genero</th>
            <th className="table-th">Deuda</th>
            <th className="table-th">Acción</th>
          </tr>
        </thead>
        <tbody  >
          {currentItems.map((equipo) => (
            <tr key={equipo.id} className="table-row">

              <td className="table-td">
                <img src={getImagenClub(equipo)} alt={`${equipo.nombre_club} logo`} className="table-logo" />
              </td>
              <td className="table-td table-td-name">{equipo.equipo_nombre}</td>
              <td className="table-td table-td-name">{equipo.nombre_club}</td>
              <td className="table-td table-td-name">{equipo.Categoria}</td>
              <td className="table-td table-td-name">{setValueGenero(equipo.genero)}</td>
              <td className="table-td table-td-description">{equipo.costo_inscripcion} Bs</td>
              <td className="table-td">
                <button className="table-button button-view"  onClick={() => handleRegistrarClick(equipo.equipo_id)}><RemoveRedEyeIcon/></button>
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
          Página {currentPage} de {Math.ceil(filteredEquipos.length / itemsPerPage)}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredEquipos.length / itemsPerPage)}
          className="pagination-button"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ListaEquiposPagos;
