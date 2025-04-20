import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/css/Partidos/RegistrarPartido.css'; 
import { Select } from 'antd';
import { toast } from 'react-toastify';
import Club_defecto from '../../assets/img/Club_defecto.png';

const { Option } = Select;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EditarPartidoForm = () => {
  const { partidoId } = useParams();
  const navigate = useNavigate();
  const [lugarId, setLugarId] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [arbitros, setArbitros] = useState([]);
  const [selectedArbitros, setSelectedArbitros] = useState([]);
  const [equipoLocal, setEquipoLocal] = useState(null);
  const [equipoVisitante, setEquipoVisitante] = useState(null);
  const [lugarNombreActual, setLugarNombreActual] = useState('');
  const [lugaresDisponibles, setLugaresDisponibles] = useState([]);
  const [partidoLugarId, setPartidoLugarId] = useState(null);

  useEffect(() => {
    const fetchPartido = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/partidos/get_partido_completo/${partidoId}`);
          const partido = res.data;

          await fetchEquipoInfo(partido.equipo_local_id, setEquipoLocal);
          await fetchEquipoInfo(partido.equipo_visitante_id, setEquipoVisitante);
      
          const fechaMoment = moment.utc(partido.fecha).local().add(4, 'hours');

            setFecha(fechaMoment.format('YYYY-MM-DD'));
            setHoraSeleccionada(fechaMoment.format('HH:mm'));
            setLugarId(partido.lugar_id);
            setLugarNombreActual(partido.lugar_nombre || 'Desconocido');
      
          // 🔽 Aquí mismo cargamos todos los lugares
          const lugaresResponse = await axios.get(`${API_BASE_URL}/lugar/select`);
          const todosLugares = lugaresResponse.data || [];
          const otros = todosLugares.filter(l => l.id !== partido.lugar_id);
          setLugaresDisponibles(otros);
      
          await handleLugarChange(partido.lugar_id);
          await handleFechaChange(fechaMoment.format('YYYY-MM-DD'), partido.lugar_id);
          await handleHoraChange(fechaMoment.format('HH:mm'), fechaMoment.format('YYYY-MM-DD'), partido.lugar_id);

        } catch (error) {
          toast.error('Error al obtener los datos del partido');
          console.error(error);
        }
      };
      

      const fetchArbitros = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/partidos/get_arbitros/${partidoId}`);
          const arbitrosAsignados = res.data.map(a => ({ value: a.arbitro_id, label: `${a.arbitro_nombre} ${a.arbitro_apellido}` }));
      
          console.log("✅ Árbitros asignados (desde DB):", arbitrosAsignados);
      
          setSelectedArbitros(arbitrosAsignados);
        } catch (error) {
          toast.error('Error al obtener los árbitros del partido');
          console.error("❌ Error fetchArbitros:", error);
        }
      };
      

    fetchPartido();
    fetchArbitros();
  }, [partidoId]);

  const fetchEquipoInfo = async (equipoId, setEquipo) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/equipo/get_equipo/${equipoId}`);
      setEquipo(res.data);
    } catch (error) {
      console.error(`Error al obtener datos del equipo con ID ${equipoId}:`, error);
    }
  };

  const handleLugarChange = async (value) => {
    console.log("📍 Lugar seleccionado:", value, typeof value);
    setLugarId(value);
    setFecha('');
    setFechasDisponibles([]);
    setHorariosDisponibles([]);
    setHoraSeleccionada('');

    if (!value) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/partidos/fechas-disponibles/${value}`);
      setFechasDisponibles(response.data.fechas_disponibles || []);
    } catch (error) {
      toast.error('Error al obtener fechas');
      console.error(error);
    }
  };

  const handleFechaChange = async (value, lugarIdParam = lugarId) => {
    setFecha(value);
    setHorariosDisponibles([]);
    setHoraSeleccionada('');
  
    if (!value || !lugarIdParam) return;
  
    try {
      const response = await axios.get(`${API_BASE_URL}/partidos/horarios-disponibles/${lugarIdParam}/${value}`);
      setHorariosDisponibles(response.data.horarios_disponibles || []);
    } catch (error) {
      toast.error('Error al obtener horarios');
      console.error(error);
    }
  };
  

  const handleHoraChange = async (hora, fechaParam, lugarParam) => {
    setHoraSeleccionada(hora);
    setArbitros([]);
  
    if (!hora || !fechaParam || !lugarParam) return;
  
    try {
      const response = await axios.get(`${API_BASE_URL}/partidos/arbitros-disponibles/${fechaParam}/${hora}/${lugarParam}`);
  
      let disponibles = response.data.arbitros_disponibles || [];
      console.log("📦 Árbitros disponibles:", disponibles);
      console.log("📌 Árbitros asignados previamente (selectedArbitros):", selectedArbitros);
  
      const combinados = combinarArbitrosSinDuplicados(disponibles, selectedArbitros);
      setArbitros(combinados);

    } catch (error) {
      toast.error('Error al obtener árbitros');
      console.error("❌ Error handleHoraChange:", error);
    }
  };
  
  useEffect(() => {
    if (arbitros.length > 0 && selectedArbitros.length > 0) {
      const seleccionados = selectedArbitros.map(asignado => {
        const arbitro = arbitros.find(a => a.id === asignado.value);
        return arbitro
          ? { value: arbitro.id, label: `${arbitro.nombre} ${arbitro.apellido}` }
          : asignado; // lo dejamos tal cual si no lo encuentra
      });
      console.log("🎯 Final seleccionados:", seleccionados);
      setSelectedArbitros(seleccionados);
    }
  }, [arbitros]);    

  const handleArbitroChange = (value) => {
    setSelectedArbitros(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fecha || !horaSeleccionada || !lugarId || selectedArbitros.length === 0) {
      toast.error('Todos los campos son requeridos');
      return;
    }

    const formattedFecha = moment(`${fecha} ${horaSeleccionada}`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const arbitrosSeleccionados = selectedArbitros.map(a => a.value);

    try {
      await axios.post(`${API_BASE_URL}/partidos/update`, {
        partido_id: partidoId,
        lugar_id: lugarId,
        fecha: formattedFecha,
        arbitros: arbitrosSeleccionados
      });

      toast.success('Partido actualizado correctamente');
      navigate(-1);
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al actualizar el partido';
      toast.error(msg);
      console.error(error);
    }    
  };

  const combinarArbitrosSinDuplicados = (disponibles, asignados) => {
    const todos = [...disponibles];
  
    // Crear un Set con los IDs ya agregados
    const ids = new Set(todos.map(a => a.id));
  
    // Agregar solo los asignados que no estén en el Set
    asignados.forEach(a => {
      const id = a.value ?? a.id;
      if (!ids.has(id)) {
        const [nombre, apellido] = a.label?.split(' ') || [a.nombre, a.apellido];
        todos.push({ id, nombre, apellido });
        ids.add(id); // Agregar al Set también
      }
    });
  
    return todos;
  };
  
  const getImagenClub = (club) => {
    if (club.club_imagen) {
      return club.club_imagen; 
    }
    return Club_defecto;
  };
  
  return (
    <div className="registro-campeonato">
      <h2>Editar Partido</h2>
      <form onSubmit={handleSubmit}>
        <div className="select-container-u">
        <div className="main-container">
            <div className="selected-teams-edit">
                <div className="selected-team">
                    <h4>Equipo Local</h4>
                    {equipoLocal && (
                        <div className="equipo-card">
                        <img src={getImagenClub(equipoLocal)} alt={equipoLocal.club_nombre} className="club-image" />
                        <p>{equipoLocal.nombre}</p>
                        <small>{equipoLocal.club_nombre}</small>
                        </div>
                    )}
                </div>

                <h1 className="vs-title-edit">VS</h1>

                <div className="selected-team">
                    <h4>Equipo Visitante</h4>
                    {equipoVisitante && (
                        <div className="equipo-card">
                        <img src={getImagenClub(equipoVisitante)} alt={equipoVisitante.club_nombre} className="club-image" />
                        <p>{equipoVisitante.nombre}</p>
                        <small>{equipoVisitante.club_nombre}</small>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <Select
          placeholder="Seleccione un nuevo Lugar"
          value={lugarId || undefined}
          onChange={handleLugarChange}
          style={{ width: "100%" }}
          className="custom-ant-select-u"
        >
          {lugaresDisponibles.concat([{ id: lugarId, nombre: lugarNombreActual }])
            .filter(lugar => lugar.id !== undefined && lugar.id !== null)
            .map(lugar => (
              <Option key={lugar.id} value={lugar.id}>{lugar.nombre}</Option>
          ))}
        </Select>

        </div>

        <div className="select-container-u">
          <Select
            placeholder="Seleccione una Fecha"
            value={fecha || undefined}
            onChange={(value) => handleFechaChange(value, lugarId)}
            style={{ width: '100%' }}
            className='custom-ant-select-u'
          >
            {fechasDisponibles.map(fecha => (
              <Option key={fecha} value={fecha}>{fecha}</Option>
            ))}
          </Select>
        </div>

        <div className="select-container-u">
            <Select
            placeholder="Seleccione un Horario"
            value={horaSeleccionada || undefined}
            onChange={(hora) => handleHoraChange(hora, fecha, lugarId)}
            style={{ width: '100%' }}
            className='custom-ant-select-u'
            >

            {horariosDisponibles.map(hora => (
              <Option key={hora} value={hora}>{hora}</Option>
            ))}
          </Select>
        </div>

        <div className="select-container-u">
            
          <Select
            mode="multiple"
            labelInValue
            placeholder="Seleccione Árbitros"
            value={selectedArbitros}
            onChange={handleArbitroChange}
            style={{ width: '100%' }}
            className='custom-ant-select-u'
          >
            {arbitros.map(arbitro => (
              <Option key={arbitro.id} value={arbitro.id}>{arbitro.nombre} {arbitro.apellido}</Option>
            ))}
          </Select>
        </div>

        <div className="form-group">
          <button className='table-add-button' type="submit">Actualizar Partido</button>
        </div>
      </form>
    </div>
  );
};

export default EditarPartidoForm;
