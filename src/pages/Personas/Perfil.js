import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 
import '../../assets/css/Persona/Perfil.css';
import { useSession } from '../../context/SessionContext';
import { toast } from 'react-toastify';
import defaultUserMenIcon from '../../assets/img/Default_Imagen_Men.webp';
import defaultUserWomenIcon from '../../assets/img/Default_Imagen_Women.webp';
import EditIcon from '@mui/icons-material/Edit';
import ChangePasswordModal from '../CambiarContrasenia';
import LogoutIcon from '@mui/icons-material/Logout';
import EditarPerfilPersona from './EditarPerfil';
import rolMapping from '../../constants/roles';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PerfilJugador = () => {
  const { id } = useParams();
  const [jugador, setJugador] = useState(null);
  const { user , logout  } = useSession(); 
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  useEffect(() => {
    const fetchJugador = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/persona/get_personaById/${id}`);
        setJugador(response.data);
      } catch (error) {
        toast.error('error')
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
    setIsEditModalOpen(true);
  };
  

  const getImagenPerfil = (persona) => {
    if (persona.persona_imagen) {
      return persona.persona_imagen; 
    }
    return persona.genero === 'V' ? defaultUserMenIcon : defaultUserWomenIcon; 
  };

  const ConvertGenero = () => {
    if (jugador.genero === 'V') {
      return 'Varón';
    } else {
      return 'Mujer';
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  const formatFechaLarga = (fechaString) => {
    if (!fechaString) return '';
    const [year, month, day] = fechaString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)); // mes empieza en 0
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const hasRole = (...roles) => {
    return user && user.rol && roles.includes(user.rol.nombre);
  }; 
  return (
    <div className="perfil-jugador">
      <ChangePasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <EditarPerfilPersona
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        personaId={jugador.id}
        onPersonaUpdated={() => {
          setIsEditModalOpen(false);
          window.location.reload(); // Refresca la página para mostrar los cambios actualizados
        }}
      />
      <div className="perfil-jugador-header">
        <h2>Mi Perfil</h2>
        {hasRole(rolMapping.PresidenteAsociacion) && (
        <button onClick={handleEditProfile} className="editar-perfil-boton">
          Editar perfil <EditIcon />
        </button>
        )}
          <button onClick={() => setIsModalOpen(true)} className="editar-perfil-boton">Cambiar Contraseña <EditIcon/></button>
          <button onClick={handleLogout} className="cerrar-sesion-boton">Cerrar Sesión <LogoutIcon/></button>
      </div>
      <div className="perfil-jugador-contenido">
        <div className="perfil-jugador-imagen">
          <img src={getImagenPerfil(jugador)} alt={jugador.nombre} />
        </div>
        <div className="perfil-jugador-detalles">
          <p><strong>Nombre Completo:</strong> {jugador.nombre} {jugador.apellido}</p>
          <p><strong>Carnet de Identidad:</strong> {jugador.ci}</p>
          <p><strong>Fecha de Nacimiento:</strong> {formatFechaLarga(jugador.fecha_nacimiento)}</p>
          <p><strong>Edad:</strong> {calcularEdad(jugador.fecha_nacimiento)} años</p>
          <p><strong>Genero:</strong> {ConvertGenero(jugador.genero) }</p>
          <p><strong>Dirección vivienda:</strong> {jugador.direccion}</p>
          <p><strong>Correo Electronico:</strong> {jugador.correo}</p>
        </div>
      </div>
    </div>
  );
};
 
export default PerfilJugador;
