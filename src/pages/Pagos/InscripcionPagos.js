import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/IndiceTabla.css';
import { toast } from 'react-toastify';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ListaEquiposPagos = () => {
  const [equipos, setEquipos] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="table-container">
      <h2 className="table-title">Lista de Equipos</h2>
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
          {equipos.map((equipo) => (
            <tr key={equipo.id} className="table-row">

              <td className="table-td">
                <img src={equipo.imagen_club} alt={`${equipo.nombre_club} logo`} className="table-logo" />
              </td>
              <td className="table-td table-td-name">{equipo.equipo_nombre}</td>
              <td className="table-td table-td-name">{equipo.nombre_club}</td>
              <td className="table-td table-td-name">{equipo.Categoria}</td>
              <td className="table-td table-td-name">{equipo.genero}</td>
              <td className="table-td table-td-description">{equipo.costo_inscripcion} Bs</td>
              <td className="table-td">
                <button className="table-button button-view" ><RemoveRedEyeIcon/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaEquiposPagos;
