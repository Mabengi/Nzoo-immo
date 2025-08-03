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
    console.log('🚪 Déconnexion...');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-nzoo-white/95 backdrop-blur-md border-b border-nzoo-gray/30 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/logo_nzooimmo.svg" 
              alt="Nzoo Immo" 
              className="h-12 w-auto object-contain transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden text-2xl font-bold text-nzoo-dark font-montserrat">
              Nzoo Immo
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-nzoo-dark/70 hover:text-nzoo-dark font-medium transition-colors duration-300 font-poppins relative group"
            >
              <span className="relative z-10">{t.home}</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-nzoo-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>
            <Link 
              to="/spaces" 
              className="text-nzoo-dark/70 hover:text-nzoo-dark font-medium transition-colors duration-300 font-poppins relative group"
            >
              <span className="relative z-10">Espaces</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-nzoo-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>
            <Link 
              to="/reservation/coworking" 
              className="text-nzoo-dark/70 hover:text-nzoo-dark font-medium transition-colors duration-300 font-poppins relative group"
            >
              <span className="relative z-10">{t.reservation}</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-nzoo-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>
            {isAuthenticated && (
              <Link 
                to="/admin/dashboard" 
                className="text-nzoo-dark/70 hover:text-nzoo-dark font-medium transition-colors duration-300 font-poppins relative group"
              >
                <span className="relative z-10">{t.admin}</span>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-nzoo-dark transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>
            )}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language switcher */}
            <div className="flex items-center space-x-2 bg-nzoo-gray/20 rounded-xl px-3 py-2">
              <Globe className="w-4 h-4 text-nzoo-dark/60" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
                className="bg-transparent border-none text-sm font-medium text-nzoo-dark focus:outline-none cursor-pointer font-poppins"
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
              </select>
            </div>

            {/* Admin controls */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-nzoo-dark/70 hover:text-nzoo-dark transition-colors duration-300 bg-nzoo-gray/20 hover:bg-nzoo-gray/40 rounded-xl px-4 py-2 font-poppins"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t.logout}</span>
              </button>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center space-x-2 text-nzoo-dark/70 hover:text-nzoo-dark transition-colors duration-300 bg-nzoo-gray/20 hover:bg-nzoo-gray/40 rounded-xl px-4 py-2 font-poppins"
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