import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TutorDetail.module.css';

const TutorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true); // Nuevo estado
  const [errorComments, setErrorComments] = useState(null); // Nuevo estado
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);

  const ratingOptions = Array.from({ length: 11 }, (_, i) => (i * 0.5).toFixed(1));

  useEffect(() => {
    const fetchTutor = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/tutores/noauth/${id}`);
        if (!response.ok) {
          throw new Error('Tutor no encontrado');
        }
        const data = await response.json();
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

    const fetchComments = async () => {
      setLoadingComments(true);
      setErrorComments(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No estás autenticado. Por favor, inicia sesión.');
        }

        const response = await fetch(`http://localhost:5000/api/mensajes/ver/comentarios?tutor_id=${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener comentarios: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (data.success) {
          setComments(data.data);
        } else {
          throw new Error(data.message || 'Error al obtener comentarios');
        }
      } catch (err) {
        console.error('Error al obtener comentarios:', err);
        setErrorComments('No se pudieron cargar los comentarios.');
      } finally {
        setLoadingComments(false);
      }
    };

    fetchTutor();
    fetchComments();
  }, [id]);

  const schedule = [
    { time: '9:00', monday: 'Disponible', tuesday: 'Ocupado', wednesday: 'Disponible', thursday: 'Ocupado', friday: 'Disponible' },
    { time: '10:00', monday: 'Disponible', tuesday: 'Ocupado', wednesday: 'Disponible', thursday: 'Ocupado', friday: 'Disponible' },
    { time: '11:00', monday: 'Ocupado', tuesday: 'Disponible', wednesday: 'Ocupado', thursday: 'Disponible', friday: 'Ocupado' },
    { time: '12:00', monday: 'Ocupado', tuesday: 'Disponible', wednesday: 'Ocupado', thursday: 'Disponible', friday: 'Ocupado' },
    { time: '13:00', monday: 'No Disponible', tuesday: 'No Disponible', wednesday: 'No Disponible', thursday: 'No Disponible', friday: 'No Disponible' },
    { time: '14:00', monday: 'Disponible', tuesday: 'Ocupado', wednesday: 'Disponible', thursday: 'Ocupado', friday: 'Disponible' },
    { time: '15:00', monday: 'Disponible', tuesday: 'Ocupado', wednesday: 'Disponible', thursday: 'Ocupado', friday: 'Disponible' },
    { time: '16:00', monday: 'Ocupado', tuesday: 'Disponible', wednesday: 'Ocupado', thursday: 'Disponible', friday: 'Ocupado' },
    { time: '17:00', monday: 'Ocupado', tuesday: 'Disponible', wednesday: 'Ocupado', thursday: 'Disponible', friday: 'Ocupado' },
    { time: '18:00', monday: 'Ocupado', tuesday: 'Disponible', wednesday: 'Ocupado', thursday: 'Disponible', friday: 'Ocupado' },
  ];

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || newRating < 0 || newRating > 5) {
      alert('Por favor, escribe un comentario válido y selecciona un puntaje entre 0 y 5.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/mensajes/comentarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          tutor_id: id,
          comentario: newComment,
          rating: parseFloat(newRating),
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        const newCommentEntry = {
          ID: responseData.data.ID,
          author: responseData.data.author || 'Tú',
          Comentario: newComment,
          Rating: parseFloat(newRating),
          date: new Date().toISOString().split('T')[0],
        };

        setComments([newCommentEntry, ...comments]);
        setNewComment('');
        setNewRating(0);
      } else {
        console.error('Error al enviar comentario:', responseData.message);
        alert('Error al enviar comentario: ' + responseData.message);
      }
    } catch (err) {
      console.error('Error al enviar comentario:', err);
      alert('Error al enviar comentario. Por favor, intenta de nuevo.');
    }
  };

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
              onClick={() => navigate('/')}
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
          onClick={() => navigate('/')}
          className={styles.backButton}
        >
          <i className="bx bx-arrow-back"></i> Volver
        </button>
        <div className={styles.tutorProfile}>
          <img src='/images/Profile.png' alt={tutor.name} className={styles.tutorImg} />
          <div className={styles.tutorInfo}>
            <h1 className={styles.tutorName}>{tutor.name}</h1>
            <div className={styles.tutorSubjects}>
              {tutor.subjects && tutor.subjects.map((subject, index) => (
                <span key={index} className={styles.subjectTag}>{subject}</span>
              ))}
            </div>
            <div className={styles.tutorMeta}>
              <div className={styles.metaItem}>
                <i className="bx bx-star"></i>
                <span>{tutor.rating ? tutor.rating.toFixed(1) : 'N/A'}</span>
              </div>
              <div className={styles.metaItem}>
                <i className="bx bx-user"></i>
                <span>{tutor.type || 'N/A'}</span>
              </div>
            </div>
            <p className={styles.tutorBio}>{tutor.bio}</p>
            <p className={styles.tutorEmail}>
              <i className="bx bx-envelope"></i> {tutor.email || 'No disponible'}
            </p>
            <a
              href={`mailto:${tutor.email || ''}`}
              className={styles.contactButton}
              style={{ pointerEvents: !tutor.email ? 'none' : 'auto', opacity: !tutor.email ? 0.6 : 1 }}
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

        {/* Sección de comentarios */}
        <div className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>Comentarios</h2>
          <div className={styles.commentForm}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe un comentario..."
              className={styles.commentInput}
            />
            <div className={styles.ratingInput}>
              <label htmlFor="rating">Puntaje: </label>
              <select
                id="rating"
                value={newRating}
                onChange={(e) => setNewRating(parseFloat(e.target.value))}
                className={styles.ratingSelect}
              >
                {ratingOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleAddComment} className={styles.submitCommentButton}>
              Enviar
            </button>
          </div>
          <div className={styles.commentsList}>
            {loadingComments ? (
              <p>Cargando comentarios...</p>
            ) : errorComments ? (
              <p className={styles.noTutorText}>{errorComments}</p>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.ID} className={styles.commentItem}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>{comment.author || 'Anónimo'}</span>
                    <span className={styles.commentDate}>{comment.date || 'Sin fecha'}</span>
                  </div>
                  <div className={styles.commentRating}>
                    <i className="bx bx-star"></i>
                    <span>{comment.Rating ? comment.Rating.toFixed(1) : 'N/A'}</span>
                  </div>
                  <p className={styles.commentText}>{comment.Comentario || 'Sin comentario'}</p>
                </div>
              ))
            ) : (
              <p className={styles.noTutorText}>No hay comentarios todavía.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetails;