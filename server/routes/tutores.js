const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// Obtener la lista de todos los tutores disponibles con sus materias (pública)
router.get('/', (req, res) => {
  console.log('Accediendo a GET /tutores/'); // Depuración
  connection.query(`
    SELECT NoControl AS id, Nombre AS name, Tipo AS type, Rating AS rating, Imagen AS img
    FROM Tutores
  `, (err, tutors) => {
    if (err) {
      console.error('Error al obtener tutores:', err); // Depuración
      return res.status(500).json({ error: 'Error al obtener tutores', details: err });
    }

    console.log('Tutores obtenidos:', tutors); // Depuración
    if (tutors.length === 0) {
      return res.json([]);
    }

    let completedQueries = 0;
    tutors.forEach((tutor, index) => {
      console.log(`Obteniendo materias para tutor ${tutor.id}`); // Depuración
      connection.query(`
        SELECT m.Nombre
        FROM Tutor_Materias tm
        JOIN Materias m ON tm.Materia = m.Clave
        WHERE tm.Tutor = ?
      `, [tutor.id], (err, subjects) => {
        if (err) {
          console.error(`Error al obtener materias para tutor ${tutor.id}:`, err);
          tutor.subjects = [];
        } else {
          console.log(`Materias obtenidas para tutor ${tutor.id}:`, subjects); // Depuración
          tutor.subjects = subjects.map(subject => subject.Nombre);
        }

        completedQueries++;
        if (completedQueries === tutors.length) {
          console.log('Todos los tutores procesados:', tutors); // Depuración
          res.json(tutors);
        }
      });
    });
  });
});



// Obtener los detalles de un tutor específico por ID (pública)
router.get('/noauth/:id', (req, res) => {
  const { id } = req.params;

  connection.query(`
    SELECT NoControl AS id, Nombre AS name, Correo AS email, Tipo AS type, Rating AS rating, Imagen AS img
    FROM Tutores
    WHERE NoControl = ?
  `, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener tutor', details: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Tutor no encontrado' });
    }

    const tutor = results[0];

    connection.query(`
      SELECT m.Nombre
      FROM Tutor_Materias tm
      JOIN Materias m ON tm.Materia = m.Clave
      WHERE tm.Tutor = ?
    `, [tutor.id], (err, subjects) => {
      if (err) {
        console.error(`Error al obtener materias para tutor ${tutor.id}:`, err);
        tutor.subjects = [];
      } else {
        tutor.subjects = subjects.map(subject => subject.Nombre);
      }

      res.json(tutor);
    });
  });
});

// Obtener los datos del tutor autenticado para su dashboard (protegida)
router.get('/dashboard', (req, res) => {
  const tutorId = req.user.id;
  // Obtenido del token JWT por el middleware authenticateToken

  connection.query(`
    SELECT NoControl AS id, Nombre AS name, Correo AS email, Tipo AS type, Rating AS rating, Imagen AS img
    FROM Tutores
    WHERE NoControl = ?
  `, [tutorId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener datos del tutor', details: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Tutor no encontrado' });
    }

    const tutor = results[0];

    connection.query(`
      SELECT m.Nombre
      FROM Tutor_Materias tm
      JOIN Materias m ON tm.Materia = m.Clave
      WHERE tm.Tutor = ?
    `, [tutor.id], (err, subjects) => {
      if (err) {
        console.error(`Error al obtener materias para tutor ${tutor.id}:`, err);
        tutor.subjects = [];
      } else {
        tutor.subjects = subjects.map(subject => subject.Nombre);
      }

      res.json(tutor);
    });
  });
});

module.exports = router;