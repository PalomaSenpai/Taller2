import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'; // Importa Router, Routes y Route
import TutorDetails from './views/TutorDetailsView';
import Home from './views/HomeView';
import Sidebar from './componentes/Sidebar';
import Messages from './views/Messages';

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
    <BrowserRouter>
    <div className="flex">
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/tutor/:id" element={<TutorDetails />} />
        <Route path="/messages" element={<Messages />} />
      </Routes> 
    </div>
    </BrowserRouter>
  );
}

export default App;