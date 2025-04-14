import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useParams,useNavigate } from 'react-router-dom';
import '../../assets/css/Partidos/RegistrarPartido.css'; 
import { DatePicker, Select } from 'antd';
import { toast } from 'react-toastify';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState('');

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/equipo/get_equipoCategoria/${categoriaId}/${campeonatoId}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!equipoLocalId || !equipoVisitanteId || !fecha || !horaSeleccionada || !lugarId) {
      toast.error('Todos los campos requeridos deben ser proporcionados');
      return;
    }

    const formattedFecha = moment(`${fecha} ${horaSeleccionada}`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

    const arbitrosSeleccionados = selectedArbitros.map(arbitro => arbitro.value); 

    try {
      const response = await axios.post(`${API_BASE_URL}/partidos/insert`, {
        campeonato_id: parseInt(campeonatoId, 10),
        equipo_local_id: equipoLocalId,
        equipo_visitante_id: equipoVisitanteId,
        fecha: formattedFecha,
        lugar_id: lugarId,
        arbitros: arbitrosSeleccionados 
      });

      toast.success('Registrado con éxito');

      // 🔄 Limpiar los estados después del registro exitoso
      setEquipoLocalId('');
      setEquipoVisitanteId('');
      setFecha(null);
      setHoraSeleccionada('');
      setLugarId('');
      setResultado('');
      setEquipoLocal(null);
      setEquipoVisitante(null);
      setSelectedArbitros([]);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al crear el Partido';
      toast.warn(errorMessage);
      console.error('Error en la creación del partido:', err.message);
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

    const handleLugarChange = async (value) => {
      setLugarId(value);
      setFechasDisponibles([]); 
      setHorariosDisponibles([]); 
      setHoraSeleccionada('');
      setSelectedArbitros([]);
    
      if (!value) return;
    
      try {
        const response = await axios.get(`${API_BASE_URL}/partidos/fechas-disponibles/${value}`);
  
        if (Array.isArray(response.data.fechas_disponibles)) {
          setFechasDisponibles(response.data.fechas_disponibles);
        } else {
          setFechasDisponibles([]);
        }
      } catch (error) {
        toast.error('Error al obtener las fechas disponibles');
        console.error("❌ Error en handleLugarChange:", error);
        setFechasDisponibles([]);
      }
    };

    const handleFechaChange = async (value) => {
      setFecha(value);
      setHorariosDisponibles([]); 
      setHoraSeleccionada('');
      setSelectedArbitros([]);
    
      if (!value) return;
    
      try {
        const response = await axios.get(`${API_BASE_URL}/partidos/horarios-disponibles/${lugarId}/${value}`);
 
        if (Array.isArray(response.data.horarios_disponibles)) {
          setHorariosDisponibles(response.data.horarios_disponibles);
        } else {
          setHorariosDisponibles([]); 
        }
      } catch (error) {
        toast.error('Error al obtener los horarios disponibles');
        console.error("❌ Error en handleFechaChange:", error);
        setHorariosDisponibles([]);
      }
    };
    
  const handleHoraChange = async (value) => {
    setHoraSeleccionada(value);
    setSelectedArbitros([]);
  
    if (!value || !fecha || !lugarId) return;
  
    try {
      const response = await axios.get(`${API_BASE_URL}/partidos/arbitros-disponibles/${fecha}/${value}/${lugarId}`);
      setArbitros(response.data.arbitros_disponibles || []);
    } catch (error) {
      toast.error('Error al obtener los árbitros disponibles');
      setArbitros([]);
    }
  };  

  const handleArbitroChange = (value) => {
    setSelectedArbitros(value);
  };

  const handleGenerarFixtureClick = () => {
    navigate(`/partidos/generarFixture/${campeonatoId}/${categoriaId}`);
  };

  return (
    <div className="registro-campeonato">
        <div className="titulo-con-boton">
          <button className="boton-volver" onClick={() => window.history.back()}>
            <ArrowBackIcon />
          </button>
          <h2 className="all-matches-titulo">Registrar Partido</h2>
        </div>
      
      <div className="button-container">
        <button className="table-add-button" onClick={handleGenerarFixtureClick}>
          Generar Fixture Automáticamente <ShuffleIcon/>
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
          placeholder="Seleccione una Fecha"
          value={fecha || undefined}
          onChange={handleFechaChange}
          style={{ width: '100%' }}
          allowClear
          className='custom-ant-select-u'
        >
          {fechasDisponibles.length > 0 ? (
            fechasDisponibles.map((fecha) => (
              <Option key={fecha} value={fecha}>
                {fecha}
              </Option>
            ))
          ) : (
            <Option disabled value="">No hay fechas disponibles</Option>
          )}
        </Select>

      </div>

        <div className="select-container-u">
        <Select
          placeholder="Seleccione un Horario"
          value={horaSeleccionada || undefined}
          onChange={handleHoraChange}
          style={{ width: '100%' }}
          allowClear
          className='custom-ant-select-u'
        >
          {horariosDisponibles.map((hora) => (
            <Option key={hora} value={hora}>
              {hora}
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
              {arbitro.nombre} {arbitro.apellido}
            </Option>
          ))}
        </Select>


        </div>
        <div className="form-group">
          <button className='table-add-button' type="submit">Registrar Partido</button>
        </div>
      </form>
    </div>
  );
};

export default PartidoForm;
   