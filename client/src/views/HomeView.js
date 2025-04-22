import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/Home.module.css';

const TutorsWindow = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    subject: 'all',
    availability: 'all',
    rating: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const tutorsPerPage = 6;

  // Datos de ejemplo con materias múltiples
  const tutors = [
    {
      id: 1,
      name: 'Ana Gómez',
      subjects: ['Matemáticas', 'Álgebra', 'Cálculo'],
      rating: 4.8,
      availability: 'Inmediata',
      img: '/images/tutor1.webp',
    },
    {
      id: 2,
      name: 'Carlos Ruiz',
      subjects: ['Programación', 'Bases de Datos'],
      rating: 4.5,
      availability: 'Tarde',
      img: '/images/tutor2.webp',
    },
    {
      id: 3,
      name: 'María López',
      subjects: ['Física', 'Mecánica'],
      rating: 4.9,
      availability: 'Inmediata',
      img: '/images/tutor3.webp',
    },
    {
      id: 4,
      name: 'Juan Pérez',
      subjects: ['Química', 'Química Orgánica', 'Bioquímica', 'Análisis Químico'],
      rating: 4.2,
      availability: 'Mañana',
      img: '/images/tutor4.webp',
    },
    {
      id: 5,
      name: 'Sofía Martínez',
      subjects: ['Matemáticas', 'Estadística'],
      rating: 4.7,
      availability: 'Inmediata',
      img: '/images/tutor5.webp',
    },
    {
      id: 6,
      name: 'Luis Fernández',
      subjects: ['Programación', 'Algoritmos', 'Estructuras de Datos'],
      rating: 4.6,
      availability: 'Tarde',
      img: '/images/tutor6.webp',
    },
    {
      id: 7,
      name: 'Elena Díaz',
      subjects: ['Física', 'Electromagnetismo'],
      rating: 4.8,
      availability: 'Mañana',
      img: '/images/tutor7.webp',
    },
    {
      id: 8,
      name: 'Diego Torres',
      subjects: ['Química', 'Química Analítica'],
      rating: 4.3,
      availability: 'Inmediata',
      img: '/images/tutor8.webp',
    },
  ];

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
                <option value="Matemáticas">Matemáticas</option>
                <option value="Programación">Programación</option>
                <option value="Física">Física</option>
                <option value="Química">Química</option>
                <option value="Álgebra">Álgebra</option>
                <option value="Cálculo">Cálculo</option>
                <option value="Estadística">Estadística</option>
                <option value="Bases de Datos">Bases de Datos</option>
                <option value="Mecánica">Mecánica</option>
                <option value="Electromagnetismo">Electromagnetismo</option>
                <option value="Química Orgánica">Química Orgánica</option>
                <option value="Bioquímica">Bioquímica</option>
                <option value="Química Analítica">Química Analítica</option>
                <option value="Análisis Químico">Análisis Químico</option>
                <option value="Algoritmos">Algoritmos</option>
                <option value="Estructuras de Datos">Estructuras de Datos</option>
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