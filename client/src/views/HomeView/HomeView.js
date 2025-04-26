import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css'; // Asegúrate de que la ruta sea correcta

const TutorsWindow = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    subject: 'all',
    availability: 'all',
    rating: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [tutors, setTutors] = useState([]); // Estado para tutores dinámicos
  const [subjects, setSubjects] = useState([]); // Estado para materias dinámicas
  const [loading, setLoading] = useState(true); // Estado para manejar carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const tutorsPerPage = 6;

  // Obtener tutores y materias del backend al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Obtener tutores y sus materias
        const tutorsResponse = await fetch('http://localhost:5000/api/tutors');
        if (!tutorsResponse.ok) {
          throw new Error('Error al obtener los tutores');
        }
        const tutorsData = await tutorsResponse.json();
        setTutors(tutorsData);

        // Obtener lista de materias para el filtro
        const subjectsResponse = await fetch('http://localhost:5000/api/subjects');
        if (!subjectsResponse.ok) {
          throw new Error('Error al obtener las materias');
        }
        const subjectsData = await subjectsResponse.json();
        setSubjects(subjectsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar tutores
  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutor.subjects.some((subject) => subject.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = filters.subject === 'all' || tutor.subjects.includes(filters.subject);
    const matchesAvailability = filters.availability === 'all' || tutor.availability === filters.availability;
    const matchesRating = filters.rating === 'all' || tutor.rating >= parseFloat(filters.rating);
    return matchesSearch && matchesSubject && matchesAvailability && matchesRating;
  });

  // Paginación
  const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage);
  const paginatedTutors = filteredTutors.slice(
    (currentPage - 1) * tutorsPerPage,
    currentPage * tutorsPerPage
  );

  // Manejar filtros
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  // Resetear filtros
  const resetFilters = () => {
    setFilters({ subject: 'all', availability: 'all', rating: 'all' });
    setCurrentPage(1);
  };

  // Manejar responsividad de filtros
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setShowFilters(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mostrar estado de carga o error
  if (loading) {
    return <div className={styles.loading}>Cargando tutores...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.tutorsWindow}>
      <div className={styles.container}>
        {/* Encabezado */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            <i className="bx bx-book-reader"></i>
            Tutores Disponibles
          </h1>
          <div className={styles.searchBar}>
            <i className={`bx bx-search ${styles.searchIcon}`}></i>
            <input
              type="text"
              placeholder="Buscar tutores por nombre o materia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Buscar tutores"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className={styles.filtersSection}>
          <button
            className={styles.toggleFilters}
            onClick={() => setShowFilters(!showFilters)}
          >
            <i className="bx bx-filter"></i>
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
          <div className={`${styles.filters} ${showFilters ? styles.filtersVisible : ''}`}>
            <div className={styles.filterGroup}>
              <label htmlFor="subject" className={styles.filterLabel}>Materia</label>
              <select
                id="subject"
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                className={styles.filterSelect}
              >
                <option value="all">Todas</option>
                {subjects.map((subject) => (
                  <option key={subject.Clave} value={subject.Nombre}>
                    {subject.Nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label htmlFor="availability" className={styles.filterLabel}>Disponibilidad</label>
              <select
                id="availability"
                name="availability"
                value={filters.availability}
                onChange={handleFilterChange}
                className={styles.filterSelect}
              >
                <option value="all">Todas</option>
                <option value="Inmediata">Inmediata</option>
                <option value="Mañana">Mañana</option>
                <option value="Tarde">Tarde</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label htmlFor="rating" className={styles.filterLabel}>Calificación Mínima</label>
              <select
                id="rating"
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className={styles.filterSelect}
              >
                <option value="all">Todas</option>
                <option value="4.0">4.0+</option>
                <option value="4.5">4.5+</option>
                <option value="4.8">4.8+</option>
              </select>
            </div>
            <button
              onClick={resetFilters}
              className={styles.resetButton}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Lista de Tutores */}
        {paginatedTutors.length > 0 ? (
          <div className={styles.tutorsGrid}>
            {paginatedTutors.map((tutor) => (
              <Link
                to={`/tutor/${tutor.id}`}
                key={tutor.id}
                className={styles.tutorCard}
                aria-label={`Ver detalles de ${tutor.name}`}
              >
                <div className={styles.tutorInfo}>
                  <img src={tutor.img} alt={tutor.name} className={styles.tutorImg} />
                  <div>
                    <h3 className={styles.tutorName}>{tutor.name}</h3>
                    <div className={styles.tutorSubjects}>
                      {tutor.subjects.slice(0, 3).map((subject, index) => (
                        <span key={index} className={styles.subjectTag}>{subject}</span>
                      ))}
                      {tutor.subjects.length > 3 && (
                        <span className={styles.subjectTag}>+{tutor.subjects.length - 3} más</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.tutorDetails}>
                  <i className="bx bx-star"></i>
                  <span className={styles.tutorRating}>{tutor.rating.toFixed(1)}</span>
                  <span className={styles.tutorAvailability}>({tutor.availability})</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <img src="/images/lince-sad.png" alt="Lince Triste" className={styles.noResultsImg} />
            <p className={styles.noResultsText}>No se encontraron tutores con esos criterios.</p>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`${styles.paginationButton} ${page === currentPage ? styles.paginationActive : ''}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={styles.paginationButton}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorsWindow;