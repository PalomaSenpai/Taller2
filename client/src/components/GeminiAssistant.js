import React, { useState, useEffect } from 'react';
import './GeminiAssistant.css'; // Opcional: para estilos CSS específicos

function GeminiAssistant() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('Escribe tu pregunta para TutoIA...');
  const [displayedResponse, setDisplayedResponse] = useState(''); // Para el efecto de escritura
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typingIndex, setTypingIndex] = useState(0); // Índice para el efecto de escritura

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError('Por favor, ingresa una pregunta.');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse('Generando respuesta...');
    setDisplayedResponse(''); // Reinicia el texto mostrado
    setTypingIndex(0); // Reinicia el índice de escritura

    try {
      const res = await fetch(`${BACKEND_URL}/api/gemini/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Ocurrió un error en el servidor.');
      }

      setResponse(data.answer); // Almacena la respuesta completa
      setPrompt(''); // Limpia el input
    } catch (err) {
      console.error('Error al llamar a la API de Gemini:', err);
      setError(err.message || 'No se pudo obtener una respuesta de Gemini.');
      setResponse('Lo siento, hubo un problema al obtener la respuesta.');
    } finally {
      setLoading(false);
    }
  };

  // Efecto de escritura
  useEffect(() => {
    if (!loading && response && response !== 'Escribe tu pregunta para TutoIA...' && response !== 'Generando respuesta...' && response !== 'Lo siento, hubo un problema al obtener la respuesta.') {
      const typingInterval = setInterval(() => {
        if (typingIndex < response.length) {
          setDisplayedResponse((prev) => prev + response.charAt(typingIndex));
          setTypingIndex((prev) => prev + 1);
        } else {
          clearInterval(typingInterval);
        }
      }, 30); // Ajusta la velocidad (30ms por carácter)

      return () => clearInterval(typingInterval);
    }
  }, [loading, response, typingIndex]);

  return (
    <div className="gemini-assistant-container">
      <h2>Asistente de Estudio</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Hazme una pregunta sobre tu materia..."
          rows="6"
          disabled={loading}
        ></textarea>
        <button type="submit" disabled={loading}>
          {loading ? 'Pensando...' : 'Preguntar a TutoIA'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div className="gemini-response-box">
        <h3>Respuesta:</h3>
        <p className="response-text">
          {displayedResponse}
          {!loading && typingIndex < response.length && <span className="typing-cursor" />}
        </p>
      </div>
    </div>
  );
}

export default GeminiAssistant;