import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null); // 'tutor' o 'alumno'

  const login = (type) => {
    setIsAuthenticated(true);
    setUserType(type);
    // Aquí podrías almacenar el token, por ejemplo:
    // const token = localStorage.getItem('token');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
    localStorage.removeItem('token'); // Limpiar token
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);