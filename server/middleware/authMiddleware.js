const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado: Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto');
    console.log('Token decodificado:', decoded); // Depuración
    req.user = decoded; // Almacena los datos del usuario decodificados (id, role)
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

const checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role) { // Cambiar "type" por "role"
    return res.status(403).json({ message: `Acceso denegado: Se requiere rol ${role}` });
  }
  next();
};

module.exports = { authenticateToken, checkRole };