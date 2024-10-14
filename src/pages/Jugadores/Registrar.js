import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../assets/css/Registro.css';
import { toast } from 'react-toastify';

const RegistrarJugador = () => {
  const { id } = useParams(); // Captura el ID del club desde la URL
  const [club, setClub] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPersona, setSelectedPersona] = useState(null);
 
  useEffect(() => {
    // Obtener detalles del club
    const fetchClub = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/club/get_club/${id}`);
        setClub(response.data);
      } catch (error) {
        console.error('Error al obtener detalles del club:', error);
      }
    };
 
    fetchClub();
  }, [id]);
 
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
  
    if (term.length >= 3) { // Iniciar búsqueda solo si hay al menos 3 letras
      try {
        const endpoint = `http://localhost:5002/api/persona/search_personas_sin_jugador?searchTerm=${term}`;
  
        const response = await axios.get(endpoint);
        setPersonas(response.data);
      } catch (error) {
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
        await axios.post('http://localhost:5002/api/jugador/post_jugador', {
          club_id: id,
          persona_id: selectedPersona.id,
        });
        toast.success('Registrado con éxito');
      } catch (error) {
        console.error('Error al registrar jugador:', error);
        alert('Hubo un error al registrar el jugador');
      }
    } else {
      alert('Por favor selecciona una persona');
    }
  };
 
  return (
    <div className="registro-campeonato">
      {club ? (
        <div className="form-group">
          <div className="header-container">
            <img
              src={club.club_imagen}
              alt={`${club.nombre} logo`}
              className="club-logo"
            />
            <h2>Registrar Jugador para {club.nombre}</h2>
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
                  {personas.map((persona) => (
                    <li key={persona.id} onClick={() => handleSelectPersona(persona)}>
                      {persona.nombre} {persona.apellido}
                    </li>
                  ))}
                </ul>
                </div>
              )}
            </div>
 
            {/* Mostrar detalles de la persona seleccionada */}
            {selectedPersona && (
              <div className="persona-seleccionada">
                <div className="form-group">
                  <img
                    src={selectedPersona.persona_imagen}
                    alt={`${selectedPersona.nombre} imagen`}
                    className="image-preview"
                  />
                </div>
                <h3>Detalles</h3>
                <p><strong>Nombre:</strong> {selectedPersona.nombre} {selectedPersona.apellido}</p>
                <p><strong>CI:</strong> {selectedPersona.ci}</p>
                <p><strong>Correo:</strong> {selectedPersona.correo}</p>
              </div>
            )}
          </div>
 
          <div className="form-group">
            <button id="RegCampBtn" onClick={handleSubmit}>Asignar Jugador</button>
          </div>
        </div>
      ) : (
        <p>Cargando información del club...</p>
      )}
    </div>
  );
};
 
export default RegistrarJugador;
