import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, userType } = useContext(AuthContext); // Añadimos userType
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewProfile = () => {
    navigate('/profile'); // Redirige a /profile
  };

  // Definir navItems según el userType
  const navItems = userType === 'tutor'
    ? [
        { path: '/tutor-dashboard', icon: 'bx-home', label: 'Panel', tooltip: 'Panel' },
        { path: '/tutor-materias', icon: 'bx-calendar', label: 'Sesiones', tooltip: 'Materias' },
        { path: '/messages', icon: 'bx-message-square-dots', label: 'Mensajes', tooltip: 'Mensajes' },
        { path: '/tutor-profile', icon: 'bx-user', label: 'Perfil', tooltip: 'Perfil' },
      ]
    : [
        { path: '/', icon: 'bx-search-alt', label: 'Inicio', tooltip: 'Inicio' },
        { path: '/messages', icon: 'bx-message-square-dots', label: 'Mensajes', tooltip: 'Mensajes' },
        { path: '/tutoIA', icon: 'bx-briefcase', label: 'TutoIA', tooltip: 'TutoIA' },
        { path: '/materias', icon: 'bx-cog', label: 'Materias', tooltip: 'Materias' },
      ];

  return (
    <div className={`${styles.sidebarBody} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          {isOpen && (
            <Link to={userType === 'tutor' ? '/tutor-dashboard' : '/'} className={styles.sidebarTitle}>
              <img src="/images/lince-icon.png" className={styles.logoIcon} />
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
            <img src="/images/Profile.png" alt="Perfil" className={styles.profileImg} />
            {isOpen && (
              <>
                <Link to={userType === 'tutor' ? '/tutor-profile' : '/profile'} className={styles.profileName}>Lince</Link>
                <p className={styles.profileText}>Ingeniería en Sistemas</p>
              </>
            )}
          </div>
          {isOpen && (
            <div className={styles.profileActions}>
              <button className={styles.profileButton} onClick={handleViewProfile}>
                Ver Perfil
              </button>
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