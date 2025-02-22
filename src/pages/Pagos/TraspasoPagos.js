import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import RegistroPagoTraspaso from './RegistroPagoTraspaso';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaTraspasosPagos = () => {
  const [traspasos, setTraspasos] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedTraspasoId, setSelectedTraspasoId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClubes();
  }, []);

  const fetchClubes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pagos/getTraspasosDebt`);
      setTraspasos(response.data);
    } catch (error) {
      toast.error('error')
      console.error('Error al obtener los clubes:', error);
    }
  };

  const handleRegistrarClick = (TraspasoId) => {
    setSelectedTraspasoId(TraspasoId);
    setShowFormModal(true);
    console.log('Modal abierto:', showFormModal);
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Deuda por Traspasos</h2>
      <RegistroPagoTraspaso
        isOpen={showFormModal}
        onClose={handleCloseModal}
        onClubCreated={fetchClubes} 
        traspasoId={selectedTraspasoId}
      />
      <table className="table-layout">
        <thead className="table-head">
          <tr>
            <th className="table-th">Jugador</th>
            <th className="table-th">Club Actual</th>
            <th className="table-th">Club Destino</th>
            <th className="table-th">Deuda</th>
            <th className="table-th">Acción</th>
          </tr>
        </thead>
        <tbody  >
          {traspasos.map((traspaso) => (
            <tr key={traspaso.id} className="table-row">
                <td className="table-td-p">
                    <div className="jugador-info">
                        <img 
                        src={traspaso.persona_imagen} 
                        alt={`${traspaso.jugador_nombre} foto`} 
                        className="table-logo" 
                        />
                        <span>{traspaso.jugador_nombre} {traspaso.jugador_apellido}</span>
                    </div>
                </td>
                <td className="table-td-p">
                    <div className="jugador-info">
                        <img 
                        src={traspaso.club_origen_imagen} 
                        alt={`${traspaso.club_origen_nombre} foto`} 
                        className="table-logo" 
                        />
                        <span>{traspaso.club_origen_nombre}</span>
                    </div>
                </td>
                <td className="table-td-p">
                    <div className="jugador-info">
                        <img 
                        src={traspaso.club_destino_imagen} 
                        alt={`${traspaso.club_destino_nombre} foto`} 
                        className="table-logo" 
                        />
                        <span>{traspaso.club_destino_nombre}</span>
                    </div>
                </td>
              <td className="table-td table-td-description">{traspaso.costo_traspaso !== null ? traspaso.costo_traspaso : 100} Bs</td>
              <td className="table-td">
                <button className="table-button button-view"  onClick={() => handleRegistrarClick(traspaso.traspaso_id)}><RemoveRedEyeIcon/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaTraspasosPagos;
