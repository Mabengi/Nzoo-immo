import { useState, useEffect } from 'react';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  full_name: string;
}

export const useAuth = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('🔍 Vérification de l\'authentification...');
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        console.log('👤 Utilisateur trouvé dans localStorage:', user);
        setUserProfile(user);
        setIsAdmin(user.role === 'admin');
        console.log('🔐 Est admin:', user.role === 'admin');
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('currentUser');
      }
    } else {
      console.log('❌ Aucun utilisateur dans localStorage');
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUserProfile(null);
    setIsAdmin(false);
  };

  return {
    userProfile,
    loading,
    isAdmin,
    logout
  };
};