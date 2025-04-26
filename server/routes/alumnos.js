const express = require('express');
const router = express.Router();
const connection = require('../config/db');

// Obtener la lista de todos los alumnos
router.get('/', (req, res) => {
  connection.query('SELECT * FROM Alumnos', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener alumnos', details: err });
    }
    res.json(results);
  });
});

// Obtener los detalles de un alumno específico por NoControl
router.get('/:noControl', (req, res) => {
  const { noControl } = req.params;
  connection.query('SELECT * FROM Alumnos WHERE NoControl = ?', [noControl], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener alumno', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    res.json(results[0]);
  });
});

module.exports = router;