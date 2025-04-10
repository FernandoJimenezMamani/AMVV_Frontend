import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../../assets/css/RegistroResultados.css";
import { toast } from "react-toastify";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ClearIcon from "@mui/icons-material/Clear";
import estadosPartidoCampMapping from "../../constants/estadoPartido";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SubmitResultados = () => {
  const { partidoId } = useParams();
  const [walkover, setWalkover] = useState("null");
  const [localSets, setLocalSets] = useState({ set1: "", set2: "", set3: "" });
  const [visitanteSets, setVisitanteSets] = useState({
    set1: "",
    set2: "",
    set3: "",
  });
  const [equipoLocal, setEquipoLocal] = useState(null);
  const [equipoVisitante, setEquipoVisitante] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [jugadores, setJugadores] = useState([]);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [tipoTarjeta, setTipoTarjeta] = useState("");
  const [tarjetas, setTarjetas] = useState([]);
  const [imagenPlanilla, setImagenPlanilla] = useState(null);
  const [resultadoLocal, setResultadoLocal] = useState("P");
  const [resultadoVisitante, setResultadoVisitante] = useState("P");
  const navigate = useNavigate();
  const location = useLocation();
  const { campeonatoId, categoriaId } = location.state || {};
  const [showImageModal, setShowImageModal] = useState(false);
  const [imagenPlanillaURL, setImagenPlanillaURL] = useState(null);
  const [partido , setPartido] = useState(null);

  useEffect(() => {
    const fetchEquiposYJugadores = async () => {
      try {
        const equiposResponse = await fetch(
          `${API_BASE_URL}/equipo/get_equipoByPartido/${partidoId}`,
        );
        const equipos = await equiposResponse.json();

        if (equipos.length === 2) {
          setEquipoLocal(equipos[0]);
          setEquipoVisitante(equipos[1]);
          const equipoIdSeleccionado =
            equipoSeleccionado || equipos[0].equipo_id;
          setEquipoSeleccionado(equipoIdSeleccionado);

          const jugadoresResponse = await fetch(
            `${API_BASE_URL}/partidos/get_jugadores/${equipoIdSeleccionado}/campeonato/${campeonatoId}`,
          );
          const jugadoresData = await jugadoresResponse.json();
          setJugadores(jugadoresData);
        }
      } catch (error) {
        console.error("Error al obtener los equipos y jugadores:", error);
      }
    };

    fetchEquiposYJugadores();
  }, [partidoId, equipoSeleccionado]);

  useEffect(() => {
    const fetchPartido = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/partidos/get_partido_completo/${partidoId}`);
        const data = await res.json();
        setPartido(data);
      } catch (err) {
        console.error("Error al obtener el partido:", err);
      }
    };
  
    if (partidoId) fetchPartido();
  }, [partidoId]);
  
  useEffect(() => {
    const fetchResultadosPrevios = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/partidos/resultados/${partidoId}`,
        );
        const data = await response.json();
      console.log("Resultados previos:", data);
        // ✅ Walkover (si existe)
        if (data.resultadoLocal?.walkover) {
          setWalkover(data.resultadoLocal.walkover);
        } else if (data.resultadoVisitante?.walkover) {
          setWalkover(data.resultadoVisitante.walkover);
        }

        // ✅ Sets Local
        if (data.resultadoLocal) {
          setLocalSets({
            set1: data.resultadoLocal.set1 ?? "",
            set2: data.resultadoLocal.set2 ?? "",
            set3: data.resultadoLocal.set3 ?? "",
          });
          setResultadoLocal(data.resultadoLocal.resultado ?? "P");
        }

        // ✅ Sets Visitante
        if (data.resultadoVisitante) {
          setVisitanteSets({
            set1: data.resultadoVisitante.set1 ?? "",
            set2: data.resultadoVisitante.set2 ?? "",
            set3: data.resultadoVisitante.set3 ?? "",
          });
          setResultadoVisitante(data.resultadoVisitante.resultado ?? "P");
        }

        // ✅ Tarjetas
        if (Array.isArray(data.tarjetas)) {
          const tarjetasFormateadas = data.tarjetas.map((t) => ({
            equipoNombre: t.equipo,
            jugadorNombre: t.jugador,
            jugadorId: t.jugador_tarjeta_id,
            tipoTarjeta: t.tipo_tarjeta,
            equipoId: t.equipoId, // opcional, si querés después hacer edición
          }));
          setTarjetas(tarjetasFormateadas);
        }

        if (data.imagenPlanilla) {
          setImagenPlanillaURL(data.imagenPlanilla);
        }              

        // ✅ Mostrar tercer set si hay valores o si ganó 1 y 1
      } catch (error) {
        console.error("Error al cargar resultados anteriores:", error);
      }
    };

    fetchResultadosPrevios();
  }, [partidoId]);

  useEffect(() => {
    if (walkover === "L") {
      setResultadoLocal("P");
      setResultadoVisitante("G");
    } else if (walkover === "V") {
      setResultadoLocal("G");
      setResultadoVisitante("P");
    } else if (walkover === "both") {
      setResultadoLocal("P");
      setResultadoVisitante("P");
    }
  }, [walkover]);

  const handleWalkoverChange = (e) => {
    const value = e.target.value;
    setWalkover(value);

    if (value === "L") {
      setLocalSets({ set1: 0, set2: 0, set3: 0 });
      setVisitanteSets({ set1: 25, set2: 25, set3: 0 });
      setResultadoLocal("P");
      setResultadoVisitante("G");
    } else if (value === "V") {
      setLocalSets({ set1: 25, set2: 25, set3: 0 });
      setVisitanteSets({ set1: 0, set2: 0, set3: 0 });
      setResultadoLocal("G");
      setResultadoVisitante("P");
    } else if (value === "both") {
      setLocalSets({ set1: 0, set2: 0, set3: 0 });
      setVisitanteSets({ set1: 0, set2: 0, set3: 0 });
      setResultadoLocal("P");
      setResultadoVisitante("P");
    } else {
      setLocalSets({ set1: "", set2: "", set3: "" });
      setVisitanteSets({ set1: "", set2: "", set3: "" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenPlanilla(file);
      setImagenPlanillaURL(URL.createObjectURL(file));
      setShowImageModal(false); // No abrir el modal automáticamente, solo mostrar el icono
    }
  };

  const handleInputChange = (e, team, setFunction) => {
    const { name, value } = e.target;

    if (value === "") {
      setFunction({ ...team, [name]: "" });
      return;
    }
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue)) return;
    setFunction({ ...team, [name]: parsedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imagenPlanilla && !imagenPlanillaURL) {
      toast.error("Debes subir una imagen de la planilla antes de enviar.");
      return;
    }    

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
    formData.append("partido_id", partidoId);
    formData.append("walkover", walkover === "null" ? "" : walkover);
    formData.append("resultadoLocal", JSON.stringify(cleanedLocalSets));
    formData.append("resultadoVisitante", JSON.stringify(cleanedVisitanteSets));
    formData.append("tarjetas", JSON.stringify(tarjetas));

    if (imagenPlanilla) {
      formData.append("imagenPlanilla", imagenPlanilla);
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/partidos/submitResultados`,
        {
          method: "POST",
          body: formData,
        },
      );
      
      const result = await response.json();
      if (response.ok) {
        toast.success("Registrado con éxito");
        navigate(`/partidos/indice/${campeonatoId}/${categoriaId}`);
      } else {
        toast.error("Error durante el registro");
        console.error("Error:", result.message);
      }
    } catch (error) {
      toast.error("Error durante el registro");
      console.error("Error al enviar los resultados:", error);
    }
  };

  const validateAllSets = () => {
    return (
      validateSetResult("set1") &&
      validateSetResult("set2") &&
      validateSetResult("set3")
    );
  };

  const validateSetResult = (setName) => {
    const localScore = localSets[setName];
    const visitanteScore = visitanteSets[setName];

    if (localScore === "" || visitanteScore === "") return true; // Evita validación con valores vacíos

    const isThirdSet = setName === "set3";
    const winningScore = isThirdSet ? 15 : 25;

    if (localScore >= winningScore || visitanteScore >= winningScore) {
      const difference = Math.abs(localScore - visitanteScore);
      if (difference < 2) {
        toast.warn(
          `La diferencia de puntos debe ser de al menos 2 cuando uno de los equipos tiene ${winningScore} puntos o más en el ${isThirdSet ? "tercer" : "set"}. (Actual: ${localScore} - ${visitanteScore})`,
        );
        return false;
      }
    } else {
      if (Math.min(localScore, visitanteScore) < (isThirdSet ? 14 : 24)) {
        toast.warn(
          `Uno de los equipos debe tener al menos ${winningScore} puntos para ganar el ${isThirdSet ? "tercer set" : "set"}.`,
        );
        return false;
      }
    }

    return true;
  };

  const validateSetResultOnBlur = () => {
    if (!localSets.set1 || !visitanteSets.set1) return;
    if (!localSets.set2 || !visitanteSets.set2) return;
    if (!localSets.set3 || !visitanteSets.set3) return;

    const localScores = [localSets.set1, localSets.set2, localSets.set3].map(
      Number,
    );
    const visitanteScores = [
      visitanteSets.set1,
      visitanteSets.set2,
      visitanteSets.set3,
    ].map(Number);

    let localWins = 0;
    let visitanteWins = 0;

    for (let i = 0; i < 3; i++) {
      if (localScores[i] > visitanteScores[i]) {
        localWins++;
      } else if (visitanteScores[i] > localScores[i]) {
        visitanteWins++;
      }
    }

    if (localWins > visitanteWins) {
      setResultadoLocal("G");
      setResultadoVisitante("P");
    } else if (visitanteWins > localWins) {
      setResultadoLocal("P");
      setResultadoVisitante("G");
    }
  };

  const handleAgregarTarjeta = () => {
    const jugador = jugadores.find(
      (j) => j.jugador_id === parseInt(jugadorSeleccionado),
    );
    const equipo = [equipoLocal, equipoVisitante].find(
      (e) => e.equipo_id === parseInt(equipoSeleccionado),
    );

    const nuevaTarjeta = {
      equipoId: equipoSeleccionado,
      equipoNombre: equipo.equipo_nombre,
      jugadorId: jugadorSeleccionado,
      jugadorNombre: `${jugador.jugador_nombre} ${jugador.jugador_apellido}`,
      tipoTarjeta,
    };

    setTarjetas([...tarjetas, nuevaTarjeta]);
    setEquipoSeleccionado(null);
    setJugadorSeleccionado(null);
    setTipoTarjeta("");
  };

  if (!equipoLocal || !equipoVisitante) {
    return <div className="container">Cargando equipos...</div>;
  }

  const handleActualizarParciales = async () => {
    validateSetResultOnBlur();
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

    try {
      const response = await fetch(
        `${API_BASE_URL}/partidos/updateParcialResultados`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            partido_id: partidoId,
            walkover: walkover === "null" ? "" : walkover,
            resultadoLocal: cleanedLocalSets,
            resultadoVisitante: cleanedVisitanteSets,
            tarjetas,
          }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Actualización parcial registrada");
      } else {
        toast.error(result.message || "Error al actualizar");
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor");
      console.error(error);
    }
  };

  return (
    <div className="resultados-container">
      <h1 className="resultados-titulo">Registrar Resultados del Partido</h1>
      <form onSubmit={handleSubmit}>
        <div className="resultados-form-group">
          <label>Walkover</label>
          <div className="resultados-radio-group">
            <div className="resultados-radio-option">
              <input
                type="radio"
                name="walkover"
                value="L"
                checked={walkover === "L"}
                onChange={handleWalkoverChange}
                id="walkoverL"
              />
              <label htmlFor="walkoverL">Local</label>
            </div>
            <div className="resultados-radio-option">
              <input
                type="radio"
                name="walkover"
                value="V"
                checked={walkover === "V"}
                onChange={handleWalkoverChange}
                id="walkoverV"
              />
              <label htmlFor="walkoverV">Visitante</label>
            </div>
            <div className="resultados-radio-option">
              <input
                type="radio"
                name="walkover"
                value="both"
                checked={walkover === "both"}
                onChange={handleWalkoverChange}
                id="walkoverBoth"
              />
              <label htmlFor="walkoverBoth">Ambos</label>
            </div>
            <div className="resultados-radio-option">
              <input
                type="radio"
                name="walkover"
                value="null"
                checked={walkover === "null"}
                onChange={handleWalkoverChange}
                id="walkoverNull"
              />
              <label htmlFor="walkoverNull">Ninguno</label>
            </div>
          </div>
        </div>

        <div className="resultados-equipos">
          <div className="resultados-equipo">
            <div className="resultados-equipo-header">
              <img
                src={equipoLocal.club_imagen}
                alt="Escudo Local"
                className="resultados-equipo-logo"
              />
              <h2>{equipoLocal.equipo_nombre}</h2>
            </div>
            <div className="resultados-sets-group">
              <input
                name="set1"
                placeholder="Set 1 Local"
                value={localSets.set1}
                onChange={(e) => handleInputChange(e, localSets, setLocalSets)}
                onBlur={validateSetResultOnBlur}
                disabled={walkover !== "null"}
                required
                className="resultado-input-field"
              />
              <input
                name="set2"
                placeholder="Set 2 Local"
                value={localSets.set2}
                onChange={(e) => handleInputChange(e, localSets, setLocalSets)}
                onBlur={validateSetResultOnBlur}
                disabled={walkover !== "null"}
                required
                className="resultado-input-field"
              />
              {walkover !== "L" && walkover !== "V" && (
                <input
                  name="set3"
                  placeholder="Set 3 Local"
                  value={localSets.set3}
                  onChange={(e) =>
                    handleInputChange(e, localSets, setLocalSets)
                  }
                  onBlur={validateSetResultOnBlur}
                  disabled={walkover === "both" ? false : walkover !== "null"}
                  required
                  className="resultado-input-field"
                />
              )}
            </div>
          </div>

          <div className="resultados-equipo">
            <div className="resultados-equipo-header">
              <img
                src={equipoVisitante.club_imagen}
                alt="Escudo Visitante"
                className="resultados-equipo-logo"
              />
              <h2>{equipoVisitante.equipo_nombre}</h2>
            </div>
            <div className="resultados-sets-group">
              <input
                name="set1"
                placeholder="Set 1 Visitante"
                value={visitanteSets.set1}
                onChange={(e) =>
                  handleInputChange(e, visitanteSets, setVisitanteSets)
                }
                onBlur={validateSetResultOnBlur}
                disabled={walkover !== "null"}
                required
                className="resultado-input-field"
              />
              <input
                name="set2"
                placeholder="Set 2 Visitante"
                value={visitanteSets.set2}
                onChange={(e) =>
                  handleInputChange(e, visitanteSets, setVisitanteSets)
                }
                onBlur={validateSetResultOnBlur}
                disabled={walkover !== "null"}
                required
                className="resultado-input-field"
              />
              {walkover !== "L" && walkover !== "V" && (
                <input
                  name="set3"
                  placeholder="Set 3 Visitante"
                  value={visitanteSets.set3}
                  onChange={(e) =>
                    handleInputChange(e, visitanteSets, setVisitanteSets)
                  }
                  onBlur={validateSetResultOnBlur}
                  disabled={walkover === "both" ? false : walkover !== "null"}
                  required
                  className="resultado-input-field"
                />
              )}
            </div>
          </div>
        </div>

        <div className="acciones-container">
          {/* Botón para registrar tarjetas */}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="resultados-modal-btn"
          >
            Registrar Tarjetas
          </button>

          {/* Botón estilizado para subir imagen */}
          <label htmlFor="imagenPlanilla" className="upload-button">
            Subir Imagen de la Planilla
            <input
              type="file"
              id="imagenPlanilla"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>

          {/* Ícono para indicar que hay una imagen seleccionada */}
          {(imagenPlanilla || imagenPlanillaURL)  && (
            <span
              className="file-icon"
              onClick={() => setShowImageModal(true)}
              title="Ver Imagen"
            >
              <AttachFileIcon />
            </span>
          )}
        </div>

        {/* Modal para previsualizar la imagen */}
        {showImageModal && imagenPlanillaURL  && (
          <div
            className="image-modal-overlay"
            onClick={() => setShowImageModal(false)}
          >
            <div
              className="image-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-modal-btn"
                onClick={() => setShowImageModal(false)}
              >
                ✖
              </button>
              <h3>Previsualización de la Imagen</h3>
              <img
                src={imagenPlanillaURL}
                alt="Imagen Cargada"
                className="preview-image"
              />
            </div>
          </div>
        )}

        {tarjetas.length > 0 && (
          <div className="resultados-tarjetas">
            <h3>Tarjetas Registradas</h3>
            <ul>
              {tarjetas.map((tarjeta, index) => {
                return (
                  <li key={index} className="tarjeta-item">
                    <span className="tarjeta-equipo">
                      {tarjeta.equipoNombre}
                    </span>{" "}
                    -
                    <span className="tarjeta-jugador">
                      {tarjeta.jugadorNombre}
                    </span>
                    <span
                      className={`tarjeta-tipo ${tarjeta.tipoTarjeta}`}
                    ></span>
                    <button
                       type="button"
                      className="delete-tarjeta-btn"
                      title="Eliminar tarjeta"
                      onClick={() => {
                        setTarjetas(tarjetas.filter((_, i) => i !== index));
                      }}
                    >
                      <ClearIcon />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="resultados-acciones">
          {partido && partido.estado !== estadosPartidoCampMapping.Finalizado && (
            <button
            type="button"
            className="resultados-actualizar-btn "
            onClick={handleActualizarParciales}
          >
            Actualizar Resultados
          </button>
          )}

          <button type="submit" className="resultados-submit-btn">
            {partido && partido.estado === estadosPartidoCampMapping.Finalizado ? (
              <span>Actualizar</span>
            ):(
              <span>Finalizar Partido</span>)}  
          </button>
        </div>
      </form>

      {showModal && (
        <>
          <div
            className="resultados-modal-fondo"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="resultados-modal">
            <div className="resultados-modal-contenido">
              {/* Botón de cerrar */}
              <button
                onClick={() => setShowModal(false)}
                className="resultados-close-btn"
              >
                ✖
              </button>

              <h2 className="modal-title">Registrar Tarjeta</h2>

              {/* Selección de equipo */}
              <div className="modal-field">
                <label>Equipo</label>
                <select
                  onChange={(e) => setEquipoSeleccionado(e.target.value)}
                  value={equipoSeleccionado}
                  className="modal-select"
                >
                  <option value="">Seleccione un equipo</option>
                  {equipoLocal && (
                    <option value={equipoLocal.equipo_id}>
                      {equipoLocal.equipo_nombre}
                    </option>
                  )}
                  {equipoVisitante && (
                    <option value={equipoVisitante.equipo_id}>
                      {equipoVisitante.equipo_nombre}
                    </option>
                  )}
                </select>
              </div>

              {/* Selección de jugador */}
              {equipoSeleccionado && (
                <div className="modal-field">
                  <label>Jugador</label>
                  <select
                    onChange={(e) => setJugadorSeleccionado(e.target.value)}
                    value={jugadorSeleccionado}
                    className="modal-select"
                  >
                    <option value="">Seleccione un jugador</option>
                    {jugadores.map((jugador) => (
                      <option
                        key={jugador.jugador_id}
                        value={jugador.jugador_id}
                      >
                        {jugador.jugador_nombre} {jugador.jugador_apellido}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Selección de tipo de tarjeta */}
              {jugadorSeleccionado && (
                <div className="modal-field">
                  <label>Tipo de Tarjeta</label>
                  <select
                    onChange={(e) => setTipoTarjeta(e.target.value)}
                    value={tipoTarjeta}
                    className="modal-select"
                  >
                    <option value="">Seleccione el tipo de tarjeta</option>
                    <option value="roja">Roja</option>
                    <option value="amarilla">Amarilla</option>
                  </select>
                </div>
              )}

              {/* Botón para agregar tarjeta */}
              <button
                onClick={handleAgregarTarjeta}
                disabled={
                  !equipoSeleccionado || !jugadorSeleccionado || !tipoTarjeta
                }
                className="modal-add-btn"
              >
                Agregar Tarjeta
              </button>

              {tarjetas.length > 0 && (
                <div className="modal-tarjetas-list">
                  <h3>Tarjetas Registradas</h3>
                  <ul>
                    {tarjetas.map((tarjeta, index) => (
                      <li key={index}>
                        <span className="tarjeta-equipo">
                          {tarjeta.equipoNombre}
                        </span>{" "}
                        -
                        <span className="tarjeta-jugador">
                          {tarjeta.jugadorNombre}
                        </span>{" "}
                        -
                        <span
                          className={`tarjeta-tipo ${tarjeta.tipoTarjeta}`}
                        ></span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SubmitResultados;
