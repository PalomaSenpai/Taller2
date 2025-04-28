const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// Obtener la lista de todos los alumnos (protegida por index.js)
router.get('/', (req, res) => {
  console.log('Accediendo a GET /alumnos/'); // Depuración
  connection.query(`
    SELECT NoControl AS id, Nombre AS name, Cla_Car AS career
    FROM Alumnos
  `, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener alumnos', details: err });
    }
    res.json(results);
  });
});

// Obtener los detalles de un alumno específico por NoControl (protegida por index.js)
router.get('/noauth/:noControl', (req, res) => {
  const { noControl } = req.params;
  console.log('Accediendo a GET /alumnos/:noControl con noControl:', noControl); // Depuración
  connection.query(`
    SELECT NoControl AS id, Nombre AS name, Correo AS email, Cla_Car AS career
    FROM Alumnos
    WHERE CAST(NoControl AS UNSIGNED) = ?
  `, [noControl], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener alumno', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: `Alumno no encontrado con NoControl: ${noControl}` });
    }
    res.json(results[0]);
  });
});

// Obtener los datos del alumno autenticado para su dashboard (protegida por index.js)
router.get('/dashboard', (req, res) => {
  console.log('Accediendo a GET /alumnos/dashboard'); // Depuración
  const alumnoId = req.user.id; // Obtenido del token JWT por el middleware authenticateToken
  console.log('ID del alumno autenticado:', alumnoId); // Depuración
  console.log('Tipo de alumnoId:', typeof alumnoId); // Depuración

  connection.query(`
    SELECT NoControl AS id, Nombre AS name, Correo AS email, Cla_Car AS career
    FROM Alumnos
    WHERE CAST(NoControl AS UNSIGNED) = ?
  `, [alumnoId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener datos del alumno', details: err });
    }

    console.log('Resultados de la consulta:', results); // Depuración
    if (results.length === 0) {
      return res.status(404).json({ error: `Alumno no encontrado con NoControl: ${alumnoId}` });
    }

    res.json(results[0]);
  });
});

module.exports = router;