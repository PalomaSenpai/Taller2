import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../css/Sidedar.module.css'; // Corrige el nombre del archivo (antes era Sidedar.module.css)

const Sidebar = () => {
  const location = useLocation(); // Para determinar la ruta activa

  return (
    <div className={styles.sidebarBody}>
      <div className={styles.sidebar}>
        <Link to="/" className={styles.sidebarLink}>Tutorías</Link>
        <div className={styles['side-nav']}>
          <div
            className={`${styles.item} ${location.pathname === '/' ? styles.active : ''}`}
          >
            <i className="bx bx-search-alt"></i>
            <Link to="/" className={styles.sidebarLink}>Inicio</Link>
          </div>
          <div
            className={`${styles.item} ${location.pathname === '/messages' ? styles.active : ''}`}
          >
            <i className="bx bx-message-square-dots"></i>
            <Link to="/messages" className={styles.sidebarLink}>Mensajes</Link>
          </div>
          <div
            className={`${styles.item} ${location.pathname === '/subjects' ? styles.active : ''}`}
          >
            <i className="bx bx-briefcase"></i>
            <Link to="/subjects" className={styles.sidebarLink}>Materias</Link>
          </div>
          <div
            className={`${styles.item} ${location.pathname === '/settings' ? styles.active : ''}`}
          >
            <i className="bx bx-cog"></i>
            <Link to="/settings" className={styles.sidebarLink}>Ajustes</Link>
          </div>
        </div>
        <div className={styles['side-profile']}>
          <div className={styles.info}>
            <img src="/images/profile.webp" alt="Profile" />
            <Link to="/profile" className={styles.sidebarLink}>Lince</Link>
            <p className={styles.sidebarText}>Ingeniería en Sistemas</p>
          </div>
          <button>View Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;