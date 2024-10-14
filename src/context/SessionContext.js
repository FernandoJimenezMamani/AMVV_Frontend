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
      setToken(storedToken);  
      setUser(JSON.parse(storedUser));  
      
      try {
        const decoded = jwtDecode(storedToken);  
        setTokenData(decoded);
        console.log('Datos decodificados del token:', decoded);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }, []);

  const login = (userData) => {
    const { token } = userData;
    const decoded = jwtDecode(token);
  
    console.log('Datos decodificados del token en login:', decoded);
    
    setToken(token);  // Guardar el token en el estado
    sessionStorage.setItem('token', token);  // Almacenar el token en sessionStorage
  
    // Almacenar los datos del usuario desde el token
    setUser(decoded);  // Aquí se guarda la información del usuario
    sessionStorage.setItem('user', JSON.stringify(decoded));
  
    // Guardar el token en una cookie
    Cookies.set('token', token, { expires: 1 });  // La cookie expirará en 1 día
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setTokenData(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  return (
    <SessionContext.Provider value={{ user, token, tokenData, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};
