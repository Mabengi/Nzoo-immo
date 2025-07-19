import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield } from 'lucide-react';

interface LoginPageProps {
  setIsAuthenticated: (auth: boolean) => void;
  language: 'fr' | 'en';
}

const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated, language }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const translations = {
    fr: {
      title: 'Connexion Administrateur',
      subtitle: 'Accédez à votre tableau de bord',
      username: 'Nom d\'utilisateur',
      password: 'Mot de passe',
      login: 'Se connecter',
      loggingIn: 'Connexion...',
      error: 'Nom d\'utilisateur ou mot de passe incorrect',
      security: 'Connexion sécurisée SSL',
      demo: {
        title: 'Compte de démonstration',
        username: 'admin',
        password: 'admin123'
      }
    },
    en: {
      title: 'Admin Login',
      subtitle: 'Access your dashboard',
      username: 'Username',
      password: 'Password',
      login: 'Login',
      loggingIn: 'Logging in...',
      error: 'Invalid username or password',
      security: 'Secure SSL Connection',
      demo: {
        title: 'Demo Account',
        username: 'admin',
        password: 'admin123'
      }
    }
  };

  const t = translations[language];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        setIsAuthenticated(true);
        navigate('/admin/dashboard');
      } else {
        setError(t.error);
      }
      setIsLoading(false);
    }, 1500);
  };

  const fillDemoCredentials = () => {
    setCredentials({
      username: 'admin',
      password: 'admin123'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-light-400 via-sky-light-500 to-sky-light-600 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-sky-light-500" />
          </div>
          <h2 className="text-3xl font-bold text-white">{t.title}</h2>
          <p className="mt-2 text-sky-light-100">{t.subtitle}</p>
        </div>

        {/* Demo Account Info */}
        <div className="bg-sky-light-400 bg-opacity-20 backdrop-blur-sm rounded-lg p-4 border border-sky-light-300 border-opacity-30">
          <h3 className="text-white font-medium mb-2">{t.demo.title}</h3>
          <div className="text-sky-light-100 text-sm space-y-1">
            <p><span className="font-medium">{t.username}:</span> {t.demo.username}</p>
            <p><span className="font-medium">{t.password}:</span> {t.demo.password}</p>
          </div>
          <button
            onClick={fillDemoCredentials}
            className="mt-2 text-xs text-sky-light-200 hover:text-white underline"
          >
            Utiliser ces identifiants
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                {t.username}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-light-400 focus:border-transparent transition-colors"
                  placeholder={t.username}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t.password}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-light-400 focus:border-transparent transition-colors"
                  placeholder={t.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-light-400 hover:bg-sky-light-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-light-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  {t.loggingIn}
                </>
              ) : (
                t.login
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Shield className="h-4 w-4 mr-2" />
              {t.security}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;