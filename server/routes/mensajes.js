const express = require('express');
const router = express.Router();
const connection = require('../config/db');
const { authenticateToken } = require('../middleware/authMiddleware');

// Obtener mensajes agrupados por contacto
router.get('/ver', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const userType = req.user.role;

    const query = `
        SELECT 
            m.*,
            IF(m.remitente_id = ? AND m.remitente_tipo = ?, 
                CONCAT(d.nombre, ' (', m.destinatario_tipo, ')'), 
                CONCAT(r.nombre, ' (', m.remitente_tipo, ')')
            ) AS contacto_nombre,
            IF(m.remitente_id = ? AND m.remitente_tipo = ?, m.destinatario_id, m.remitente_id) AS contacto_id,
            IF(m.remitente_id = ? AND m.remitente_tipo = ?, m.destinatario_tipo, m.remitente_tipo) AS contacto_tipo
        FROM Mensajes m
        LEFT JOIN (
            SELECT NoControl, Nombre FROM Tutores
            UNION ALL
            SELECT NoControl, Nombre FROM Alumnos
        ) r ON r.NoControl = m.remitente_id
        LEFT JOIN (
            SELECT NoControl, Nombre AS nombre FROM Tutores
            UNION ALL
            SELECT NoControl, Nombre FROM Alumnos
        ) d ON d.NoControl = m.destinatario_id
        WHERE (m.remitente_id = ? AND m.remitente_tipo = ?) 
           OR (m.destinatario_id = ? AND m.destinatario_tipo = ?)
        ORDER BY m.fecha_hora DESC
    `;

    connection.query(query, 
        [userId, userType, userId, userType, userId, userType, userId, userType, userId, userType],
        (err, messages) => {
            if (err) {
                console.error('Error al obtener mensajes:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Error al obtener mensajes' 
                });
            }

            // Agrupar mensajes por contacto
            const contactos = {};
            messages.forEach(msg => {
                const contactoKey = `${msg.contacto_id}-${msg.contacto_tipo}`;
                
                if (!contactos[contactoKey]) {
                    contactos[contactoKey] = {
                        contacto_id: msg.contacto_id,
                        contacto_tipo: msg.contacto_tipo,
                        contacto_nombre: msg.contacto_nombre || 'Usuario desconocido',
                        mensajes: []
                    };
                }

                contactos[contactoKey].mensajes.push({
                    id: msg.id,
                    texto: msg.texto,
                    es_mio: msg.remitente_id == userId && msg.remitente_tipo == userType,
                    fecha_hora: msg.fecha_hora,
                    archivo_adjunto: msg.archivo_adjunto
                });
            });

            res.json({
                success: true,
                data: Object.values(contactos)
            });
        }
    );
});

// Enviar mensaje
router.post('/', authenticateToken, (req, res) => {
    const { destinatario_id, destinatario_tipo, texto, archivo_adjunto } = req.body;
    const remitente_id = req.user.id;
    const remitente_tipo = req.user.role;

    // Validaciones básicas
    if (!destinatario_id || !destinatario_tipo || !texto) {
        return res.status(400).json({ 
            success: false,
            message: 'Faltan campos obligatorios' 
        });
    }

    // Verificar que el destinatario existe
    const tablaDestinatario = destinatario_tipo === 'tutor' ? 'Tutores' : 'Alumnos';
    connection.query(
        `SELECT NoControl FROM ${tablaDestinatario} WHERE NoControl = ?`,
        [destinatario_id],
        (err, results) => {
            if (err) {
                console.error('Error al verificar destinatario:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Error al verificar destinatario' 
                });
            }

            if (results.length === 0) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Destinatario no encontrado' 
                });
            }

            // Insertar mensaje
            const insertQuery = `
                INSERT INTO Mensajes 
                (remitente_id, remitente_tipo, destinatario_id, destinatario_tipo, texto, archivo_adjunto)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            connection.query(
                insertQuery,
                [remitente_id, remitente_tipo, destinatario_id, destinatario_tipo, texto, archivo_adjunto || null],
                (err, result) => {
                    if (err) {
                        console.error('Error al enviar mensaje:', err);
                        return res.status(500).json({ 
                            success: false,
                            error: 'Error al enviar mensaje' 
                        });
                    }

                    // Obtener el mensaje recién creado
                    connection.query(
                        `SELECT * FROM Mensajes WHERE id = ?`,
                        [result.insertId],
                        (err, newMessage) => {
                            if (err || newMessage.length === 0) {
                                return res.status(201).json({
                                    success: true,
                                    message: 'Mensaje enviado',
                                    id: result.insertId
                                });
                            }

                            res.status(201).json({
                                success: true,
                                message: 'Mensaje enviado exitosamente',
                                data: newMessage[0]
                            });
                        }
                    );
                }
            );
        }
    );
});

router.post('/comentarios', authenticateToken, (req, res) => {
    const { tutor_id, comentario, rating } = req.body;
    const alumno_id = req.user.id; // Suponiendo que el usuario autenticado es el alumno

    // Validaciones básicas
    if (!tutor_id || !comentario || !rating) {
        return res.status(400).json({ 
            success: false,
            message: 'Faltan campos obligatorios (tutor_id, comentario, rating)' 
        });
    }

    // Validar que el rating esté en un rango válido (ej. 0.0 a 5.0)
    if (rating < 0.0 || rating > 5.0) {
        return res.status(400).json({ 
            success: false,
            message: 'El rating debe estar entre 0.0 y 5.0' 
        });
    }

    // Verificar que el tutor existe
    connection.query(
        'SELECT NoControl FROM Tutores WHERE NoControl = ?',
        [tutor_id],
        (err, tutorResults) => {
            if (err) {
                console.error('Error al verificar tutor:', err);
                return res.status(500).json({ 
                    success: false,
                    error: 'Error al verificar tutor' 
                });
            }

            if (tutorResults.length === 0) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Tutor no encontrado' 
                });
            }

            // Verificar que el alumno existe (el usuario autenticado)
            connection.query(
                'SELECT NoControl FROM Alumnos WHERE NoControl = ?',
                [alumno_id],
                (err, alumnoResults) => {
                    if (err) {
                        console.error('Error al verificar alumno:', err);
                        return res.status(500).json({ 
                            success: false,
                            error: 'Error al verificar alumno' 
                        });
                    }

                    if (alumnoResults.length === 0) {
                        return res.status(404).json({ 
                            success: false,
                            message: 'Alumno no encontrado' 
                        });
                    }

                    // Insertar comentario
                    const insertQuery = `
                        INSERT INTO Comentarios_Tutor 
                        (Tutor, Alumno, Comentario, Rating)
                        VALUES (?, ?, ?, ?)
                    `;

                    connection.query(
                        insertQuery,
                        [tutor_id, alumno_id, comentario, rating],
                        (err, result) => {
                            if (err) {
                                console.error('Error al insertar comentario:', err);
                                return res.status(500).json({ 
                                    success: false,
                                    error: 'Error al insertar comentario' 
                                });
                            }

                            // Obtener el comentario recién creado
                            connection.query(
                                `SELECT * FROM Comentarios_Tutor WHERE ID = ?`,
                                [result.insertId],
                                (err, newComment) => {
                                    if (err || newComment.length === 0) {
                                        return res.status(201).json({
                                            success: true,
                                            message: 'Comentario agregado',
                                            id: result.insertId
                                        });
                                    }

                                    res.status(201).json({
                                        success: true,
                                        message: 'Comentario agregado exitosamente',
                                        data: newComment[0]
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

router.get('/ver/comentarios', authenticateToken, (req, res) => {
  const tutor_id = req.query.tutor_id; // Obtener tutor_id desde los parámetros de la consulta

  if (!tutor_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'El parámetro tutor_id es requerido' 
    });
  }

  // Consultar los comentarios del tutor directamente
  const query = `
    SELECT 
      c.ID,
      c.Comentario,
      c.Rating,
      a.Nombre AS author
    FROM Comentarios_Tutor c
    JOIN Alumnos a ON c.Alumno = a.NoControl
    WHERE c.Tutor = ?
  `;

  connection.query(query, [tutor_id], (err, results) => {
    if (err) {
      console.error('Error al obtener comentarios:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Error al obtener comentarios',
        details: err.message 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: results 
    });
  });
});

router.get('/schedule',  (req, res) => {
    const NoControl = req.query.tutor_id;
    if (!NoControl) {
      return res.status(400).json({ message: 'El parámetro NoControl es requerido' });
    }

    // Consultar la tabla Horarios_Tutores para el tutor específico
    const [rows] = connection.execute(
      'SELECT Dia, Hora, Estado FROM Horarios_Tutores WHERE NoControl_Tutor = ?',
      [NoControl]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró horario para este tutor' });
    }

    // Generar el horario completo
    const fullSchedule = generateFullSchedule(rows);

    res.status(200).json({ data: fullSchedule });
});


module.exports = router;