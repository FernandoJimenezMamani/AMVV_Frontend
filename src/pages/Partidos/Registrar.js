import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useParams } from 'react-router-dom'; // Import useParams to get the URL parameters
import '../../assets/css/Partidos/RegistrarPartido.css'; 
import { DatePicker, Select } from 'antd';

const { Option } = Select;

const PartidoForm = () => {
  const { campeonatoId, categoriaId } = useParams(); // Get the campeonatoId and categoriaId from the URL
  const [equipoLocalId, setEquipoLocalId] = useState('');
  const [equipoVisitanteId, setEquipoVisitanteId] = useState('');
  const [fecha, setFecha] = useState(null); // Initialize as null
  const [lugarId, setLugarId] = useState(''); 
  const [resultado, setResultado] = useState('');
  const [equipos, setEquipos] = useState([]); // Initialize as an empty array
  const [lugares, setLugares] = useState([]); 
  const [equipoLocal, setEquipoLocal] = useState(null);
  const [equipoVisitante, setEquipoVisitante] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/equipo/get_equipo/${categoriaId}`);
        console.log("Equipos fetched:", response.data); // Check the data structure
        setEquipos(response.data || []); // Ensure data is an array or fallback to an empty array
      } catch (err) {
        console.error('Error fetching equipos:', err.message);
        setEquipos([]); // Fallback to an empty array on error
      }
    };

    const fetchLugares = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/lugar/select');
        setLugares(response.data || []); // Ensure data is an array or fallback to an empty array
      } catch (error) {
        console.error('Error al obtener los lugares:', error);
        setLugares([]); // Fallback to an empty array on error
      }
    };

    fetchEquipos();
    fetchLugares();
  }, [categoriaId]);

  const handleDateChange = (date) => {
    if (date) {
      setFecha(date.format('YYYY-MM-DD HH:mm:ss')); // Convert to string format
    } else {
      setFecha(null); // Reset if no date is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!equipoLocalId || !equipoVisitanteId || !fecha || !lugarId) {
      setError('Todos los campos requeridos deben ser proporcionados');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5002/api/partidos/insert', {
        campeonato_id: campeonatoId, // Use the campeonatoId from the URL
        equipo_local_id: equipoLocalId,
        equipo_visitante_id: equipoVisitanteId,
        fecha,
        lugar_id: lugarId,
        resultado,
      });
      setSuccess('Partido creado exitosamente');
      setEquipoLocalId('');
      setEquipoVisitanteId('');
      setFecha(null); // Reset date after submission
      setLugarId('');
      setResultado('');
      setEquipoLocal(null);
      setEquipoVisitante(null);
    } catch (err) {
      setError('Error al crear el Partido');
      console.error(err.message);
    }
  };

  const selectEquipoLocal = (id) => {
    if (id === equipoVisitanteId) {
      setError('El equipo local y visitante no pueden ser el mismo');
    } else {
      const selectedEquipo = equipos.find((equipo) => equipo.id === id);
      setEquipoLocalId(id);
      setEquipoLocal(selectedEquipo);
      setError('');
    }
  };

  const selectEquipoVisitante = (id) => {
    if (id === equipoLocalId) {
      setError('El equipo local y visitante no pueden ser el mismo');
    } else {
      const selectedEquipo = equipos.find((equipo) => equipo.id === id);
      setEquipoVisitanteId(id);
      setEquipoVisitante(selectedEquipo);
      setError('');
    }
  };

  const handleLugarChange = (value) => {
    setLugarId(value); 
  };

  return (
    <div className="registro-campeonato">
      <h2>Registrar Partido</h2>
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
      <div className="select-container">
        <Select
          placeholder="Seleccione un Lugar"
          value={lugarId || undefined} 
          onChange={handleLugarChange}
          style={{ width: '100%' }}
          allowClear
        >
          {lugares.map(lugar => (
            <Option key={lugar.id} value={lugar.id}>
              {lugar.nombre}
            </Option>
          ))}
        </Select>
      </div>
        <div className="form-group">
          <DatePicker
            required
            className="custom-range-picker"
            showTime
            value={fecha ? moment(fecha) : null} 
            onChange={handleDateChange}
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Seleccione la fecha del partido"
          />
        </div>
      <div className="form-group">
          <button id="RegCampBtn" type="submit">Registrar Partido</button>
      </div>
        
      </form>
    </div>
  );
};

export default PartidoForm;
