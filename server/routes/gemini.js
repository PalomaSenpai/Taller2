const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Recupera la API Key de las variables de entorno
const API_KEY = process.env.IA_API;

// Asegúrate de que la API Key esté disponible
if (!API_KEY) {
    console.error("Error: La clave de API de Gemini no está definida. Asegúrate de tenerla en tu archivo .env");
    // En un entorno de producción, considera una forma más robusta de manejar esto,
    // como lanzar un error que impida que el servidor se inicie si la clave es crítica.
}

// Inicializa el cliente de Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

// --- Endpoint para el Asistente de Alumnos (Preguntas y Respuestas) ---
// Este endpoint responderá a /api/gemini/ask
router.post('/ask', async (req, res) => {
    try {
        const { prompt, subject } = req.body; // 'subject' es opcional, para dar contexto

        if (!prompt) {
            return res.status(400).json({ error: 'El campo "prompt" es requerido.' });
        }

        // Selecciona el modelo. Gemini 1.5 Flash es una buena opción por su velocidad y costo.
        // Para conversaciones más largas o complejas, considera "gemini-1.5-pro".
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Puedes mejorar el prompt para guiar a Gemini
        let fullPrompt = `Como asistente de aprendizaje para estudiantes, responde a la siguiente pregunta: ${prompt}`;
        if (subject) {
            fullPrompt = `Como asistente de aprendizaje para estudiantes en la materia de ${subject}, responde a la siguiente pregunta: ${prompt}`;
        }

        // Si deseas mantener un historial de conversación para un chatbot,
        // la lógica sería un poco más compleja, quizás almacenando el historial
        // en la sesión del usuario o en la base de datos. Por ahora, es una solicitud independiente.
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ answer: text });

    } catch (error) {
        console.error('Error al comunicarse con la API de Gemini en /api/gemini/ask:', error);
        // Envía un error más genérico al cliente por seguridad
        res.status(500).json({
            error: 'Error interno del servidor al procesar tu solicitud con Gemini. Por favor, inténtalo de nuevo más tarde.',
            // En un entorno de producción, evita enviar 'details' al cliente
            details: error.message
        });
    }
});

// --- Endpoint para generar problemas de práctica (ejemplo adicional) ---
// Este endpoint responderá a /api/gemini/generate-practice-problem
router.post('/generate-practice-problem', async (req, res) => {
    try {
        const { topic, difficulty = 'intermedio', type = 'ejercicio' } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'El campo "topic" es requerido.' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const problemPrompt = `Genera un ${type} de <span class="math-inline">\{difficulty\} sobre el tema de "</span>{topic}". El ${type} debe ser claro, y si es un problema, no incluyas la solución.`;

        const result = await model.generateContent(problemPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ problem: text });

    } catch (error) {
        console.error('Error al generar problema de práctica con Gemini:', error);
        res.status(500).json({
            error: 'Error interno del servidor al generar el problema de práctica.',
            details: error.message
        });
    }
});

module.exports = router;