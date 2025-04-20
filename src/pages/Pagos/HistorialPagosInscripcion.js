import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select } from 'antd';
import { toast } from 'react-toastify';
import '../../assets/css/IndiceTabla.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DetallePagoInscripcion from './DetallePagoInscripcion';
import Club_defecto from '../../assets/img/Club_defecto.png';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const HistorialPagosInscripcion = () => {
  const [pagos, setPagos] = useState([]);
  const [campeonatos, setCampeonatos] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState(null);
  const [searchClub, setSearchClub] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedEquipoId, setSelectedEquipoId] = useState(null);

  useEffect(() => {
    const fetchCampeonatos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/campeonatos/select`);
        setCampeonatos(response.data);
        if (response.data.length > 0) {
          setSelectedCampeonato(response.data[0].id);
        }
      } catch (error) {
        toast.error('Error al obtener campeonatos');
        console.error('Error al obtener campeonatos:', error);
      }
    };

    fetchCampeonatos();
  }, []);

  useEffect(() => {
      fetchPagosInscripcion();
  }, [selectedCampeonato]);

  const fetchPagosInscripcion = async () => {
    if(!selectedCampeonato) return; 
    try {
      const response = await axios.get(`${API_BASE_URL}/pagos/historial-inscripcion/${selectedCampeonato}`);
      console.log("Respuesta del servidor:", response.data); 
      if (Array.isArray(response.data)) {
        setPagos(response.data);
      } else {
        console.error("Respuesta inesperada del servidor:", response.data);
        setPagos([]); 
      }
    } catch (error) {
      toast.error("Error al obtener el historial de pagos");
      console.error("Error al obtener historial de pagos:", error);
    }
  };

  const filteredPagos = pagos.filter(pago =>
    pago.nombre_club?.toLowerCase().includes(searchClub.toLowerCase())
  );
  

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleRegistrarClick = (EquipoId) => {
    setSelectedEquipoId(EquipoId);
    setShowFormModal(true);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
  };

  const getImagenClub = (club) => {
    if (club.imagen_club) {
      return club.imagen_club; 
    }
    return Club_defecto;
  };


  return (
    <div className="table-container">
      <h2 className="table-title">Historial de Pagos de Inscripción</h2>
      <DetallePagoInscripcion
        isOpen={showFormModal}
        onClose={handleCloseModal}
        onEquipoRegistered={fetchPagosInscripcion} 
        equipoId={selectedEquipoId}
        campeonatoId={selectedCampeonato}
      />
      <div className="table-filters">
      <Select
            value={selectedCampeonato ?? undefined} // evita pasar null como value
            onChange={setSelectedCampeonato}
            style={{ width: 250, marginBottom: '0px' }}
            >

          {campeonatos.map((campeonato) => (
            <Select.Option key={campeonato.id} value={campeonato.id}>
              {campeonato.nombre}
            </Select.Option>
          ))}
        </Select>

        <input
          type="text"
          placeholder="Buscar por club"
          value={searchClub}
          onChange={(e) => setSearchClub(e.target.value)}
          className="search-box"
        />
      </div>

      <table className="table-layout">
        <thead className="table-head">
          <tr>
            <th className="table-th">Club Logo</th>
            <th className="table-th">Equipo</th>
            <th className="table-th">Nombre Club</th>
            <th className="table-th">Categoría</th>
            <th className="table-th">Monto</th>
            <th className="table-th">Fecha</th>
            <th className="table-th">Ver Detalle</th>
          </tr>
        </thead>
        <tbody>
          {filteredPagos.length > 0 ? (
            filteredPagos.map((pago, index) => (
              <tr key={index} className="table-row">
                <td className="table-td">
                  <img src={getImagenClub(pago)} alt="logo" className="table-logo" />
                </td>
                <td className="table-td">{pago.equipo}</td>
                <td className="table-td">{pago.nombre_club}</td>
                <td className="table-td">{pago.categoria}</td>
                <td className="table-td">{pago.monto} Bs</td>
                <td className="table-td">{formatFecha(pago.fecha)}</td>
                <td className="table-td">
                <button className="table-button button-view"  onClick={() => handleRegistrarClick(pago.equipoId)}><RemoveRedEyeIcon/></button>
              </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="9">No hay pagos registrados.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialPagosInscripcion;
