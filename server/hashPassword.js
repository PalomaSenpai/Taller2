const bcrypt = require('bcrypt');

const password = 'Pruebas123';
const saltRounds = 10; // Número de rondas de sal, 10 es un buen estándar

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error al generar el hash:', err);
    return;
  }
  console.log('Hash generado:', hash);
});