import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importa Router, Routes y Route
import LoginPage from './componentes/LoginPage';

function App() {
  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("/api")
      .then(response => response.json())
      .then(data => {
        setBackendData(data);
      });
  }, []);

  return (
    <Router> {/* Envuelve todo en BrowserRouter */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Otras rutas pueden ir aquí */}
      </Routes>
    </Router>
  );
}

export default App;