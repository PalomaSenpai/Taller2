const express = require('express');
const router = express.Router();

// Importa tus rutas existentes
const tutoresRouter = require('./tutores');
const authRouter = require('./auth');
const alumnosRouter = require('./alumnos');
const mensajesRouter = require('./mensajes');

// ¡Importa las nuevas rutas de Gemini!
const geminiRouter = require('./gemini'); // Asumiendo que el archivo se llama gemini.js

const { authenticateToken, checkRole } = require('../middleware/authMiddleware');

// Rutas públicas (no requieren autenticación)
router.use('/tutores', tutoresRouter);
router.use('/tutores/:id', tutoresRouter); // Asegúrate de que esto no entre en conflicto si tutoresRouter ya maneja :id

// ¡Añade las rutas de Gemini aquí!
// Generalmente, las rutas de IA no requieren autenticación estricta para el alumno,
// pero puedes añadirla si lo consideras necesario para tu modelo de negocio o límites de uso.
// Aquí lo dejaremos sin autenticación por ahora, asumiendo que el alumno
// necesita acceso fácil al asistente.
router.use('/gemini', geminiRouter);

// Rutas protegidas (requieren autenticación)
router.use('/mensajes', authenticateToken, mensajesRouter); // Ya estaba así
router.use('/alumno', authenticateToken, alumnosRouter);
router.use('/tutor', authenticateToken, checkRole('tutor') ,tutoresRouter); // Asegúrate de que esto no entre en conflicto con la ruta pública de /tutores
router.use('/auth', authRouter); // Generalmente, las rutas de autenticación no tienen authenticateToken aquí

module.exports = router;