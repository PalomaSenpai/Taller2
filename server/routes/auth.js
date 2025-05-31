const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = require('../config/db');

router.post('/tutor/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
  }

  connection.query(
    'SELECT * FROM Tutores WHERE Correo = ?',
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error en el servidor', error: err });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
      }

      const tutor = results[0];

      const isMatch = await bcrypt.compare(password, tutor.Contra);

      if (!isMatch) {
        return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
      }

      const token = jwt.sign(
        { id: tutor.NoControl, role: 'tutor' },
        process.env.JWT_SECRET || 'your_jwt_secret', // Asegúrate de que coincida con el middleware
        { expiresIn: '1h' }
      );

      res.json({ token });
    }
  );
});

router.post('/alumno/login', (req, res, next) => {
  console.log('Petición recibida en /alumno/login:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Faltan email o contraseña en /alumno/login');
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  console.log('Consultando la base de datos para alumno con email:', email);
  connection.query('SELECT * FROM Alumnos WHERE Correo = ?', [email], (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL para alumno:', err);
      return next(err);
    }
    console.log('Resultados de la consulta para alumno:', results);
    if (results.length === 0) {
      console.log('No se encontró alumno con ese email');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const alumno = results[0];
    if (!alumno.Contra) {
      console.error('El campo Contra está vacío para alumno:', alumno);
      return next(new Error('El campo Contra está vacío en la base de datos'));
    }
    console.log('Comparando contraseña para alumno');
    bcrypt.compare(password, alumno.Contra, (err, isMatch) => {
      if (err) {
        console.error('Error al comparar contraseña para alumno:', err);
        return next(err);
      }
      if (!isMatch) {
        console.log('Contraseña incorrecta para alumno');
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
      console.log('Generando token para alumno');
      const token = jwt.sign(
        { id: alumno.NoControl, role: 'alumno' },
        process.env.JWT_SECRET || 'your_jwt_secret', // Asegúrate de que coincida con el middleware
        { expiresIn: '1h' }
      );

      console.log('Datos del token creado para alumno:', {
        id: alumno.NoControl,
        role: 'alumno'
      });
      console.log('Token generado para alumno:', token);
      res.json({ token });
    });
  });
});



module.exports = router;