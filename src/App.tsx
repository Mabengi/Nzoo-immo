import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SpacesPage from './pages/SpacesPage';
import ReservationPage from './pages/ReservationPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header 
          language={language} 
          setLanguage={setLanguage}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <Routes>
          <Route path="/" element={<HomePage language={language} />} />
          <Route path="/spaces" element={<SpacesPage language={language} />} />
          <Route path="/reservation/:spaceType" element={<ReservationPage language={language} />} />
          <Route path="/admin/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} language={language} />} />
          <Route 
            path="/admin/dashboard" 
            element={
              isAuthenticated ? 
                <AdminDashboard language={language} /> : 
                <LoginPage setIsAuthenticated={setIsAuthenticated} language={language} />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;