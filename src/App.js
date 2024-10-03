// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './login/login';
import RegisterForm from './login/Register'; 
import App2 from './App2';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('username'));

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginForm onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/ListTasks" />} />
        <Route path="/register" element={<RegisterForm />} /> 
        <Route path="/ListTasks" element={isAuthenticated ? <App2 onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
