import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import RegistroPagoTraspaso from './RegistroPagoTraspaso';
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';
import Club_defecto from '../../assets/img/Club_defecto.png';
import { Select } from 'antd';
import DetallePagoTraspaso from './DetallePagoTraspaso';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const HistorialPagosTraspaso = () => {
  const [traspasos, setTraspasos] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedTraspasoId, setSelectedTraspasoId] = useState(null);
  const [selectedCampeonato, setSelectedCampeonato] = useState(null);
  const [campeonatos, setCampeonatos] = useState([]);
  const navigate = useNavigate();

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
    fetchClubes();
  }, [selectedCampeonato]);

  const fetchClubes = async () => {
    if(!selectedCampeonato) return; 
    try {
  
      const response = await axios.get(`${API_BASE_URL}/pagos/historial-traspasos/${selectedCampeonato}`);
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

  const getImagenPerfil = (jugador) => {
    if (jugador.persona_imagen) {
      return jugador.persona_imagen; 
    }
    return jugador.jugador_genero === 'V' ? defaultUserMenIcon : defaultUserWomenIcon; 
  };

  const getImagenClubDestino = (club) => {
    if (club.club_destino_imagen) {
      return club.club_destino_imagen; 
    }
    return Club_defecto;
  };

  const getImagenClubOrigen = (club) => {
    if (club.club_origen_imagen) {
      return club.club_origen_imagen; 
    }
    return Club_defecto;
  };
  
  return (
    <div className="table-container">
      <h2 className="table-title">Historial de Traspasos</h2>
      <DetallePagoTraspaso
        isOpen={showFormModal}
        onClose={handleCloseModal}
        traspasoId={selectedTraspasoId}
        campeonatoId={selectedCampeonato}
      />
        <div className="table-filters">
        <Select
                  value={selectedCampeonato ?? undefined} 
                  onChange={setSelectedCampeonato}
                  style={{ width: 250, marginBottom: '0px' }}
                  className="filter-select"
                  >
      
                {campeonatos.map((campeonato) => (
                  <Select.Option key={campeonato.id} value={campeonato.id}>
                    {campeonato.nombre}
                  </Select.Option>
                ))}
              </Select>
        </div>
      
      <table className="table-layout">
        <thead className="table-head">
          <tr>
            <th className="table-th">Jugador</th>
            <th className="table-th">Club Actual</th>
            <th className="table-th">Club Destino</th>
            <th className="table-th">Acción</th>
          </tr>
        </thead>
        <tbody  >
          {traspasos.map((traspaso) => (
            <tr key={traspaso.id} className="table-row">
                <td className="table-td-p">
                    <div className="jugador-info">
                        <img 
                        src={getImagenPerfil(traspaso)} 
                        alt={`${traspaso.jugador_nombre} foto`} 
                        className="table-logo" 
                        />
                        <span>{traspaso.jugador_nombre} {traspaso.jugador_apellido}</span>
                    </div>
                </td>
                <td className="table-td-p">
                    <div className="jugador-info">
                        <img 
                        src={getImagenClubOrigen(traspaso)} 
                        alt={`${traspaso.club_origen_nombre} foto`} 
                        className="table-logo" 
                        />
                        <span>{traspaso.club_origen_nombre}</span>
                    </div>
                </td>
                <td className="table-td-p">
                    <div className="jugador-info">
                        <img 
                        src={getImagenClubDestino(traspaso)} 
                        alt={`${traspaso.club_destino_nombre} foto`} 
                        className="table-logo" 
                        />
                        <span>{traspaso.club_destino_nombre}</span>
                    </div>
                </td>
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

export default HistorialPagosTraspaso;
