import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './Profile.module.css';

const Profile = () => {
  const { userType } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Datos estáticos de tutorías
  const tutoringSessions = [
    {
      id: 1,
      tutorName: "Raul Zavala Hernandez",
      subject: "Lenguajes y Automatas",
      schedule: "Lunes y Miércoles, 10:00 - 11:30 AM",
      status: "Activa",
    },
    {
      id: 2,
      tutorName: "Cristian Fuentes Rosas",
      subject: "Programación lógica y funcional",
      schedule: "Martes y Jueves, 2:00 - 3:30 PM",
      status: "Activa",
    },
    {
      id: 3,
      tutorName: "Heriberto Lozada Serrano",
      subject: "Programación Web",
      schedule: "Viernes, 9:00 - 11:00 AM",
      status: "Activa",
    },
    {
      id: 4,
      tutorName: "Adrian Plascencia Fonseca",
      subject: "Lenguajes de Interfaz",
      schedule: "Martes y Jueves, 9:00 - 11:00 AM",
      status: "Activa",
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        console.log('Token encontrado:', token);
        console.log('UserType:', userType);
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        if (!userType) {
          throw new Error('Tipo de usuario no definido');
        }

        const endpoint = userType === 'alumno'
          ? 'http://localhost:5000/api/alumno/dashboard'
          : 'http://192.168.48.243:5001/api/tutor/dashboard';
        console.log('Endpoint usado:', endpoint);

        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Código de estado:', response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.log('Error del servidor:', errorData);
          throw new Error(errorData.message || `Error al obtener los datos del usuario: ${response.status}`);
        }

        const data = await response.json();
        console.log('Datos recibidos:', data);
        setUser({
          ...data,
          role: userType === 'alumno' ? 'Alumno' : 'Tutor',
          career: data.career || 'N/A',
          img: data.img || '/images/default-profile.png',
        });
      } catch (err) {
        console.error('Error completo:', err);
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
    <div className={styles.mainContainer}>
      <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          <div className={styles.profileImageWrapper}>
            <img src={'/images/Profile.png'} className={styles.profileImage} alt="Perfil" />
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>{user.name}</h1>
            <span className={styles.profileRole}>{user.role}</span>
            
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

      {/* Nueva sección para las tutorías */}
      <div className={styles.tutoringContainer}>
        <h2 className={styles.tutoringTitle}>Tutorías Activas</h2>
        {tutoringSessions.length === 0 ? (
          <p className={styles.noTutoringText}>No estás inscrito en ninguna tutoría actualmente.</p>
        ) : (
          <div className={styles.tutoringList}>
            {tutoringSessions.map((session) => (
              <div key={session.id} className={styles.tutoringCard}>
                <h3 className={styles.tutoringSubject}>{session.subject}</h3>
                <p className={styles.tutoringDetail}>
                  <span className={styles.detailLabel}>Tutor:</span> {session.tutorName}
                </p>
                <p className={styles.tutoringDetail}>
                  <span className={styles.detailLabel}>Horario:</span> {session.schedule}
                </p>
                <p className={styles.tutoringDetail}>
                  <span className={styles.detailLabel}>Estado:</span>
                  <span className={session.status === 'Activa' ? styles.statusActive : styles.statusInactive}>
                    {session.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;