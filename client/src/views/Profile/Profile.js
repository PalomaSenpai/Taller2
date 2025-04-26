import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './Profile.module.css';

const Profile = () => {
  const { userType } = useContext(AuthContext);

  // Datos estáticos del usuario (puedes reemplazarlos con datos reales más adelante)
  const user = {
    name: 'Lince',
    career: 'Ingeniería en Sistemas Computacionales',
    email: userType === 'alumno' ? '20030495@itcelaya.edu.mx' : 'tutor@itcelaya.edu.mx',
    profileImage: '/images/Profile.png', // Asegúrate de que esta imagen exista en public/images/
    role: userType === 'alumno' ? 'Alumno' : 'Tutor',
    bio: 'Estudiante apasionado por la tecnología y la programación, buscando siempre aprender y mejorar.',
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        {/* Foto de Perfil Centrada Arriba */}
        <div className={styles.profileImageWrapper}>
          <img src={user.profileImage} alt="Foto de perfil" className={styles.profileImage} />
        </div>

        {/* Información del Perfil Debajo */}
        <div className={styles.profileInfo}>
          <h1 className={styles.profileName}>{user.name}</h1>
          <span className={styles.profileRole}>{user.role}</span>
          <p className={styles.profileBio}>{user.bio}</p>

          <div className={styles.profileDetails}>
            <h3 className={styles.sectionTitle}>Información del Perfil</h3>
            <ul className={styles.detailsList}>
              <li className={styles.detailItem}>
                <span className={styles.detailLabel}>Correo:</span>
                <span className={styles.detailValue}>{user.email}</span>
              </li>
              <li className={styles.detailItem}>
                <span className={styles.detailLabel}>Carrera:</span>
                <span className={styles.detailValue}>{user.career}</span>
              </li>
              <li className={styles.detailItem}>
                <span className={styles.detailLabel}>Rol:</span>
                <span className={styles.detailValue}>{user.role}</span>
              </li>
            </ul>
          </div>

          <div className={styles.profileActions}>
            <button className={styles.actionButton}>Editar Perfil</button>
            <button className={styles.secondaryButton}>Cambiar Contraseña</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;