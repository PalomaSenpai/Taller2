import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../componentes/Sidebar.js';
//import Nav from './Nav'; // Suponiendo que también tienes un componente Nav

const Layout = () => {
  return (
    <div>
        <Outlet /> {/* Aquí se renderizan las pantallas específicas */}
    </div>
  );
};

export default Layout;