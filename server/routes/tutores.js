const express = require('express');
const router = express.Router();
const connection = require('../config/db');

router.get('/', (req, res) => {
  connection.query('SELECT * FROM Tutores', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener tutores', details: err });
    }
    res.json(results);
  });
});

module.exports = router;