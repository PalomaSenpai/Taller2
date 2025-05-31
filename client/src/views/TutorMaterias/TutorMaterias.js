import React from 'react';
import styles from './TutorMaterias.module.css';

const TutorMaterias = () => {
  // Static data for current subjects taught by the tutor
  const currentSubjects = [
    { id: 1, name: 'Matemáticas', description: 'Álgebra y Cálculo' },
    { id: 2, name: 'Programación', description: 'Python y JavaScript' },
  ];

  // Static data for available subjects to add
  const availableSubjects = [
    { id: 1, name: 'Física', description: 'Mecánica y Electromagnetismo' },
    { id: 2, name: 'Química', description: 'Química General y Orgánica' },
    { id: 3, name: 'Inglés', description: 'Gramática y Conversación' },
  ];

  // Component for current subjects list
  const CurrentSubjectsList = () => (
    <div className={styles.subjectSection}>
      <h2 className={styles.sectionTitle}>Materias que Impartes</h2>
      <div className={styles.cardGrid}>
        {currentSubjects.map((subject) => (
          <div key={subject.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{subject.name}</h3>
            </div>
            <p className={styles.cardDescription}>{subject.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Component for available subjects list
  const AvailableSubjectsList = () => (
    <div className={styles.subjectSection}>
      <h2 className={styles.sectionTitle}>Materias que Puedes Agregar</h2>
      <div className={styles.cardGrid}>
        {availableSubjects.map((subject) => (
          <div key={subject.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{subject.name}</h3>
            </div>
            <p className={styles.cardDescription}>{subject.description}</p>
            <button className={styles.cardButton}>Agregar</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.tutorMaterias}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          <i className="bx bx-book"></i> Mis Materias
        </h1>
        <div className={styles.materiasContent}>
          <CurrentSubjectsList />
          <AvailableSubjectsList />
        </div>
      </div>
    </div>
  );
};

export default TutorMaterias;