import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  
import Cookies from 'js-cookie';

const SessionContext = createContext();

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [tokenData, setTokenData] = useState(null); 

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token') || Cookies.get('token');
    const storedUser = sessionStorage.getItem('user');

    console.log('Usuario almacenado:', storedUser);  
    console.log('Token almacenado:', storedToken);

    if (storedToken && storedUser) {
      try {
        const decoded = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          logout(); // Token expirado, forzar el logout
        } else {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setTokenData(decoded);
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        logout(); // Limpiar en caso de error
      }
    }
  }, []);

  const login = (userData) => {
    const { token } = userData;
    if (!token) {
      console.error('Token no proporcionado en login');
      return;
    }
  
    try {
      const decoded = jwtDecode(token);
      console.log('Datos decodificados del token en login:', decoded);
  
      setToken(token);
      sessionStorage.setItem('token', token);
  
      setUser(decoded);
      sessionStorage.setItem('user', JSON.stringify(decoded));
  
      // Guardar clubJugador_id y clubPresidente_id si están disponibles
      if (decoded.clubJugador) {
        sessionStorage.setItem('clubJugador_id', decoded.clubJugador.id);
        console.log("clubJugador_id almacenado:", decoded.clubJugador.id);
      }
      if (decoded.clubPresidente) {
        sessionStorage.setItem('clubPresidente_id', decoded.clubPresidente.id);
        console.log("clubPresidente_id almacenado:", decoded.clubPresidente.id);
      }
      
  
      Cookies.set('token', token, { expires: 1 });
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  };  

  const logout = () => {
    setUser(null);
    setToken(null);
    setTokenData(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    Cookies.remove('token'); // Remover la cookie también
  };
  

  return (
    <SessionContext.Provider value={{ user, token, tokenData, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};
