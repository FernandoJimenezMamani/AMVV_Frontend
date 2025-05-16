import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../assets/css/IndiceTabla.css';
import DetallePagoInscripcion from './DetallePagoInscripcion';
import Club_defecto from '../../assets/img/Club_defecto.png';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useParams } from 'react-router-dom';
import { Select } from 'antd';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const HistorialPagosInscripcionClub = () => {
  const { presidenteId } = useParams();
  const [clubId, setClubId] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [searchEquipo, setSearchEquipo] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedEquipoId, setSelectedEquipoId] = useState(null);
  const [campeonatos, setCampeonatos] = useState([]);
  const [selectedCampeonato, setSelectedCampeonato] = useState(null);

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
        console.error(error);
        }
    };

    fetchCampeonatos();
    }, []);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/presidente_club/get_presidenteById/${presidenteId}`);
        console.log('Club ID:', response.data.club_presidente);
        setClubId(response.data.club_presidente);
        
      } catch (error) {
        toast.error('Error al obtener el club del presidente');
        console.error(error);
      }
    };
    if (presidenteId) fetchClub();
  }, [presidenteId]);

  useEffect(() => {
    const fetchPagos = async () => {
      if (!clubId || !selectedCampeonato) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/pagos/inscripcion/por-club/${clubId}/${selectedCampeonato}`);
        setPagos(response.data);
      } catch (error) {
        toast.error('Error al obtener los pagos de inscripción');
        console.error(error);
      }
    };
    fetchPagos();
  }, [clubId,selectedCampeonato]);

  const filteredPagos = pagos.filter(p =>
    p.equipo.toLowerCase().includes(searchEquipo.toLowerCase())
  );

  const formatFecha = (fecha) =>
    new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const handleVerDetalle = (equipoId) => {
    setSelectedEquipoId(equipoId);
    setShowFormModal(true);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
    setSelectedEquipoId(null);
  };

  const getImagenClub = (pago) => {
    return pago.imagen_club ? pago.imagen_club : Club_defecto;
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Historial de Pagos de Inscripción</h2>
      <DetallePagoInscripcion
        isOpen={showFormModal}
        onClose={handleCloseModal}
        equipoId={selectedEquipoId}
        campeonatoId={selectedCampeonato}
      />
        <div className="table-filters">
            <input
                type="text"
                placeholder="Buscar por equipo"
                value={searchEquipo}
                onChange={(e) => setSearchEquipo(e.target.value)}
                className="search-box"
            />
             <Select
            className="filter-select"
            value={selectedCampeonato || ''}
            onChange={setSelectedCampeonato}
            style={{ width: 250, marginBottom: '0px' }}
        >
            {campeonatos.map((camp) => (
            <Select.Option key={camp.id} value={camp.id}>
                {camp.nombre}
            </Select.Option>
            ))}
        </Select>
        </div>
      <table className="table-layout">
        <thead className="table-head">
          <tr>
            <th className="table-th">Logo</th>
            <th className="table-th">Equipo</th>
            <th className="table-th">Categoría</th>
            <th className="table-th">Monto</th>
            <th className="table-th">Fecha</th>
            <th className="table-th">Detalle</th>
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
                <td className="table-td">{pago.categoria}</td>
                <td className="table-td">{pago.monto} Bs</td>
                <td className="table-td">{formatFecha(pago.fecha)}</td>
                <td className="table-td">
                  <button className="table-button button-view" onClick={() => handleVerDetalle(pago.equipoId)}>
                    <RemoveRedEyeIcon />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6">No hay pagos registrados</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialPagosInscripcionClub;
