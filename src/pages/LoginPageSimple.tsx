import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface LoginPageSimpleProps {
  setIsAuthenticated: (auth: boolean) => void;
}

const LoginPageSimple: React.FC<LoginPageSimpleProps> = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('🔍 Tentative de connexion avec:', credentials.username);
      
      // Vérifier d'abord les identifiants par défaut (priorité absolue)
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        console.log('✅ Connexion admin par défaut réussie - bypass DB');
        
        const adminUser = {
          id: 'admin-001',
          username: 'admin',
          email: 'admin@nzooimmo.com',
          role: 'admin',
          full_name: 'Administrateur'
        };
        
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        setIsAuthenticated(true);
        navigate('/admin/dashboard');
        return;
      }
      
      // Si ce n'est pas l'admin par défaut, essayer la base de données
      console.log('🔍 Recherche utilisateur dans la base de données...');
      
      let userData = null;
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('username', credentials.username)
          .eq('is_active', true)
          .limit(1);

        if (error) {
          console.error('❌ Erreur de requête DB:', error);
          throw new Error(`Erreur DB: ${error.message}`);
        }

        userData = data;
        console.log('📊 Résultat DB:', userData?.length || 0, 'utilisateur(s) trouvé(s)');
        
      } catch (dbError) {
        console.error('❌ Erreur de connexion DB:', dbError);
        setError('Erreur de connexion à la base de données');
        return;
      }

      // Vérifier si l'utilisateur existe
      if (!userData || userData.length === 0) {
        console.log('❌ Utilisateur non trouvé dans la DB:', credentials.username);
        setError('Nom d\'utilisateur ou mot de passe incorrect');
        return;
      }

      const user = userData[0];
      console.log('👤 Utilisateur trouvé dans DB:', user.username);
      console.log('🔍 Password hash in DB:', user.password_hash);
      console.log('🔍 Password entered:', credentials.password);
      
      // Vérifier le mot de passe
      const isPasswordValid = user.password_hash === credentials.password;

      if (!isPasswordValid) {
        console.log('❌ Mot de passe incorrect pour:', user.username);
        setError('Nom d\'utilisateur ou mot de passe incorrect');
        return;
      }

      console.log('✅ Connexion DB réussie pour:', user.username);
      
      // Stocker les informations utilisateur
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        full_name: user.full_name
      }));
      
      setIsAuthenticated(true);
      navigate('/admin/dashboard');
      
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err instanceof Error ? err.message : 'Erreur de connexion inconnue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-nzoo flex items-center justify-center py-12 px-4 font-poppins">
      <div className="max-w-md w-full">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-nzoo-white rounded-2xl flex items-center justify-center mb-6 shadow-nzoo">
            <img 
              src="/logo_nzooimmo.svg" 
              alt="Nzoo Immo" 
              className="h-12 w-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden text-2xl font-bold text-nzoo-dark font-montserrat">
              NI
            </div>
          </div>
          <h1 className="text-3xl font-bold text-nzoo-white mb-2 font-montserrat">
            Connexion
          </h1>
          <p className="text-nzoo-white/80 font-poppins">
            Accédez à votre tableau de bord administrateur
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="bg-nzoo-white rounded-3xl shadow-nzoo-hover p-8 backdrop-blur-sm border border-nzoo-white/20">
          {/* Informations de démonstration */}
          <div className="mb-6 p-4 bg-nzoo-gray/30 border border-nzoo-gray rounded-2xl">
            <h3 className="text-nzoo-dark font-semibold mb-2 font-montserrat text-sm">
              Compte de démonstration
            </h3>
            <div className="text-nzoo-dark/70 text-sm space-y-1 font-poppins">
              <p><span className="font-medium">Nom d'utilisateur:</span> admin</p>
              <p><span className="font-medium">Mot de passe:</span> admin123</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-poppins animate-slideDown">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  {error}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-nzoo-dark mb-2 font-montserrat">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Entrez votre nom d'utilisateur"
                  value={credentials.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-nzoo-gray rounded-xl focus:border-nzoo-dark focus:ring-4 focus:ring-nzoo-dark/10 transition-all duration-300 font-poppins placeholder-nzoo-dark/40 bg-nzoo-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-nzoo-dark mb-2 font-montserrat">
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Entrez votre mot de passe"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-nzoo-gray rounded-xl focus:border-nzoo-dark focus:ring-4 focus:ring-nzoo-dark/10 transition-all duration-300 font-poppins placeholder-nzoo-dark/40 bg-nzoo-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-nzoo text-nzoo-white py-4 px-6 rounded-xl hover:shadow-nzoo-hover focus:outline-none focus:ring-4 focus:ring-nzoo-dark/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold font-montserrat text-lg transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-nzoo-white border-t-transparent rounded-full"></div>
                  <span className="font-poppins">Connexion en cours...</span>
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-nzoo-gray">
            <div className="flex items-center justify-center text-sm text-nzoo-dark/60 font-poppins">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Connexion sécurisée SSL
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-nzoo-white/60 text-sm font-poppins">
            © 2025 Nzoo Immo. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPageSimple;