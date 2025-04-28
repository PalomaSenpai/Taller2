const express = require('express');
const router = express.Router();
const tutoresRouter = require('./tutores');
const authRouter = require('./auth');
const alumnosRouter = require('./alumnos');
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');

// Rutas públicas (no requieren autenticación)
router.use('/tutores', tutoresRouter);
router.use('/tutores/:id', tutoresRouter);

// Rutas protegidas (requieren autenticación)
router.use('/alumno', authenticateToken, alumnosRouter);
router.use('/tutor', authenticateToken, checkRole('tutor') ,tutoresRouter);
router.use('/auth', authRouter);

module.exports = router;