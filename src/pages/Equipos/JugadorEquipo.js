import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../assets/css/Registro.css';
import { toast } from 'react-toastify';

const RegistrarJugadorEquipo = () => {
  const { id } = useParams(); // Captura el ID del equipo desde la URL
  const [equipo, setEquipo] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [genero, setGenero] = useState(''); // Para manejar el filtro de género en el equipo

  useEffect(() => {
    // Obtener detalles del equipo y su categoría
    const fetchEquipo = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/equipo/get_equipo/${id}`);
        if (response.data) {
          setEquipo(response.data);
          setGenero(response.data.categoria.genero); // Obtiene el género de la categoría
        }
      } catch (error) {
        toast.error('Error al obtener detalles del equipo');
        console.error('Error al obtener detalles del equipo:', error);
      }
    };
    fetchEquipo();
  }, [id]);

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  
    if (term.length >= 3) {
      try {
        const endpoint = `http://localhost:5002/api/jugador/search_jugadores_club/${equipo.club_id}?searchTerm=${term}&genero=${genero}`;
        const response = await axios.get(endpoint);
        setPersonas(response.data);
      } catch (error) {
        toast.error('Error al buscar personas sin rol de jugador');
        console.error('Error al buscar personas sin rol de jugador:', error);
      }
    } else {
      setPersonas([]); // Limpia la lista si el término es menor a 3 letras
    }
  };

  const handleSelectPersona = (persona) => {
    setSelectedPersona(persona);
  };

  const handleSubmit = async () => {
    if (selectedPersona) {
      try {
        await axios.post('http://localhost:5002/api/jugador/asignar_jugador_equipo', {
          equipo_id: id,
          persona_id: selectedPersona.jugador_id, // Asegúrate de usar la clave correcta
        });
        toast.success('Jugador asignado con éxito al equipo');
      } catch (error) {
        console.error('Error al asignar jugador:', error);
        toast.error('Error al asignar jugador al equipo. Verifica los requisitos de edad.');
      }
    } else {
      toast.warn('Por favor selecciona una persona');
    }
  };

  return (
    <div className="registro-campeonato">
      {equipo ? (
        <div className="form-group">
          <div className="header-container">
            <img
              src={equipo.equipo_imagen}
              alt={`${equipo.nombre} logo`}
              className="club-logo"
            />
            <h2>Registrar Jugador para {equipo.nombre}</h2>
          </div>
         
          <div className="content-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar persona"
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm.length >= 3 && (
                <div className="form-group">
                  <ul>
                    {personas.length > 0 ? (
                      personas.map((persona) => (
                        <li key={persona.jugador_id} onClick={() => handleSelectPersona(persona)}>
                          {persona.nombre_persona} {persona.apellido_persona}
                        </li>
                      ))
                    ) : (
                      <li>No se encontraron personas</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Mostrar detalles de la persona seleccionada */}
            {selectedPersona && (
              <div className="persona-seleccionada">
                <div className="form-group">
                  <img
                    src={selectedPersona.imagen_persona}
                    alt={`${selectedPersona.nombre_persona} imagen`}
                    className="image-preview"
                  />
                </div>
                <h3>Detalles</h3>
                <p><strong>Nombre:</strong> {selectedPersona.nombre_persona} {selectedPersona.apellido_persona}</p>
                <p><strong>CI:</strong> {selectedPersona.ci_persona}</p>
              </div>
            )}
          </div>

          <div className="form-group">
            <button id="RegCampBtn" onClick={handleSubmit}>Asignar Jugador</button>
          </div>
        </div>
      ) : (
        <p>Cargando información del equipo...</p>
      )}
    </div>
  );
};

export default RegistrarJugadorEquipo;
