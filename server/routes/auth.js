const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection = require('../config/db');

router.post('/tutor/login', (req, res, next) => {
  console.log('Petición recibida en /tutor/login:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Faltan email o contraseña en /tutor/login');
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  console.log('Consultando la base de datos para tutor con email:', email);
  connection.query('SELECT * FROM Tutores WHERE Correo = ?', [email], (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL para tutor:', err);
      return next(err);
    }
    console.log('Resultados de la consulta para tutor:', results);
    if (results.length === 0) {
      console.log('No se encontró tutor con ese email');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const tutor = results[0];
    if (!tutor.Contra) {
      console.error('El campo Contra está vacío para tutor:', tutor);
      return next(new Error('El campo Contra está vacío en la base de datos'));
    }
    console.log('Comparando contraseña para tutor');
    bcrypt.compare(password, tutor.Contra, (err, isMatch) => {
      if (err) {
        console.error('Error al comparar contraseña para tutor:', err);
        return next(err);
      }
      if (!isMatch) {
        console.log('Contraseña incorrecta para tutor');
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
      console.log('Generando token para tutor');
      const token = jwt.sign({ id: tutor.NoControl, type: 'tutor' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  });
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
      const token = jwt.sign({ id: alumno.NoControl, type: 'alumno' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

module.exports = router;