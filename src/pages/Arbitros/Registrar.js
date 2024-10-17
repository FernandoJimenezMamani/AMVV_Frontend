import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../assets/css/Registro.css';
import { toast } from 'react-toastify';

const RegistrarArbitro = () => {
  const { id } = useParams(); // Este ID sería el ID del torneo o algún identificador si se requiere
  const [personas, setPersonas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPersona, setSelectedPersona] = useState(null);

  useEffect(() => {
    // Aquí puedes agregar lógica para obtener información relacionada con los arbitros si fuera necesario
  }, [id]);

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length >= 3) {
      try {
        const response = await axios.get(`http://localhost:5002/api/persona/search_persona?searchTerm=${term}`);
        setPersonas(response.data);
      } catch (error) {
        console.error('Error al buscar personas:', error);
      }
    } else {
      setPersonas([]);
    }
  };

  const handleSelectPersona = (persona) => {
    setSelectedPersona(persona);
  };

  const handleSubmit = async () => {
    if (selectedPersona) {
      try {
        await axios.post('http://localhost:5002/api/arbitro/post_arbitro', {
          persona_id: selectedPersona.id,
          activo: 'S', // Se puede cambiar este valor dependiendo si el árbitro empieza activo o no
        });
        toast.success('Arbitro registrado con éxito');
      } catch (error) {
        console.error('Error al registrar árbitro:', error);
        alert('Hubo un error al registrar el árbitro');
      }
    } else {
      alert('Por favor selecciona una persona');
    }
  };

  return (
    <div className="registro-campeonato">
      <div className="form-group">
        <div className="header-container">
          <h2>Registrar Árbitro</h2>
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
          <button id="RegCampBtn" onClick={handleSubmit}>Asignar Árbitro</button>
        </div>
      </div>
    </div>
  );
};

export default RegistrarArbitro;
