import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TutorDetail.module.css';

const TutorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Datos de ejemplo (puedes reemplazar con una API)
  const tutors = [
    {
      id: 1,
      name: 'Ana Gómez',
      subjects: ['Matemáticas', 'Álgebra', 'Cálculo'],
      rating: 4.8,
      availability: 'Inmediata',
      img: '/images/tutor1.webp',
      bio: 'Apasionada por las matemáticas con 5 años de experiencia enseñando a estudiantes de todos los niveles. Especializada en álgebra y cálculo.',
      contactEmail: 'ana.gomez@tutolynx.com',
    },
    {
      id: 2,
      name: 'Carlos Ruiz',
      subjects: ['Programación', 'Bases de Datos'],
      rating: 4.5,
      availability: 'Tarde',
      img: '/images/tutor2.webp',
      bio: 'Desarrollador de software con 7 años de experiencia. Enseño programación práctica y bases de datos con un enfoque en proyectos reales.',
      contactEmail: 'carlos.ruiz@tutolynx.com',
    },
    {
      id: 3,
      name: 'María López',
      subjects: ['Física', 'Mecánica'],
      rating: 4.9,
      availability: 'Inmediata',
      img: '/images/tutor3.webp',
      bio: 'Física teórica con pasión por explicar conceptos complejos de manera sencilla. Experta en mecánica y física clásica.',
      contactEmail: 'maria.lopez@tutolynx.com',
    },
    {
      id: 4,
      name: 'Juan Pérez',
      subjects: ['Química', 'Química Orgánica', 'Bioquímica', 'Análisis Químico'],
      rating: 4.2,
      availability: 'Mañana',
      img: '/images/tutor4.webp',
      bio: 'Químico con experiencia en laboratorios y docencia. Ayudo a estudiantes a dominar química orgánica y bioquímica.',
      contactEmail: 'juan.perez@tutolynx.com',
    },
    {
      id: 5,
      name: 'Sofía Martínez',
      subjects: ['Matemáticas', 'Estadística'],
      rating: 4.7,
      availability: 'Inmediata',
      img: '/images/tutor5.webp',
      bio: 'Estadística aplicada y matemáticas para todos los niveles. Me enfoco en hacer que las matemáticas sean accesibles y divertidas.',
      contactEmail: 'sofia.martinez@tutolynx.com',
    },
    {
      id: 6,
      name: 'Luis Fernández',
      subjects: ['Programación', 'Algoritmos', 'Estructuras de Datos'],
      rating: 4.6,
      availability: 'Tarde',
      img: '/images/tutor6.webp',
      bio: 'Ingeniero en sistemas especializado en algoritmos y estructuras de datos. Te ayudo a programar con confianza.',
      contactEmail: 'luis.fernandez@tutolynx.com',
    },
    {
      id: 7,
      name: 'Elena Díaz',
      subjects: ['Física', 'Electromagnetismo'],
      rating: 4.8,
      availability: 'Mañana',
      img: '/images/tutor7.webp',
      bio: 'Doctora en física con experiencia en electromagnetismo. Enseño con ejemplos prácticos y simulaciones.',
      contactEmail: 'elena.diaz@tutolynx.com',
    },
    {
      id: 8,
      name: 'Diego Torres',
      subjects: ['Química', 'Química Analítica'],
      rating: 4.3,
      availability: 'Inmediata',
      img: '/images/tutor8.webp',
      bio: 'Químico analítico con experiencia en enseñanza. Te ayudo a entender química analítica desde cero.',
      contactEmail: 'diego.torres@tutolynx.com',
    },
  ];

  const tutor = tutors.find((t) => t.id === parseInt(id));

  if (!tutor) {
    return (
      <div className={styles.tutorDetails}>
        <div className={styles.container}>
          <div className={styles.noTutor}>
            <img src="/images/lince-sad.png" alt="Lince Triste" className={styles.noTutorImg} />
            <p className={styles.noTutorText}>Tutor no encontrado.</p>
            <button
              onClick={() => navigate('/tutors')}
              className={styles.backButton}
            >
              Volver a Tutores
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tutorDetails}>
      <div className={styles.container}>
        <button
          onClick={() => navigate('/tutors')}
          className={styles.backButton}
        >
          <i className="bx bx-arrow-back"></i> Volver
        </button>
        <div className={styles.tutorProfile}>
          <img src={tutor.img} alt={tutor.name} className={styles.tutorImg} />
          <div className={styles.tutorInfo}>
            <h1 className={styles.tutorName}>{tutor.name}</h1>
            <div className={styles.tutorSubjects}>
              {tutor.subjects.map((subject, index) => (
                <span key={index} className={styles.subjectTag}>{subject}</span>
              ))}
            </div>
            <div className={styles.tutorMeta}>
              <div className={styles.metaItem}>
                <i className="bx bx-star"></i>
                <span>{tutor.rating.toFixed(1)}</span>
              </div>
              <div className={styles.metaItem}>
                <i className="bx bx-time"></i>
                <span>{tutor.availability}</span>
              </div>
            </div>
            <p className={styles.tutorBio}>{tutor.bio}</p>
            <a
              href={`mailto:${tutor.contactEmail}`}
              className={styles.contactButton}
            >
              Contactar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetails;