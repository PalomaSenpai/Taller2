import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../css/Sidedar.module.css'; // Corrige el nombre del archivo (antes era Sidedar.module.css)

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    // Aquí puedes añadir la lógica para cerrar sesión, como limpiar el token o redirigir
    console.log('Sesión cerrada');
    // Ejemplo: window.location.href = '/login';
  };

  const navItems = [
    { path: '/#', icon: 'bx-search-alt', label: 'Inicio', tooltip: 'Inicio' },
    { path: '/messages', icon: 'bx-message-square-dots', label: 'Mensajes', tooltip: 'Mensajes' },
    { path: '/subjects', icon: 'bx-briefcase', label: 'Materias', tooltip: 'Materias' },
    { path: '/settings', icon: 'bx-cog', label: 'Ajustes', tooltip: 'Ajustes' },
  ];

  return (
    <div className={`${styles.sidebarBody} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          {isOpen && (
            <Link to="/" className={styles.sidebarTitle}>
              <img src="/images/lince-icon.png" alt="TutoLynx" className={styles.logoIcon} />
              TutoLynx
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className={styles.toggleButton}
            aria-label={isOpen ? 'Cerrar sidebar' : 'Abrir sidebar'}
          >
            <i className={`bx ${isOpen ? 'bx-chevron-left' : 'bx-chevron-right'}`}></i>
          </button>
        </div>

        <nav className={styles.sideNav}>
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`${styles.item} ${location.pathname === item.path ? styles.active : ''}`}
              data-tooltip={item.tooltip}
            >
              <i className={`bx ${item.icon}`}></i>
              {isOpen && (
                <Link to={item.path} className={styles.sidebarLink}>
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className={styles.sideProfile}>
          <div className={styles.info}>
            <img src="/images/profile.webp" alt="Perfil" className={styles.profileImg} />
            {isOpen && (
              <>
                <Link to="/profile" className={styles.profileName}>Lince</Link>
                <p className={styles.profileText}>Ingeniería en Sistemas</p>
              </>
            )}
          </div>
          {isOpen && (
            <div className={styles.profileActions}>
              <button className={styles.profileButton}>Ver Perfil</button>
              <button className={styles.logoutButton} onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;