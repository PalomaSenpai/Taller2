import React from 'react';
import styles from './Materias.module.css';

const Materias = () => {
  // Datos completos extraídos de la imagen
    const subjects = [
    { id: 'AEF-1052', name: 'Probabilidad y Estadística', credits: 4, hoursT: 2, hoursP: 2, semester: 3, predecessors: [] },
    { id: 'SCC-1013', name: 'Investigación de Operaciones', credits: 4, hoursT: 2, hoursP: 2, semester: 3, predecessors: [] },
    { id: 'SCF-1006', name: 'Física General', credits: 5, hoursT: 3, hoursP: 2, semester: 3, predecessors: [] },
    { id: 'AEF-0901', name: 'Cálculo Diferencial', credits: 5, hoursT: 3, hoursP: 2, semester: 3, predecessors: [] },
    { id: 'ACF-0902', name: 'Cálculo Integral', credits: 5, hoursT: 3, hoursP: 2, semester: 3, predecessors: ['AEF-0901'] },
    { id: 'ACF-0940', name: 'Cálculo Vectorial', credits: 5, hoursT: 3, hoursP: 2, semester: 4, predecessors: ['ACF-0902'] },
    { id: 'ACF-0905', name: 'Ecuaciones Diferenciales', credits: 5, hoursT: 3, hoursP: 2, semester: 4, predecessors: ['ACF-0940'] },
    { id: 'SCC-1012', name: 'Inteligencia Artificial', credits: 4, hoursT: 2, hoursP: 2, semester: 4, predecessors: [] },
    { id: 'SCD-1015', name: 'Lenguajes y Autómatas I', credits: 4, hoursT: 2, hoursP: 2, semester: 4, predecessors: [] },
    { id: 'SCD-1016', name: 'Lenguajes y Autómatas II', credits: 4, hoursT: 2, hoursP: 2, semester: 5, predecessors: ['SCD-1015'] },
    { id: 'IND-2103', name: 'Programación Móvil y Servicios en la Nube', credits: 5, hoursT: 2, hoursP: 3, semester: 5, predecessors: ['SCD-1016'] },
    { id: 'SCD-1018', name: 'Principios Eléctricos y Aplicaciones Digitales', credits: 5, hoursT: 2, hoursP: 3, semester: 4, predecessors: ['SCF-1006'] },
    { id: 'AEC-1034', name: 'Fundamentos de Telecomunicaciones', credits: 4, hoursT: 2, hoursP: 2, semester: 4, predecessors: [] },
    { id: 'SCD-1021', name: 'Redes de Computadoras', credits: 5, hoursT: 2, hoursP: 3, semester: 5, predecessors: ['AEC-1034'] },
    { id: 'SCD-1004', name: 'Comunicación y Enrutamiento de Redes de Datos', credits: 5, hoursT: 2, hoursP: 3, semester: 5, predecessors: ['SCD-1021'] },
    { id: 'SCA-1002', name: 'Administración de Redes', credits: 4, hoursT: 0, hoursP: 4, semester: 5, predecessors: ['SCD-1004'] },
    { id: 'SCD-1003', name: 'Arquitectura de Computadoras', credits: 4, hoursT: 2, hoursP: 2, semester: 3, predecessors: [] },
    { id: 'SCC-1014', name: 'Lenguajes de Interfaz', credits: 4, hoursT: 2, hoursP: 2, semester: 4, predecessors: ['SCD-1003'] },
    { id: 'SCD-1022', name: 'Simulación', credits: 5, hoursT: 2, hoursP: 3, semester: 4, predecessors: ['SCC-1013'] },
    { id: 'SCD-1023', name: 'Sistemas Programables', credits: 4, hoursT: 2, hoursP: 2, semester: 4, predecessors: ['SCD-1022'] },
    { id: 'IND-2102', name: 'Ciberseguridad', credits: 5, hoursT: 2, hoursP: 3, semester: 5, predecessors: ['SCD-1023'] },
    { id: 'AEF-1041', name: 'Matemáticas Discretas', credits: 5, hoursT: 3, hoursP: 2, semester: 3, predecessors: [] },
    { id: 'ACA-0907', name: 'Taller de Ética', credits: 4, hoursT: 0, hoursP: 4, semester: 3, predecessors: [] },
    { id: 'SCC-1005', name: 'Cultura Emprensarial', credits: 4, hoursT: 2, hoursP: 2, semester: 3, predecessors: [] },
    { id: 'AEC-1061', name: 'Sistemas Operativos', credits: 4, hoursT: 2, hoursP: 2, semester: 4, predecessors: [] },
    { id: 'SCA-1026', name: 'Taller de Sistemas Operativos', credits: 4, hoursT: 0, hoursP: 4, semester: 4, predecessors: ['AEC-1061'] },
    { id: 'AEB-1055', name: 'Programación Web', credits: 5, hoursT: 1, hoursP: 4, semester: 5, predecessors: [] },
    { id: 'IND-2101', name: 'Tópicos Especializados de Desarrollo Web', credits: 5, hoursT: 2, hoursP: 3, semester: 5, predecessors: ['AEB-1055'] },
    { id: 'ACA-0906', name: 'Elementos de Investigación', credits: 4, hoursT: 2, hoursP: 2, semester: 3, predecessors: [] },
    { id: 'ACD-0908', name: 'Desarrollo Sustentable', credits: 5, hoursT: 2, hoursP: 3, semester: 3, predecessors: [] },
    { id: 'ACF-0930', name: 'Métodos Numéricos', credits: 4, hoursT: 2, hoursP: 2, semester: 4, predecessors: [] },
    { id: 'SCC-1010', name: 'Graficación', credits: 4, hoursT: 2, hoursP: 2, semester: 4, predecessors: [] },
    { id: 'SCC-1019', name: 'Programación y Matemáticas', credits: 4, hoursT: 2, hoursP: 2, semester: 4, predecessors: [] },
    { id: 'ACA-0909', name: 'Taller de Investigación I', credits: 4, hoursT: 0, hoursP: 4, semester: 4, predecessors: ['ACA-0906'] },
    { id: 'ACA-0910', name: 'Taller de Investigación II', credits: 4, hoursT: 0, hoursP: 4, semester: 5, predecessors: ['ACA-0909'] },
    { id: 'ACG-1009', name: 'Ciencia de Datos', credits: 6, hoursT: 3, hoursP: 3, semester: 5, predecessors: ['ACA-0910'] },
    { id: 'SCD-1025', name: 'Taller de Base de Datos', credits: 4, hoursT: 0, hoursP: 4, semester: 5, predecessors: ['AEF-1031'] },
    { id: 'AEF-1031', name: 'Fundamentos de Base de Datos', credits: 5, hoursT: 3, hoursP: 2, semester: 4, predecessors: [] },
    { id: 'SCC-1007', name: 'Administración de Base de Datos', credits: 5, hoursT: 1, hoursP: 4, semester: 5, predecessors: ['AEF-1031'] },
    { id: 'SCD-1027', name: 'Tópicos Avanzados de Programación', credits: 5, hoursT: 2, hoursP: 3, semester: 5, predecessors: ['SCC-1027'] },
    { id: 'SCC-1027', name: 'Fundamentos de Programación', credits: 5, hoursT: 2, hoursP: 3, semester: 3, predecessors: [] },
    { id: 'SCH-1042', name: 'Contabilidad Financiera', credits: 4, hoursT: 2, hoursP: 2, semester: 3, predecessors: [] },
    { id: 'AEC-1068', name: 'Química', credits: 4, hoursT: 2, hoursP: 2, semester: 3, predecessors: [] },
    { id: 'SCD-1011', name: 'Ingeniería de Software', credits: 4, hoursT: 2, hoursP: 2, semester: 4, predecessors: [] },
    { id: 'SCC-1009', name: 'Gestión de Proyectos de Software', credits: 6, hoursT: 3, hoursP: 3, semester: 5, predecessors: ['SCD-1011'] },
    { id: 'IND-2104', name: 'Internet de las Cosas (IoT)', credits: 5, hoursT: 2, hoursP: 3, semester: 5, predecessors: [] },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <h1 className={styles.title}>Plan de Estudios</h1>
        <div className={styles.graphContainer}>
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className={styles.subjectCard}
              style={{
                top: `${(subject.semester - 1) * 20}%`,
                left: `${(subjects.filter(s => s.semester === subject.semester).indexOf(subject) * 15)}%`,
              }}
            >
              <div className={styles.cardHeader}>
                <span className={styles.subjectCode}>{subject.id}</span>
                <span className={styles.semester}>Sem: {subject.semester}</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.subjectName}>{subject.name}</h3>
                <p className={styles.subjectDetails}>
                  Créditos: {subject.credits} | H. Teóricas: {subject.hoursT} | H. Prácticas: {subject.hoursP}
                </p>
              </div>
            </div>
          ))}
          {subjects.map((subject) => 
            subject.predecessors.map((predecessorId) => {
              const predecessor = subjects.find(s => s.id === predecessorId);
              if (predecessor) {
                return (
                  <div
                    key={`${subject.id}-${predecessorId}`}
                    className={styles.connectionLine}
                    style={{
                      left: `${(subjects.filter(s => s.semester === predecessor.semester).indexOf(predecessor) * 15 + 7.5)}%`,
                      top: `${(predecessor.semester - 1) * 20 + 10}%`,
                      width: `${(subject.semester - predecessor.semester) * 15 - 2}%`,
                      height: `${(subject.semester - predecessor.semester) * 20 - 10}%`,
                    }}
                  />
                );
              }
              return null;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Materias;