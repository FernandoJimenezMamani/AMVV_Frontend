import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Importar useNavigate
import '../../assets/css/Persona/Perfil.css';
import { useSession } from '../../context/SessionContext';
import { toast } from 'react-toastify';

const PerfilJugador = () => {
  const { id } = useParams();
  const [jugador, setJugador] = useState(null);
  const { user } = useSession(); // Obtener el usuario actual desde el contexto
  const navigate = useNavigate(); // Para redirigir al usuario
 
  useEffect(() => {
    const fetchJugador = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/persona/get_personaById/${id}`);
        setJugador(response.data);
      } catch (error) {
        console.error('Error al obtener los datos del jugador:', error);
      }
    };
 
    fetchJugador();
  }, [id]);
 
  if (!jugador) {
    return <div>Cargando...</div>;
  }
 
  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad;
  };
 
  const handleEditProfile = () => {
    navigate(`/personas/editar/${jugador.id}`); 
  };
 
  return (
    <div className="perfil-jugador">
      <div className="perfil-jugador-header">
        <h2>Perfil de jugador</h2>
        {user && jugador.id === user.id && (
          <button onClick={handleEditProfile} className="editar-perfil-boton">Editar perfil</button>
        )}
      </div>
      <div className="perfil-jugador-contenido">
        <div className="perfil-jugador-imagen">
          <img src={jugador.persona_imagen} alt={jugador.nombre} />
        </div>
        <div className="perfil-jugador-detalles">
          <p><strong>Nombre:</strong> {jugador.nombre} {jugador.apellido}</p>
          <p><strong>Equipo actual:</strong> {jugador.equipo_nombre || "F/A"}</p>
          <p><strong>Carnet de Identidad:</strong> {jugador.ci}</p>
          <p><strong>Edad:</strong> {calcularEdad(jugador.fecha_nacimiento)}</p>
          <p><strong>Dirección vivienda:</strong> {jugador.direccion}</p>
        </div>
      </div>
    </div>
  );
};
 
export default PerfilJugador;
