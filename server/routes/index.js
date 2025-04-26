const express = require('express');
const router = express.Router();
const tutoresRouter = require('./tutores');
const authRouter = require('./auth');
const alumnosRouter = require('./alumnos');
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');

router.use('/tutores', authenticateToken,tutoresRouter);
router.use('/alumnos', authenticateToken, alumnosRouter);
router.use('/auth', authRouter)

// Aquí puedes agregar más rutas en el futuro, por ejemplo:
// const alumnosRouter = require('./alumnos');
// router.use('/alumnos', alumnosRouter);

module.exports = router;