import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SpacesPage from './pages/SpacesPage';
import ReservationPage from './pages/ReservationPage';
import LoginPageSimple from './pages/LoginPageSimple';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [language, setLanguage] = React.useState<'fr' | 'en'>('fr');
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Vérifier l'authentification au chargement
  React.useEffect(() => {
    console.log('🔍 App - Vérification authentification...');
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      console.log('✅ App - Utilisateur connecté trouvé');
      setIsAuthenticated(true);
    } else {
      console.log('❌ App - Aucun utilisateur connecté');
    }
  }, []);
  return (
    <Router>
      <Header 
        language={language}
        setLanguage={setLanguage}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Routes>
        {/* Page d'accueil */}
        <Route 
          path="/" 
          element={<HomePage />} 
        />
        
        {/* Page des espaces */}
        <Route 
          path="/spaces" 
          element={<SpacesPage language={language} />} 
        />
        
        {/* Routes d'administration */}
        <Route 
          path="/admin/login" 
          element={<LoginPageSimple setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            isAuthenticated ? (
              <AdminDashboard language={language} />
            ) : (
              <LoginPageSimple setIsAuthenticated={setIsAuthenticated} />
            )
          } 
        />
        
        {/* Routes pour les différents types d'espaces */}
        <Route 
          path="/reservation/coworking" 
          element={<ReservationPage language={language} spaceType="coworking" />} 
        />
        <Route 
          path="/reservation/bureau-prive" 
          element={<ReservationPage language={language} spaceType="bureau-prive" />} 
        />
        <Route 
          path="/reservation/domiciliation" 
          element={<ReservationPage language={language} spaceType="domiciliation" />} 
        />
        
        {/* Routes en anglais */}
        <Route 
          path="/en" 
          element={<HomePage />} 
        />
        <Route 
          path="/en/spaces" 
          element={<SpacesPage language={language} />} 
        />
        <Route 
          path="/en/reservation/coworking" 
          element={<ReservationPage language={language} spaceType="coworking" />} 
        />
        <Route 
          path="/en/reservation/bureau-prive" 
          element={<ReservationPage language={language} spaceType="bureau-prive" />} 
        />
        <Route 
          path="/en/reservation/domiciliation" 
          element={<ReservationPage language={language} spaceType="domiciliation" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;