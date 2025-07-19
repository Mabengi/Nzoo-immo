import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, User, LogOut } from 'lucide-react';

interface HeaderProps {
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const translations = {
    fr: {
      home: 'Accueil',
      reservation: 'Réservation',
      admin: 'Administration',
      logout: 'Déconnexion'
    },
    en: {
      home: 'Home',
      reservation: 'Reservation',
      admin: 'Administration',
      logout: 'Logout'
    }
  };

  const t = translations[language];

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-sky-light-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/logo.jpg" 
              alt="Nzoo Immo" 
              className="h-16 w-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden text-2xl font-bold text-sky-light-500">
                Nzoo Immo
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-sky-light-500 font-medium transition-colors duration-200"
            >
              {t.home}
            </Link>
            <Link 
              to="/spaces" 
              className="text-gray-700 hover:text-sky-light-500 font-medium transition-colors duration-200"
            >
              Espaces
            </Link>
            <Link 
              to="/reservation/coworking" 
              className="text-gray-700 hover:text-sky-light-500 font-medium transition-colors duration-200"
            >
              {t.reservation}
            </Link>
            {isAuthenticated && (
              <Link 
                to="/admin/dashboard" 
                className="text-gray-700 hover:text-sky-light-500 font-medium transition-colors duration-200"
              >
                {t.admin}
              </Link>
            )}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language switcher */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
                className="bg-transparent border-none text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
              </select>
            </div>

            {/* Admin controls */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-sky-light-500 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center space-x-2 text-gray-700 hover:text-sky-light-500 transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;