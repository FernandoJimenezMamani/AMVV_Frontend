import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../assets/css/IndiceTabla.css';
import DetallePagoTraspaso from './DetallePagoTraspaso';
import Club_defecto from '../../assets/img/Club_defecto.png';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useParams } from 'react-router-dom';
import { Select } from 'antd';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const HistorialPagosTraspasoClub = () => {
  const { presidenteId } = useParams();
  const [clubId, setClubId] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [searchJugador, setSearchJugador] = useState('');
  const [showDetalle, setShowDetalle] = useState(false);
  const [traspasoIdSeleccionado, setTraspasoIdSeleccionado] = useState(null);
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
        setClubId(response.data.club_presidente);
      } catch (error) {
        toast.error('Error al obtener club');
        console.error(error);
      }
    };

    if (presidenteId) fetchClub();
  }, [presidenteId]);

  useEffect(() => {
  const fetchPagos = async () => {
    if (!clubId || !selectedCampeonato) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/pagos/traspasos/por-club/${clubId}/${selectedCampeonato}`);
      setPagos(response.data);
    } catch (error) {
      toast.error('Error al obtener pagos de traspasos');
      console.error(error);
    }
  };

  fetchPagos();
}, [clubId, selectedCampeonato]);


  const filteredPagos = pagos.filter((p) =>
    `${p.jugador_nombre} ${p.jugador_apellido}`.toLowerCase().includes(searchJugador.toLowerCase())
  );

  const handleVerDetalle = (traspasoId) => {
    setTraspasoIdSeleccionado(traspasoId);
    setShowDetalle(true);
  };

  const handleCloseDetalle = () => {
    setTraspasoIdSeleccionado(null);
    setShowDetalle(false);
  };

   const formatFechaLarga = (fechaString) => {
    if (!fechaString) return '';
    const [year, month, day] = fechaString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)); // mes empieza en 0
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Historial de Pagos de Traspasos</h2>

      <DetallePagoTraspaso
        isOpen={showDetalle}
        onClose={handleCloseDetalle}
        traspasoId={traspasoIdSeleccionado}
        campeonatoId={selectedCampeonato}
      />
     <div className="table-filters">
        <input
            type="text"
            placeholder="Buscar por jugador"
            value={searchJugador}
            onChange={(e) => setSearchJugador(e.target.value)}
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
            <th className="table-th">Jugador</th>
            <th className="table-th">Club Origen</th>
            <th className="table-th">Club Destino</th>
            <th className="table-th">Monto</th>
            <th className="table-th">Fecha</th>
            <th className="table-th">Detalle</th>
          </tr>
        </thead>
        <tbody>
          {filteredPagos.length > 0 ? (
            filteredPagos.map((pago, idx) => (
              <tr key={idx} className="table-row">
                <td className="table-td">{pago.jugador_nombre} {pago.jugador_apellido}</td>
                <td className="table-td">{pago.club_origen_nombre}</td>
                <td className="table-td">{pago.club_destino_nombre}</td>
                <td className="table-td">{pago.monto_real} Bs</td>
                <td className="table-td">{formatFechaLarga(pago.pago_fecha)}</td>
                <td className="table-td">
                  <button className="table-button button-view" onClick={() => handleVerDetalle(pago.traspaso_id)}>
                    <RemoveRedEyeIcon />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="table-td">No hay pagos registrados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialPagosTraspasoClub;
