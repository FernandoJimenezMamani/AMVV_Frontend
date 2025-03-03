import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useParams,useNavigate } from 'react-router-dom';
import '../../assets/css/Partidos/RegistrarPartido.css'; 
import { DatePicker, Select } from 'antd';
import { toast } from 'react-toastify';


const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PartidoForm = () => {
  const { campeonatoId, categoriaId } = useParams();
  const [equipoLocalId, setEquipoLocalId] = useState('');
  const [equipoVisitanteId, setEquipoVisitanteId] = useState('');
  const [fecha, setFecha] = useState(null);
  const [lugarId, setLugarId] = useState(''); 
  const [resultado, setResultado] = useState('');
  const [equipos, setEquipos] = useState([]);
  const [selectedArbitros, setSelectedArbitros] = useState([]);
  const [lugares, setLugares] = useState([]); 
  const [arbitros, setArbitros] = useState([]); 
  const [equipoLocal, setEquipoLocal] = useState(null);
  const [equipoVisitante, setEquipoVisitante] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/equipo/get_equipoCategoria/${categoriaId}/${campeonatoId}`);
        console.log("Equipos fetched:", response.data);
        setEquipos(response.data || []);
      } catch (err) {
        toast.error('Error fetching equipos');
        console.error('Error fetching equipos:', err.message);
        setEquipos([]);
      }
    };

    const fetchLugares = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/lugar/select`);
        console.log("Lugares fetched:", response.data);
        setLugares(response.data || []);
      } catch (error) {
        toast.error('Error al obtener los lugares');
        console.error('Error al obtener los lugares:', error);
        setLugares([]);
      }
    };

    fetchEquipos();
    fetchLugares();
  }, [categoriaId]);

  useEffect(() => { 
    const fetchArbitros = async () => {
      try{
        const response = await axios.get(`${API_BASE_URL}/arbitro/get_arbitros`);
        console.log(response.data);
        setArbitros(response.data || []);
        console.log('Arbitros:', arbitros);

      }catch (error) {
        toast.error('Error al obtener los arbitros');
        setArbitros([]);
      }

      
    };
    fetchArbitros();
  }, []);

  const handleDateChange = (date) => {
    if (date) {
      setFecha(date.format('YYYY-MM-DD HH:mm:ss'));
      console.log("Fecha seleccionada:", date.format('YYYY-MM-DD HH:mm:ss'));
    } else {
      setFecha(null);
    }
  };

  const disabledDate = (current) => {
    // No puede seleccionar fechas anteriores a la fecha actual
    return current && current < moment().startOf('day');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!equipoLocalId || !equipoVisitanteId || !fecha || !lugarId) {
      setError('Todos los campos requeridos deben ser proporcionados');
      return;
    }

    const formattedFecha = moment(fecha).format('YYYY-MM-DD HH:mm:ss');
    
    console.log({
      campeonato_id: parseInt(campeonatoId, 10),
      equipo_local_id: equipoLocalId,
      equipo_visitante_id: equipoVisitanteId,
      fecha: formattedFecha,
      lugar_id: lugarId,
      resultado,
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/partidos/insert`, {
        campeonato_id: parseInt(campeonatoId, 10),
        equipo_local_id: equipoLocalId,
        equipo_visitante_id: equipoVisitanteId,
        fecha: formattedFecha,
        lugar_id: lugarId,
        arbitros: selectedArbitros.map(arbitro => arbitro.key)
      });
      
      toast.success('Registrado con éxito');
      setEquipoLocalId('');
      setEquipoVisitanteId('');
      setFecha(null);
      setLugarId('');
      setResultado('');
      setEquipoLocal(null);
      setEquipoVisitante(null);
      setSelectedArbitros([]);
    } catch (err) {
      toast.error('Error al crear el Partido');
      console.error(err.message);
    }
  };

  const selectEquipoLocal = (id) => {
    if (id === equipoVisitanteId) {
      toast.warn('El equipo local y visitante no pueden ser el mismo');
    } else {
      const selectedEquipo = equipos.find((equipo) => equipo.id === id);
      setEquipoLocalId(id);
      setEquipoLocal(selectedEquipo);
    }
  };

  const selectEquipoVisitante = (id) => {
    if (id === equipoLocalId) {
      toast.warn('El equipo local y visitante no pueden ser el mismo');
    } else {
      const selectedEquipo = equipos.find((equipo) => equipo.id === id);
      setEquipoVisitanteId(id);
      setEquipoVisitante(selectedEquipo);
    }
  };

  const handleLugarChange = (value) => {
    setLugarId(value); 
  };

  const handleArbitroChange = (value) => {
    console.log('Selected Arbitros:', value);
    setSelectedArbitros(value);
  };

  const handleGenerarFixtureClick = () => {
    navigate(`/partidos/generarFixture/${campeonatoId}/${categoriaId}`);
  };

  return (
    <div className="registro-campeonato">
      <h2>Registrar Partido</h2>
      <div className="button-container">
        <button className="table-add-button" onClick={handleGenerarFixtureClick}>
          Generar Fixture Aleatorio
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <div className="main-container">
        <div className="equipos-container-wrapper left">
          <h3>Seleccione el Equipo Local</h3>
          <div className="equipos-container">
            {equipos.map((equipo) => (
              <div
                key={equipo.id}
                className={`equipo-card ${equipoLocalId === equipo.id ? 'selected' : ''}`}
                onClick={() => selectEquipoLocal(equipo.id)}
              >
                <img src={equipo.club_imagen} alt={equipo.club_nombre} className="club-image" />
                <p>{equipo.nombre}</p>
                <br /> 
                <small>{equipo.club_nombre}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="selected-teams">
          <div className="selected-team">
            <h4>Equipo Local Seleccionado</h4>
            {equipoLocal && (
              <div className="equipo-card">
                <img src={equipoLocal.club_imagen} alt={equipoLocal.club_nombre} className="club-image" />
                <p>{equipoLocal.nombre}</p>
                <small>{equipoLocal.club_nombre}</small>
              </div>
            )}
          </div>
          <h1 className="vs-title">VS</h1>
          <div className="selected-team">
            <h4>Equipo Visitante Seleccionado</h4>
            {equipoVisitante && (
              <div className="equipo-card">
                <img src={equipoVisitante.club_imagen} alt={equipoVisitante.club_nombre} className="club-image" />
                <p>{equipoVisitante.nombre}</p>
                <small>{equipoVisitante.club_nombre}</small>
              </div>
            )}
          </div>
        </div>

        <div className="equipos-container-wrapper right">
          <h3>Seleccione el Equipo Visitante</h3>
          <div className="equipos-container">
            {equipos.map((equipo) => (
              <div
                key={equipo.id}
                className={`equipo-card ${equipoVisitanteId === equipo.id ? 'selected' : ''}`}
                onClick={() => selectEquipoVisitante(equipo.id)}
              >
                <img src={equipo.club_imagen} alt={equipo.club_nombre} className="club-image" />
                <p>{equipo.nombre}</p>
                <small>{equipo.club_nombre}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

      <div className="form-group">
          <DatePicker
            required
            className="custom-range-picker"
            showTime
            value={fecha ? moment(fecha) : null}
            onChange={handleDateChange}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Seleccione la fecha del partido"
            disabledDate={disabledDate} // Deshabilitar fechas anteriores
          />
        </div>
        <div className="select-container-u">
          <Select
            placeholder="Seleccione un Lugar"
            value={lugarId || undefined} 
            onChange={handleLugarChange}
            style={{ width: '100%' }}
            allowClear
            className='custom-ant-select-u'
          >
            {lugares.map(lugar => (
              <Option key={lugar.id} value={lugar.id}>
                {lugar.nombre}
              </Option>
            ))}
          </Select>
        </div>
        
        <div className="select-container-u">
        <Select
          mode="multiple"
          labelInValue
          placeholder="Seleccione un Árbitro"
          onChange={handleArbitroChange}
          style={{ width: '100%'  }}
          allowClear
          value={selectedArbitros}
          className='custom-ant-select-u'
        >
          {arbitros.map(arbitro => (
            <Option key={arbitro.id} value={arbitro.id}>
              {arbitro.nombre}
            </Option>
          ))}
        </Select>


        </div>
        <div className="form-group">
          <button id="RegCampBtn" type="submit">Registrar Partido</button>
        </div>
      </form>
    </div>
  );
};

export default PartidoForm;
   