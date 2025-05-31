import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './views/LoginPage/LoginPage';
import HomeView from './views/HomeView/HomeView';
import Messages from './views/Messages/Messages';
import TutorDetailView from './views/HomeView/TutorDetailView/TutorDetailsView';
//import Subjects from './views/Subjects/Subjects'; // Asegúrate de crear este componente
//import Settings from './views/Settings/Settings'; // Asegúrate de crear este componente
import Profile from './views/Profile/Profile'; // Asegúrate de crear este componente
import Sidebar from './components/Sidebar';
import GeminiAssistant from './components/GeminiAssistant';
import Materias from './views/Materias/Materias'; // Asegúrate de crear este componente
import TutorDashboard from './views/TutorDash/TutorDashboard'; // Asegúrate de crear este componente
import TutorMaterias from './views/TutorMaterias/TutorMaterias';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><HomeView /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/tutor/:id" element={<PrivateRoute><TutorDetailView /></PrivateRoute>} />
          <Route path="/tutoIA" element={<PrivateRoute><GeminiAssistant /></PrivateRoute>} />
          <Route path="/materias" element={<PrivateRoute><Materias /></PrivateRoute>} />
          <Route path="/tutor-dashboard" element={<PrivateRoute><TutorDashboard /></PrivateRoute>} />
          <Route path="/tutor-materias" element={<PrivateRoute><TutorMaterias /></PrivateRoute>} />
          {/* Rutas adicionales para tutores */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;