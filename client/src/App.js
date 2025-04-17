import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importa Router, Routes y Route
import LoginPage from './componentes/LoginPage';
import Home from './componentes/Sidebar';
import Layout from './layouts/layout';

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
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        {/* Otras rutas pueden ir aquí */}
      </Routes>
    </Router>
  );
}

export default App;