import React from 'react';
import styles from './TutorDashboar.module.css';

const TutorDashboard = () => {
  // Lista estática de alumnos que contactaron
  const contactedStudents = [
    { id: 1, name: 'Juan Pérez', subject: 'Matemáticas', message: 'Necesito ayuda con álgebra lineal.' },
    { id: 2, name: 'María Gómez', subject: 'Programación', message: 'Tengo dudas sobre Python.' },
    { id: 3, name: 'Carlos López', subject: 'Física', message: 'Quiero repasar mecánica clásica.' },
  ];

  // Lista estática de asesorías actuales
  const currentSessions = [
    { id: 1, time: '10:00 - 11:00', student: 'Juan Pérez', subject: 'Matemáticas', location: 'Zoom' },
    { id: 2, time: '14:00 - 15:00', student: 'María Gómez', subject: 'Programación', location: 'Google Meet' },
  ];

  // Componente para la lista de alumnos que contactaron
  const ContactedStudentsList = () => (
    <div className={styles.contactList}>
      <h2 className={styles.sectionTitle}>Alumnos que te han contactado</h2>
      <div className={styles.cardGrid}>
        {contactedStudents.map((student) => (
          <div key={student.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{student.name}</h3>
              <span className={styles.cardTag}>{student.subject}</span>
            </div>
            <p className={styles.cardMessage}>{student.message}</p>
            <button className={styles.cardButton}>Responder</button>
          </div>
        ))}
      </div>
    </div>
  );

  // Componente para la lista de asesorías actuales
  const CurrentSessionsList = () => (
    <div className={styles.sessionList}>
      <h2 className={styles.sectionTitle}>Asesorías Actuales</h2>
      <div className={styles.cardGrid}>
        {currentSessions.map((session) => (
          <div key={session.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{session.student}</h3>
              <span className={styles.cardTag}>{session.subject}</span>
            </div>
            <div className={styles.cardDetails}>
              <span className={styles.cardTime}>{session.time}</span>
              <span className={styles.cardLocation}>{session.location}</span>
            </div>
            <button className={styles.cardButton}>Ver Detalles</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.tutorDashboard}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          <i className="bx bx-home"></i> Panel de Tutor
        </h1>
        <div className={styles.dashboardContent}>
          <ContactedStudentsList />
          <CurrentSessionsList />
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;