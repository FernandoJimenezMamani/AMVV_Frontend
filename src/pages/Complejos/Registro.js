import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/css/Registro.css'; 
import MapView from '../../components/MapView';
import { toast } from 'react-toastify';

const LugarForm = () => {
    const [nombre, setNombre] = useState('');
    const [longitud, setLongitud] = useState('');
    const [latitud, setLatitud] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccess('');
  
      if (!nombre || !longitud || !latitud) {
        setError('Todos los campos deben ser proporcionados');
        return;
      }
  
      try {
        const response = await axios.post('http://localhost:5002/api/lugar/insert', {
          nombre,
          longitud: parseFloat(longitud),
          latitud: parseFloat(latitud),
        });
        toast.success('Registrado con éxito');
        setNombre('');
        setLongitud('');
        setLatitud('');
      } catch (err) {
        setError('Error al crear el Lugar');
        console.error(err.message);
      }
    };
  
    const handleLocationSelect = (lat, lng) => {
      setLatitud(lat);
      setLongitud(lng);
    };
  
    return (
      <div className="registro-campeonato">
        <h2>Registrar Lugar</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingrese el nombre del lugar"
              required
            />
          </div>
          <div className="form-group" hidden>
            <label>Latitud:</label>
            <input
              type="text"
              value={latitud}
              onChange={(e) => setLatitud(e.target.value)}
              placeholder="Latitud"
              required
              readOnly
            />
          </div>
          <div className="form-group" hidden>
            <label>Longitud:</label>
            <input
              type="text"
              value={longitud}
              onChange={(e) => setLongitud(e.target.value)}
              placeholder="Longitud"
              required
              readOnly
            />
          </div>
          <MapView onLocationSelect={handleLocationSelect} />
          <div className="form-group">
            <button id="RegCampBtn" type="submit">Registrar Lugar</button>
          </div>
          
        </form>
      </div>
    );
  };
  
  export default LugarForm;
