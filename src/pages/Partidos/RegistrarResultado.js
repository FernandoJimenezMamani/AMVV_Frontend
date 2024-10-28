import React, { useState, useEffect } from 'react';
import { useParams,useNavigate,useLocation  } from 'react-router-dom';
import '../../assets/css/RegistroResultados.css';
import { toast } from 'react-toastify';

const SubmitResultados = () => {
  const { partidoId } = useParams();
  const [walkover, setWalkover] = useState('null');
  const [localSets, setLocalSets] = useState({ set1: '', set2: '', set3: '' });
  const [visitanteSets, setVisitanteSets] = useState({ set1: '', set2: '', set3: '' });
  const [equipoLocal, setEquipoLocal] = useState(null);
  const [equipoVisitante, setEquipoVisitante] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [tipoTarjeta, setTipoTarjeta] = useState('');
  const [tarjetas, setTarjetas] = useState([]);
  const [showSet3, setShowSet3] = useState(false);
  const [imagenPlanilla, setImagenPlanilla] = useState(null);
  const [resultadoLocal, setResultadoLocal] = useState('P');
  const [resultadoVisitante, setResultadoVisitante] = useState('P');
  const navigate = useNavigate();
  const location = useLocation();
  const { campeonatoId, categoriaId } = location.state || {};


  useEffect(() => {
    const fetchEquiposYJugadores = async () => {
      try {
        const equiposResponse = await fetch(`http://localhost:5002/api/equipo/get_equipoByPartido/${partidoId}`);
        const equipos = await equiposResponse.json();

        if (equipos.length === 2) {
          setEquipoLocal(equipos[0]);
          setEquipoVisitante(equipos[1]);
          const equipoIdSeleccionado = equipoSeleccionado || equipos[0].equipo_id;
          setEquipoSeleccionado(equipoIdSeleccionado);

          const jugadoresResponse = await fetch(`http://localhost:5002/api/jugador/getJugadoresByEquipo/${equipoIdSeleccionado}`);
          const jugadoresData = await jugadoresResponse.json();
          setJugadores(jugadoresData);
        }
      } catch (error) {
        console.error('Error al obtener los equipos y jugadores:', error);
      }
    };

    fetchEquiposYJugadores();
  }, [partidoId, equipoSeleccionado]);
  useEffect(() => {
    if (walkover === 'L') {
      setResultadoLocal('P');
      setResultadoVisitante('G');
    } else if (walkover === 'V') {
      setResultadoLocal('G');
      setResultadoVisitante('P');
    } else if (walkover === 'both') {
      setResultadoLocal('P');
      setResultadoVisitante('P');
    }
  }, [walkover]);
  

  const handleWalkoverChange = (e) => {
    const value = e.target.value;
    setWalkover(value);
  
    if (value === 'L') {
      setLocalSets({ set1: 0, set2: 0, set3: 0 });
      setVisitanteSets({ set1: 25, set2: 25, set3: 0 });
      setResultadoLocal('P');
      setResultadoVisitante('G');
      setShowSet3(false);
    } else if (value === 'V') {
      setLocalSets({ set1: 25, set2: 25, set3: 0 });
      setVisitanteSets({ set1: 0, set2: 0, set3: 0 });
      setResultadoLocal('G');
    setResultadoVisitante('P');
      setShowSet3(false);
    } else if (value === 'both') {
      setLocalSets({ set1: 0, set2: 0, set3: 0 });
      setVisitanteSets({ set1: 0, set2: 0, set3: 0 });
      setResultadoLocal('P');
    setResultadoVisitante('P');
      setShowSet3(true); // Mostrar todos los sets con valores de 0.
    } else {
      setLocalSets({ set1: '', set2: '', set3: '' });
      setVisitanteSets({ set1: '', set2: '', set3: '' });
      setShowSet3(true);
    }
  };

  const handleImageChange = (e) => {
    setImagenPlanilla(e.target.files[0]); // Guardar la imagen seleccionada
  };
  

  const handleInputChange = (e, team, setFunction) => {
    const { name, value } = e.target;
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue)) return;
    setFunction({ ...team, [name]: parsedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Asegurar que los sets tengan valores válidos antes de enviarlos
    const cleanedLocalSets = {
      set1: localSets.set1 ?? 0,
      set2: localSets.set2 ?? 0,
      set3: localSets.set3 ?? 0,
      resultado: resultadoLocal,
    };
  
    const cleanedVisitanteSets = {
      set1: visitanteSets.set1 ?? 0,
      set2: visitanteSets.set2 ?? 0,
      set3: visitanteSets.set3 ?? 0,
      resultado: resultadoVisitante,
    };
  
    const formData = new FormData();
    formData.append('partido_id', partidoId);
    formData.append('walkover', walkover === 'null' ? '' : walkover);
    formData.append('resultadoLocal', JSON.stringify(cleanedLocalSets));
    formData.append('resultadoVisitante', JSON.stringify(cleanedVisitanteSets));
    formData.append('tarjetas', JSON.stringify(tarjetas));
  
    if (imagenPlanilla) {
      formData.append('imagenPlanilla', imagenPlanilla);
    }
  
    try {
      const response = await fetch('http://localhost:5002/api/partidos/submitResultados', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        toast.success('Registrado con éxito');
        navigate(`/partidos/indice/${campeonatoId}/${categoriaId}`);
      } else {
        toast.error('Error durante el registro');
        console.error('Error:', result.message);
      }
    } catch (error) {
      toast.error('Error durante el registro');
      console.error('Error al enviar los resultados:', error);
    }
  };
  

  const validateAllSets = () => {
    return (
      validateSetResult('set1') &&
      validateSetResult('set2') &&
      (showSet3 ? validateSetResult('set3') : true)
    );
  };

  const validateSetResult = (setName) => {
    const localScore = localSets[setName];
    const visitanteScore = visitanteSets[setName];
    const isThirdSet = setName === 'set3';
    const winningScore = isThirdSet ? 15 : 25;

    if (localScore >= winningScore || visitanteScore >= winningScore) {
      const difference = Math.abs(localScore - visitanteScore);
      if (difference < 2) {
        toast.warn(`La diferencia de puntos debe ser de al menos 2 cuando uno de los equipos tiene ${winningScore} puntos o más en el ${isThirdSet ? 'tercer' : 'set'}. (Actual: ${localScore} - ${visitanteScore})`);
        return false;
      }
    } else {
      if (Math.min(localScore, visitanteScore) < (isThirdSet ? 14 : 24)) {
        toast.warn(`Uno de los equipos debe tener al menos ${winningScore} puntos para ganar el ${isThirdSet ? 'tercer set' : 'set'}.`);
        return false;
      }
    }

    return true;
  };

  const validateSetResultOnBlur = () => {
    const localScores = [localSets.set1, localSets.set2, localSets.set3].map(Number);
    const visitanteScores = [visitanteSets.set1, visitanteSets.set2, visitanteSets.set3].map(Number);
  
    let localWins = 0;
    let visitanteWins = 0;
  
    // Calcular los sets ganados por cada equipo
    for (let i = 0; i < 3; i++) {
      if (localScores[i] > visitanteScores[i]) {
        localWins++;
      } else if (visitanteScores[i] > localScores[i]) {
        visitanteWins++;
      }
    }
  
    // Determinar el ganador y el perdedor
    if (localWins > visitanteWins) {
      setResultadoLocal('G');
      setResultadoVisitante('P');
    } else if (visitanteWins > localWins) {
      setResultadoLocal('P');
      setResultadoVisitante('G');
    }
  
    // Mostrar el tercer set solo si hay un empate en los primeros dos sets
    // o si ya hay valores en el tercer set.
    const shouldShowSet3 =
      localWins === 1 && visitanteWins === 1 || localSets.set3 || visitanteSets.set3;
  
    setShowSet3(shouldShowSet3);
  };
  
  
  
  

  const handleAgregarTarjeta = () => {
    const jugador = jugadores.find((j) => j.jugador_id === parseInt(jugadorSeleccionado));
    const equipo = [equipoLocal, equipoVisitante].find((e) => e.equipo_id === parseInt(equipoSeleccionado));

    const nuevaTarjeta = {
      equipoId: equipoSeleccionado,
      equipoNombre: equipo.equipo_nombre,
      jugadorId: jugadorSeleccionado,
      jugadorNombre: `${jugador.nombre_persona} ${jugador.apellido_persona}`,
      tipoTarjeta,
    };

    setTarjetas([...tarjetas, nuevaTarjeta]);
    setEquipoSeleccionado(null);
    setJugadorSeleccionado(null);
    setTipoTarjeta('');
  };

  if (!equipoLocal || !equipoVisitante) {
    return <div className="container">Cargando equipos...</div>;
  }

  return (
    <div className="container">
  <h1>Registrar Resultados del Partido</h1>
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <label>Walkover</label>
      <div className="radio-group">
        <div className="radio-option">
          <label>
            <input
              type="radio"
              name="walkover"
              value="L"
              checked={walkover === 'L'}
              onChange={handleWalkoverChange}
            />
            Local
          </label>
        </div>
        <div className="radio-option">
          <label>
            <input
              type="radio"
              name="walkover"
              value="V"
              checked={walkover === 'V'}
              onChange={handleWalkoverChange}
            />
            Visitante
          </label>
        </div>
        <div className="radio-option">
          <label>
            <input
              type="radio"
              name="walkover"
              value="both"
              checked={walkover === 'both'}
              onChange={handleWalkoverChange}
            />
            Ambos
          </label>
        </div>
        <div className="radio-option">
          <label>
            <input
              type="radio"
              name="walkover"
              value="null"
              checked={walkover === 'null'}
              onChange={handleWalkoverChange}
            />
            Ninguno
          </label>
        </div>
      </div>
    </div>

    <div className="results-group">
      <div className="team-column">
        <div className="team-header">
          <img src={equipoLocal.club_imagen} alt="Escudo Local" className="team-logo" />
          <h2>{equipoLocal.equipo_nombre}</h2>
        </div>
        <div className="inputs-group">
          <input
            type="number"
            name="set1"
            placeholder="Set 1 Local"
            value={localSets.set1}
            onChange={(e) => handleInputChange(e, localSets, setLocalSets)}
            onBlur={validateSetResultOnBlur}
            disabled={walkover !== 'null'}
            required
          />
          <input
            type="number"
            name="set2"
            placeholder="Set 2 Local"
            value={localSets.set2}
            onChange={(e) => handleInputChange(e, localSets, setLocalSets)}
            onBlur={validateSetResultOnBlur}
            disabled={walkover !== 'null'}
            required
          />
          {showSet3 && walkover !== 'L' && walkover !== 'V' && (
            <input
              type="number"
              name="set3"
              placeholder="Set 3 Local"
              value={localSets.set3}
              onChange={(e) => handleInputChange(e, localSets, setLocalSets)}
              onBlur={validateSetResultOnBlur}
              disabled={walkover === 'both' ? false : walkover !== 'null'}
              required
            />
          )}
        </div>
      </div>

      <div className="team-column">
        <div className="team-header">
          <img src={equipoVisitante.club_imagen} alt="Escudo Visitante" className="team-logo" />
          <h2>{equipoVisitante.equipo_nombre}</h2>
        </div>
        <div className="inputs-group">
          <input
            type="number"
            name="set1"
            placeholder="Set 1 Visitante"
            value={visitanteSets.set1}
            onChange={(e) => handleInputChange(e, visitanteSets, setVisitanteSets)}
            onBlur={validateSetResultOnBlur}
            disabled={walkover !== 'null'}
            required
          />
          <input
            type="number"
            name="set2"
            placeholder="Set 2 Visitante"
            value={visitanteSets.set2}
            onChange={(e) => handleInputChange(e, visitanteSets, setVisitanteSets)}
            onBlur={validateSetResultOnBlur}
            disabled={walkover !== 'null'}
            required
          />
          {showSet3 && walkover !== 'L' && walkover !== 'V' && (
            <input
              type="number"
              name="set3"
              placeholder="Set 3 Visitante"
              value={visitanteSets.set3}
              onChange={(e) => handleInputChange(e, visitanteSets, setVisitanteSets)}
              onBlur={validateSetResultOnBlur}
              disabled={walkover === 'both' ? false : walkover !== 'null'}
              required
            />
          )}
        </div>
      </div>
    </div>

    <button type="button" onClick={() => setShowModal(true)} className="open-modal-btn">
  Registrar Tarjetas
</button>


    {tarjetas.length > 0 && (
      <div className="tarjetas-registradas">
        <h3>Tarjetas Registradas</h3>
        <ul>
          {tarjetas.map((tarjeta, index) => (
            <li key={index}>
              {tarjeta.equipoNombre} - {tarjeta.jugadorNombre} - {tarjeta.tipoTarjeta}
            </li>
          ))}
        </ul>
      </div>
    )}
 <div className="form-group">
          <label htmlFor="imagenPlanilla">Subir Imagen de la Planilla:</label>
          <input
            type="file"
            id="imagenPlanilla"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
    <div className="actions">
      <button type="submit" className="submit-btn">Enviar Resultados</button>
    </div>
  </form>

  {showModal && (
    <>
      <div className="modal-background" onClick={() => setShowModal(false)}></div>
      <div className="modal">
        <div className="modal-content">
          <button onClick={() => setShowModal(false)} className="close-btn">
            &times;
          </button>
          <h2>Registrar Tarjeta</h2>
          <select onChange={(e) => setEquipoSeleccionado(e.target.value)} value={equipoSeleccionado}>
            <option value="">Seleccione un equipo</option>
            {equipoLocal && <option value={equipoLocal.equipo_id}>{equipoLocal.equipo_nombre}</option>}
            {equipoVisitante && <option value={equipoVisitante.equipo_id}>{equipoVisitante.equipo_nombre}</option>}
          </select>

          {equipoSeleccionado && (
            <select onChange={(e) => setJugadorSeleccionado(e.target.value)} value={jugadorSeleccionado}>
              <option value="">Seleccione un jugador</option>
              {jugadores.map((jugador) => (
                <option key={jugador.jugador_id} value={jugador.jugador_id}>
                  {jugador.nombre_persona} {jugador.apellido_persona}
                </option>
              ))}
            </select>
          )}

          {jugadorSeleccionado && (
            <select onChange={(e) => setTipoTarjeta(e.target.value)} value={tipoTarjeta}>
              <option value="">Seleccione el tipo de tarjeta</option>
              <option value="roja">Roja</option>
              <option value="amarilla">Amarilla</option>
            </select>
          )}

          <button onClick={handleAgregarTarjeta} disabled={!equipoSeleccionado || !jugadorSeleccionado || !tipoTarjeta}>
            Agregar Tarjeta
          </button>

          <ul>
            {tarjetas.map((tarjeta, index) => (
              <li key={index}>
                {tarjeta.equipoNombre} - {tarjeta.jugadorNombre} - {tarjeta.tipoTarjeta}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )}
</div>

  );
};

export default SubmitResultados;
