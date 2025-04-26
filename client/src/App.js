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
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;