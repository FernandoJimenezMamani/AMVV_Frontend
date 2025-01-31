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
  const [activeRole, setActiveRole] = useState(null); // Nuevo estado para el rol activo

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token') || Cookies.get('token');
    const storedUser = sessionStorage.getItem('user');
    const storedRole = sessionStorage.getItem('activeRole');

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
          setActiveRole(storedRole ? JSON.parse(storedRole) : decoded.rol); // Recuperar rol activo o usar el predeterminado
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

      // Guardar el rol activo inicial
      const defaultRole = decoded.rol;
      setActiveRole(defaultRole);
      sessionStorage.setItem('activeRole', JSON.stringify(defaultRole));

      Cookies.set('token', token, { expires: 1 });
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setTokenData(null);
    setActiveRole(null); // Limpiar rol activo
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('activeRole'); // Limpiar rol del almacenamiento
    Cookies.remove('token'); // Remover la cookie también
  };

  const updateRole = (newRole) => {
    setActiveRole(newRole);
    sessionStorage.setItem('activeRole', JSON.stringify(newRole));
  };

  return (
    <SessionContext.Provider
      value={{ user, token, tokenData, activeRole, login, logout, updateRole }}
    >
      {children}
    </SessionContext.Provider>
  );
};
