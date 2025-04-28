import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './Profile.module.css';

const Profile = () => {
  const { userType } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        console.log('Token encontrado:', token); // Depuración
        console.log('UserType:', userType); // Depuración
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        if (!userType) {
          throw new Error('Tipo de usuario no definido');
        }

        const endpoint = userType === 'alumno' 
          ? 'http://localhost:5000/api/alumno/dashboard' 
          : 'http://localhost:5000/api/tutor/dashboard';
        console.log('Endpoint usado:', endpoint); // Depuración

        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Código de estado:', response.status); // Depuración
        if (!response.ok) {
          const errorData = await response.json();
          console.log('Error del servidor:', errorData); // Depuración
          throw new Error(errorData.message || `Error al obtener los datos del usuario: ${response.status}`);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data); // Depuración
        setUser({
          ...data,
          bio: data.bio || 'Este usuario no ha proporcionado una biografía todavía.',
          role: userType === 'alumno' ? 'Alumno' : 'Tutor',
          career: data.career || 'N/A',
          img: data.img || '/images/default-profile.png',
        });
      } catch (err) {
        console.error('Error completo:', err); // Depuración
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userType]);

  if (loading) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          <p>Error: {error || 'No se pudo cargar el perfil'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileImageWrapper}>
          <img src={user.img} alt="Foto de perfil" className={styles.profileImage} />
        </div>
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
              {userType === 'alumno' && (
                <li className={styles.detailItem}>
                  <span className={styles.detailLabel}>Carrera:</span>
                  <span className={styles.detailValue}>{user.career}</span>
                </li>
              )}
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