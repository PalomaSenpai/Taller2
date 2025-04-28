import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TutorDetail.module.css';

const TutorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener los datos del tutor desde el backend
  useEffect(() => {
    const fetchTutor = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:5000/api/tutores/${id}`);
        if (!response.ok) {
          throw new Error('Tutor no encontrado');
        }
        const data = await response.json();
        // Añadir una bio predeterminada si no está en la base de datos
        setTutor({
          ...data,
          bio: data.bio || 'Este tutor no ha proporcionado una biografía todavía.'
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [id]);

  // Datos estáticos de horarios (plantilla)
  const schedule = [
    { time: '9:00 - 11:00', monday: 'Disponible', tuesday: 'Ocupado', wednesday: 'Disponible', thursday: 'Ocupado', friday: 'Disponible' },
    { time: '11:00 - 13:00', monday: 'Ocupado', tuesday: 'Disponible', wednesday: 'Ocupado', thursday: 'Disponible', friday: 'Ocupado' },
    { time: '14:00 - 16:00', monday: 'Disponible', tuesday: 'Ocupado', wednesday: 'Disponible', thursday: 'Ocupado', friday: 'Disponible' },
    { time: '16:00 - 18:00', monday: 'Ocupado', tuesday: 'Disponible', wednesday: 'Ocupado', thursday: 'Disponible', friday: 'Ocupado' },
  ];

  if (loading) {
    return (
      <div className={styles.tutorDetails}>
        <div className={styles.container}>
          <p>Cargando detalles del tutor...</p>
        </div>
      </div>
    );
  }

  if (error || !tutor) {
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
                <i className="bx bx-user"></i>
                <span>{tutor.type}</span>
              </div>
            </div>
            <p className={styles.tutorBio}>{tutor.bio}</p>
            <p className={styles.tutorEmail}>
              <i className="bx bx-envelope"></i> {tutor.email}
            </p>
            <a
              href={`mailto:${tutor.email}`}
              className={styles.contactButton}
            >
              Contactar
            </a>
          </div>
        </div>

        {/* Tabla de horarios */}
        <div className={styles.scheduleSection}>
          <h2 className={styles.scheduleTitle}>Horarios Disponibles</h2>
          <table className={styles.scheduleTable}>
            <thead>
              <tr>
                <th>Hora</th>
                <th>Lunes</th>
                <th>Martes</th>
                <th>Miércoles</th>
                <th>Jueves</th>
                <th>Viernes</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((slot, index) => (
                <tr key={index}>
                  <td>{slot.time}</td>
                  <td className={slot.monday === 'Disponible' ? styles.available : styles.unavailable}>
                    {slot.monday}
                  </td>
                  <td className={slot.tuesday === 'Disponible' ? styles.available : styles.unavailable}>
                    {slot.tuesday}
                  </td>
                  <td className={slot.wednesday === 'Disponible' ? styles.available : styles.unavailable}>
                    {slot.wednesday}
                  </td>
                  <td className={slot.thursday === 'Disponible' ? styles.available : styles.unavailable}>
                    {slot.thursday}
                  </td>
                  <td className={slot.friday === 'Disponible' ? styles.available : styles.unavailable}>
                    {slot.friday}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TutorDetails;