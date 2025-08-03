import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Calendar, 
  DollarSign, 
  Users, 
  Building, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Bell,
  Settings,
  PieChart,
  Activity,
  RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useReservations } from '../hooks/useReservations';
import SpaceManagementForm from '../components/SpaceManagementForm';
import ReservationManagement from '../components/ReservationManagement';
import UserManagement from '../components/UserManagement';

interface AdminDashboardProps {
  language: 'fr' | 'en';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // today, week, month, all
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  // Utiliser le hook pour récupérer les vraies données
  const { reservations, loading, error, refetch } = useReservations();

  // Fonction pour rafraîchir les données
  const handleRefresh = async () => {
    console.log('🔄 Refreshing dashboard data...');
    await refetch();
    setLastRefresh(new Date());
  };

  // Auto-refresh des données toutes les 30 secondes
  useEffect(() => {
    // Désactiver l'auto-refresh automatique pour éviter les actualisations constantes
    // const interval = setInterval(() => {
    //   console.log('🔄 Auto-refreshing dashboard data...');
    //   refetch();
    //   setLastRefresh(new Date());
    // }, 30000); // 30 secondes

    // return () => clearInterval(interval);
  }, [refetch]);

  const translations = {
    fr: {
      title: 'Tableau de Bord Administrateur',
      subtitle: 'Gérez vos réservations et suivez vos performances',
      tabs: {
        overview: 'Vue d\'ensemble',
        reservations: 'Réservations',
        reservationManagement: 'Gestion Réservations',
        revenue: 'Revenus',
        clients: 'Clients',
        statistics: 'Statistiques',
        users: 'Utilisateurs'
      },
      stats: {
        totalReservations: 'Réservations Totales',
        totalRevenue: 'Revenus Totaux',
        todayReservations: 'Réservations Aujourd\'hui',
        weekReservations: 'Cette Semaine',
        monthReservations: 'Ce Mois',
        averageAmount: 'Montant Moyen',
        coworkingRevenue: 'Revenus Coworking',
        privateOfficeRevenue: 'Revenus Bureau Privé',
        meetingRoomRevenue: 'Revenus Salle Réunion'
      },
      reservations: {
        pending: 'En Attente',
        confirmed: 'Confirmées',
        cancelled: 'Annulées',
        completed: 'Terminées',
        all: 'Toutes'
      },
      filters: {
        today: 'Aujourd\'hui',
        week: 'Cette semaine',
        month: 'Ce mois',
        all: 'Toutes'
      },
      actions: {
        export: 'Exporter',
        contact: 'Contacter',
        approve: 'Approuver',
        reject: 'Rejeter',
        view: 'Voir',
        edit: 'Modifier',
        delete: 'Supprimer',
        add: 'Ajouter',
        search: 'Rechercher...',
        filter: 'Filtrer'
      },
      charts: {
        revenueByType: 'Revenus par Type d\'Espace',
        reservationsOverTime: 'Évolution des Réservations',
        dailyStats: 'Statistiques Quotidiennes'
      },
      clients: {
        totalClients: 'Total Clients',
        newThisMonth: 'Nouveaux ce mois',
        topClients: 'Meilleurs Clients'
      }
    },
    en: {
      title: 'Admin Dashboard',
      subtitle: 'Manage your reservations and track your performance',
      tabs: {
        overview: 'Overview',
        reservations: 'Reservations',
        reservationManagement: 'Reservation Management',
        revenue: 'Revenue',
        clients: 'Clients',
        statistics: 'Statistics',
        users: 'Users'
      },
      stats: {
        totalReservations: 'Total Reservations',
        totalRevenue: 'Total Revenue',
        todayReservations: 'Today\'s Reservations',
        weekReservations: 'This Week',
        monthReservations: 'This Month',
        averageAmount: 'Average Amount',
        coworkingRevenue: 'Coworking Revenue',
        privateOfficeRevenue: 'Private Office Revenue',
        meetingRoomRevenue: 'Meeting Room Revenue'
      },
      reservations: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        cancelled: 'Cancelled',
        completed: 'Completed',
        all: 'All'
      },
      filters: {
        today: 'Today',
        week: 'This week',
        month: 'This month',
        all: 'All'
      },
      actions: {
        export: 'Export',
        contact: 'Contact',
        approve: 'Approve',
        reject: 'Reject',
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
        add: 'Add',
        search: 'Search...',
        filter: 'Filter'
      },
      charts: {
        revenueByType: 'Revenue by Space Type',
        reservationsOverTime: 'Reservations Over Time',
        dailyStats: 'Daily Statistics'
      },
      clients: {
        totalClients: 'Total Clients',
        newThisMonth: 'New This Month',
        topClients: 'Top Clients'
      }
    }
  };

  const t = translations[language];

  // Fonctions de calcul des statistiques
  const calculateStats = () => {
    console.log('📊 Calculating stats with reservations:', reservations.length);
    
    if (!reservations.length) {
      console.log('📊 No reservations found, returning empty stats');
      return {
        totalReservations: 0,
        totalRevenue: 0,
        todayReservations: 0,
        weekReservations: 0,
        monthReservations: 0,
        averageAmount: 0,
        revenueByType: {
          coworking: 0,
          'bureau_prive': 0,
          'bureau-prive': 0,
          'salle-reunion': 0,
          'domiciliation': 0
        }
      };
    }

    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    console.log('📅 Date filters:', {
      today: today.toDateString(),
      startOfWeek: startOfWeek.toDateString(),
      startOfMonth: startOfMonth.toDateString()
    });

    const stats = reservations.reduce((acc, reservation) => {
      const reservationDate = new Date(reservation.created_at);
      const amount = Number(reservation.amount) || 0;
      
      console.log('💰 Processing reservation:', {
        id: reservation.id,
        amount,
        space_type: reservation.space_type,
        date: reservationDate.toDateString()
      });

      // Total
      acc.totalReservations += 1;
      acc.totalRevenue += amount;

      // Par période
      if (reservationDate.toDateString() === today.toDateString()) {
        acc.todayReservations += 1;
      }
      if (reservationDate >= startOfWeek) {
        acc.weekReservations += 1;
      }
      if (reservationDate >= startOfMonth) {
        acc.monthReservations += 1;
      }

      // Par type d'espace
      const spaceType = reservation.space_type;
      if (spaceType === 'coworking') {
        acc.revenueByType.coworking += amount;
      } else if (spaceType === 'bureau_prive' || spaceType === 'bureau-prive') {
        acc.revenueByType['bureau_prive'] += amount;
        acc.revenueByType['bureau-prive'] += amount;
      } else if (spaceType === 'salle-reunion') {
        acc.revenueByType['salle-reunion'] += amount;
      } else if (spaceType === 'domiciliation') {
        acc.revenueByType.domiciliation += amount;
      }

      return acc;
    }, {
      totalReservations: 0,
      totalRevenue: 0,
      todayReservations: 0,
      weekReservations: 0,
      monthReservations: 0,
      revenueByType: {
        coworking: 0,
        'bureau_prive': 0,
        'bureau-prive': 0,
        'salle-reunion': 0,
        domiciliation: 0
      }
    });

    stats.averageAmount = stats.totalReservations > 0 ? stats.totalRevenue / stats.totalReservations : 0;

    console.log('📊 Calculated stats:', stats);
    return stats;
  };

  const stats = calculateStats();

  // Données pour les graphiques
  const revenueByTypeData = [
    { name: 'Coworking', value: stats.revenueByType.coworking, color: '#3B82F6' },
    { name: 'Bureau Privé', value: stats.revenueByType['bureau_prive'] + stats.revenueByType['bureau-prive'], color: '#10B981' },
    { name: 'Salle Réunion', value: stats.revenueByType['salle-reunion'], color: '#F59E0B' }
  ].filter(item => item.value > 0); // Ne montrer que les types avec des revenus

  // Données pour l'évolution des réservations (derniers 30 jours)
  const getReservationsOverTime = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        count: 0,
        revenue: 0
      };
    });

    reservations.forEach(reservation => {
      const reservationDate = reservation.created_at.split('T')[0];
      const dayData = last30Days.find(day => day.date === reservationDate);
      if (dayData) {
        dayData.count += 1;
        dayData.revenue += Number(reservation.amount) || 0;
      }
    });

    console.log('📈 Reservations over time data:', last30Days.slice(-7)); // Log derniers 7 jours
    return last30Days.map(day => ({
      ...day,
      displayDate: new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    }));
  };

  const reservationsOverTime = getReservationsOverTime();

  // Calcul des clients uniques
  const getClientsStats = () => {
    console.log('👥 Calculating client stats...');
    const uniqueClients = new Map();
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    reservations.forEach(reservation => {
      const email = reservation.email;
      if (!uniqueClients.has(email)) {
        uniqueClients.set(email, {
          email,
          full_name: reservation.full_name,
          phone: reservation.phone,
          company: reservation.company,
          totalReservations: 0,
          totalSpent: 0,
          lastReservation: reservation.created_at,
          isNewThisMonth: new Date(reservation.created_at) >= startOfMonth
        });
      }
      
      const client = uniqueClients.get(email);
      client.totalReservations += 1;
      client.totalSpent += Number(reservation.amount) || 0;
      
      if (new Date(reservation.created_at) > new Date(client.lastReservation)) {
        client.lastReservation = reservation.created_at;
      }
    });

    const clientsArray = Array.from(uniqueClients.values());
    const newThisMonth = clientsArray.filter(client => client.isNewThisMonth).length;

    console.log('👥 Client stats calculated:', {
      total: clientsArray.length,
      newThisMonth,
      topClientsCount: clientsArray.slice(0, 10).length
    });

    return {
      totalClients: clientsArray.length,
      newThisMonth,
      topClients: clientsArray
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10)
    };
  };

  const clientsStats = getClientsStats();

  // Filtrage des réservations
  const getFilteredReservations = () => {
    let filtered = reservations;

    // Filtre par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.space_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par date
    if (dateFilter !== 'all') {
      const today = new Date();
      const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      filtered = filtered.filter(r => {
        const reservationDate = new Date(r.created_at);
        switch (dateFilter) {
          case 'today':
            return reservationDate.toDateString() === today.toDateString();
          case 'week':
            return reservationDate >= startOfWeek;
          case 'month':
            return reservationDate >= startOfMonth;
          default:
            return true;
        }
      });
    }

    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const filteredReservations = getFilteredReservations();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatSpaceType = (spaceType: string) => {
    const types = {
      'coworking': 'Coworking',
      'bureau-prive': 'Bureau Privé',
      'salle-reunion': 'Salle Réunion'
    };
    return types[spaceType as keyof typeof types] || spaceType;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Erreur: {error}</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-nzoo-white rounded-2xl shadow-soft p-6 border border-nzoo-gray/20 hover:shadow-medium transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-nzoo-dark/70 mb-1 font-montserrat">{t.stats.totalReservations}</p>
              <p className="text-4xl font-bold text-nzoo-dark font-montserrat">{stats.totalReservations}</p>
            </div>
            <div className="bg-nzoo-dark/10 p-4 rounded-2xl">
              <Calendar className="w-8 h-8 text-nzoo-dark" />
            </div>
          </div>
        </div>

        <div className="bg-nzoo-white rounded-2xl shadow-soft p-6 border border-nzoo-gray/20 hover:shadow-medium transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-nzoo-dark/70 mb-1 font-montserrat">{t.stats.totalRevenue}</p>
              <p className="text-4xl font-bold text-green-600 font-montserrat">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-2xl">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-nzoo-white rounded-2xl shadow-soft p-6 border border-nzoo-gray/20 hover:shadow-medium transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-nzoo-dark/70 mb-1 font-montserrat">{t.stats.todayReservations}</p>
              <p className="text-4xl font-bold text-orange-600 font-montserrat">{stats.todayReservations}</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-2xl">
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-nzoo-white rounded-2xl shadow-soft p-6 border border-nzoo-gray/20 hover:shadow-medium transition-all duration-300 transform hover:scale-[1.02]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-nzoo-dark/70 mb-1 font-montserrat">{t.stats.averageAmount}</p>
              <p className="text-4xl font-bold text-purple-600 font-montserrat">${stats.averageAmount.toFixed(2)}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Période Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-nzoo-white rounded-2xl shadow-soft p-6 border border-nzoo-gray/20">
          <h3 className="text-lg font-bold text-nzoo-dark mb-4 font-montserrat">{t.stats.weekReservations}</h3>
          <p className="text-3xl font-bold text-nzoo-dark font-montserrat">{stats.weekReservations}</p>
        </div>
        <div className="bg-nzoo-white rounded-2xl shadow-soft p-6 border border-nzoo-gray/20">
          <h3 className="text-lg font-bold text-nzoo-dark mb-4 font-montserrat">{t.stats.monthReservations}</h3>
          <p className="text-3xl font-bold text-green-600 font-montserrat">{stats.monthReservations}</p>
        </div>
        <div className="bg-nzoo-white rounded-2xl shadow-soft p-6 border border-nzoo-gray/20">
          <h3 className="text-lg font-bold text-nzoo-dark mb-4 font-montserrat">{t.clients.totalClients}</h3>
          <p className="text-3xl font-bold text-purple-600 font-montserrat">{clientsStats.totalClients}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-nzoo-white rounded-2xl shadow-soft p-6 border border-nzoo-gray/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-nzoo-dark font-montserrat">{t.charts.revenueByType}</h3>
            <button 
              onClick={handleRefresh}
              className="text-nzoo-dark hover:text-nzoo-dark-light p-2 rounded-xl hover:bg-nzoo-gray/20 transition-colors"
              title="Actualiser"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          {revenueByTypeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={revenueByTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: $${value}`}
              >
                {revenueByTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, 'Revenus']} />
            </RechartsPieChart>
          </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-nzoo-dark/50">
              <div className="text-center">
                <PieChart className="w-12 h-12 mx-auto mb-2 text-nzoo-dark/30" />
                <p className="font-poppins">Aucune donnée de revenus disponible</p>
                <button 
                  onClick={handleRefresh}
                  className="mt-2 text-nzoo-dark hover:text-nzoo-dark-light text-sm underline font-poppins"
                >
                  Actualiser les données
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-nzoo-white rounded-2xl shadow-soft p-6 border border-nzoo-gray/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-nzoo-dark font-montserrat">{t.charts.reservationsOverTime}</h3>
            <button 
              onClick={handleRefresh}
              className="text-nzoo-dark hover:text-nzoo-dark-light p-2 rounded-xl hover:bg-nzoo-gray/20 transition-colors"
              title="Actualiser"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reservationsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#183154" fill="#183154" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-nzoo-gray/20 rounded-2xl p-4 border border-nzoo-gray/30">
          <h4 className="font-semibold text-nzoo-dark mb-2 font-montserrat">Debug Info (Development)</h4>
          <div className="text-xs text-nzoo-dark/60 space-y-1 font-poppins">
            <p>Total réservations chargées: {reservations.length}</p>
            <p>Revenus total calculé: ${stats.totalRevenue.toFixed(2)}</p>
            <p>Types d'espaces trouvés: {[...new Set(reservations.map(r => r.space_type))].join(', ')}</p>
            <p>Dernière actualisation: {lastRefresh.toLocaleString('fr-FR')}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderReservations = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t.actions.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t.reservations.all}</option>
              <option value="pending">{t.reservations.pending}</option>
              <option value="confirmed">{t.reservations.confirmed}</option>
              <option value="completed">{t.reservations.completed}</option>
              <option value="cancelled">{t.reservations.cancelled}</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t.filters.all}</option>
              <option value="today">{t.filters.today}</option>
              <option value="week">{t.filters.week}</option>
              <option value="month">{t.filters.month}</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              {t.actions.export}
            </button>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espace</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{reservation.full_name}</div>
                      <div className="text-sm text-gray-500">{reservation.email}</div>
                      <div className="text-sm text-gray-500">{reservation.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatSpaceType(reservation.space_type)}</div>
                    <div className="text-sm text-gray-500">{reservation.occupants} personnes</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(reservation.start_date).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-sm text-gray-500">
                      au {new Date(reservation.end_date).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${reservation.amount}</div>
                    <div className="text-sm text-gray-500">{reservation.payment_method}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
                      {getStatusIcon(reservation.status)}
                      <span className="ml-1">{t.reservations[reservation.status as keyof typeof t.reservations]}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(reservation.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRevenue = () => (
    <div className="space-y-8">
      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.stats.coworkingRevenue}</h3>
          <p className="text-2xl font-bold text-blue-600">${stats.revenueByType.coworking.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {reservations.filter(r => r.space_type === 'coworking').length} réservations
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.stats.privateOfficeRevenue}</h3>
          <p className="text-2xl font-bold text-green-600">${(stats.revenueByType['bureau_prive'] + stats.revenueByType['bureau-prive']).toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {reservations.filter(r => r.space_type === 'bureau_prive' || r.space_type === 'bureau-prive').length} réservations
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.stats.meetingRoomRevenue}</h3>
          <p className="text-2xl font-bold text-orange-600">${stats.revenueByType['salle-reunion'].toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {reservations.filter(r => r.space_type === 'salle-reunion').length} réservations
          </p>
        </div>
      </div>

      {/* Domiciliation Revenue */}
      {stats.revenueByType.domiciliation > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenus Domiciliation</h3>
          <p className="text-2xl font-bold text-purple-600">${stats.revenueByType.domiciliation.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {reservations.filter(r => r.space_type === 'domiciliation').length} réservations
          </p>
        </div>
      )}

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Évolution des Revenus (30 derniers jours)</h3>
          <button 
            onClick={handleRefresh}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
            title="Actualiser le graphique"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={reservationsOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="displayDate" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value}`, 'Revenus']} />
            <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Résumé des données */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total période:</span>
              <span className="font-semibold ml-2">${reservationsOverTime.reduce((sum, day) => sum + day.revenue, 0).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">Réservations:</span>
              <span className="font-semibold ml-2">{reservationsOverTime.reduce((sum, day) => sum + day.count, 0)}</span>
            </div>
            <div>
              <span className="text-gray-600">Moyenne/jour:</span>
              <span className="font-semibold ml-2">${(reservationsOverTime.reduce((sum, day) => sum + day.revenue, 0) / 30).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-gray-600">Dernière MAJ:</span>
              <span className="font-semibold ml-2">{lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-8">
      {/* Client Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.clients.totalClients}</h3>
          <p className="text-2xl font-bold text-blue-600">{clientsStats.totalClients}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.clients.newThisMonth}</h3>
          <p className="text-2xl font-bold text-green-600">{clientsStats.newThisMonth}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clients Actifs</h3>
          <p className="text-2xl font-bold text-purple-600">
            {clientsStats.topClients.filter(c => c.totalReservations > 0).length}
          </p>
        </div>
      </div>

      {/* Top Clients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{t.clients.topClients}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Réservations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Dépensé</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière Réservation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientsStats.topClients.map((client, index) => (
                <tr key={client.email} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.full_name}</div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.company || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.totalReservations}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${client.totalSpent.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(client.lastReservation).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: t.tabs.overview, icon: BarChart3 },
    { id: 'reservations', label: t.tabs.reservations, icon: Calendar },
    { id: 'reservationManagement', label: t.tabs.reservationManagement, icon: Calendar },
    { id: 'spaces', label: 'Espaces', icon: Building },
    { id: 'revenue', label: t.tabs.revenue, icon: DollarSign },
    { id: 'clients', label: t.tabs.clients, icon: Users },
    { id: 'statistics', label: t.tabs.statistics, icon: TrendingUp },
    { id: 'users', label: t.tabs.users, icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-nzoo-light py-8 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-nzoo-dark mb-2 font-montserrat">{t.title}</h1>
              <p className="text-nzoo-dark/70 font-poppins text-lg">{t.subtitle}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-nzoo-dark text-nzoo-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-poppins">
                  {stats.todayReservations}
                </span>
              </button>
              <button 
                onClick={handleRefresh}
                className="p-3 text-nzoo-dark/60 hover:text-nzoo-dark transition-colors bg-nzoo-white rounded-xl shadow-soft hover:shadow-medium"
                title="Actualiser les données"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
              <button className="p-3 text-nzoo-dark/60 hover:text-nzoo-dark transition-colors bg-nzoo-white rounded-xl shadow-soft hover:shadow-medium">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Indicateur de dernière mise à jour */}
          <div className="text-sm text-nzoo-dark/50 mt-3 font-poppins">
            Dernière mise à jour : {lastRefresh.toLocaleTimeString('fr-FR')}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-nzoo-gray/50 bg-nzoo-white rounded-t-2xl shadow-soft">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-6 border-b-3 font-medium text-sm flex items-center space-x-2 transition-all duration-300 font-poppins ${
                      activeTab === tab.id
                        ? 'border-nzoo-dark text-nzoo-dark bg-nzoo-dark/5'
                        : 'border-transparent text-nzoo-dark/60 hover:text-nzoo-dark hover:border-nzoo-gray'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="animate-fadeIn bg-nzoo-white rounded-2xl shadow-medium p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'reservations' && renderReservations()}
          {activeTab === 'reservationManagement' && <ReservationManagement language={language} />}
          {activeTab === 'spaces' && <SpaceManagementForm language={language} />}
          {activeTab === 'revenue' && renderRevenue()}
          {activeTab === 'clients' && renderClients()}
          {activeTab === 'users' && <UserManagement language={language} />}
          {activeTab === 'statistics' && (
            <div className="space-y-8">
              {/* Statistiques détaillées */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-nzoo-white rounded-2xl shadow-soft p-6 border border-nzoo-gray/20">
                  <h4 className="text-sm font-semibold text-nzoo-dark/70 mb-2 font-montserrat">Taux de conversion</h4>
                  <p className="text-3xl font-bold text-green-600 font-montserrat">
                    {stats.totalReservations > 0 ? 
                      ((reservations.filter(r => r.status === 'confirmed').length / stats.totalReservations) * 100).toFixed(1) 
                      : 0}%
                  </p>
                </div>
                <div className="bg-nzoo-white rounded-2xl shadow-soft p-6 border border-nzoo-gray/20">
                  <h4 className="text-sm font-semibold text-nzoo-dark/70 mb-2 font-montserrat">Réservations en attente</h4>
                  <p className="text-3xl font-bold text-yellow-600 font-montserrat">
                    {reservations.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <div className="bg-nzoo-white rounded-2xl shadow-soft p-6 border border-nzoo-gray/20">
                  <h4 className="text-sm font-semibold text-nzoo-dark/70 mb-2 font-montserrat">Réservations annulées</h4>
                  <p className="text-3xl font-bold text-red-600 font-montserrat">
                    {reservations.filter(r => r.status === 'cancelled').length}
                  </p>
                </div>
                <div className="bg-nzoo-white rounded-2xl shadow-soft p-6 border border-nzoo-gray/20">
                  <h4 className="text-sm font-semibold text-nzoo-dark/70 mb-2 font-montserrat">Revenus moyens/client</h4>
                  <p className="text-3xl font-bold text-nzoo-dark font-montserrat">
                    ${clientsStats.totalClients > 0 ? (stats.totalRevenue / clientsStats.totalClients).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>

              {/* Graphique des statuts */}
              <div className="bg-nzoo-white rounded-2xl shadow-soft p-6 border border-nzoo-gray/20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-nzoo-dark font-montserrat">Répartition des Statuts</h3>
                  <button 
                    onClick={handleRefresh}
                    className="text-nzoo-dark hover:text-nzoo-dark-light p-2 rounded-xl hover:bg-nzoo-gray/20 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Confirmées', value: reservations.filter(r => r.status === 'confirmed').length, color: '#10B981' },
                        { name: 'En attente', value: reservations.filter(r => r.status === 'pending').length, color: '#F59E0B' },
                        { name: 'Terminées', value: reservations.filter(r => r.status === 'completed').length, color: '#3B82F6' },
                        { name: 'Annulées', value: reservations.filter(r => r.status === 'cancelled').length, color: '#EF4444' }
                      ].filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {[
                        { name: 'Confirmées', value: reservations.filter(r => r.status === 'confirmed').length, color: '#10B981' },
                        { name: 'En attente', value: reservations.filter(r => r.status === 'pending').length, color: '#F59E0B' },
                        { name: 'Terminées', value: reservations.filter(r => r.status === 'completed').length, color: '#3B82F6' },
                        { name: 'Annulées', value: reservations.filter(r => r.status === 'cancelled').length, color: '#EF4444' }
                      ].filter(item => item.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              {/* Statistiques par méthode de paiement */}
              <div className="bg-nzoo-white rounded-2xl shadow-soft p-6 border border-nzoo-gray/20">
                <h3 className="text-xl font-bold text-nzoo-dark mb-6 font-montserrat">Répartition par Méthode de Paiement</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['cash', 'orange_money', 'airtel_money', 'visa'].map(method => {
                    const count = reservations.filter(r => r.payment_method === method).length;
                    const revenue = reservations.filter(r => r.payment_method === method).reduce((sum, r) => sum + Number(r.amount), 0);
                    
                    if (count === 0) return null;
                    
                    return (
                      <div key={method} className="text-center p-6 bg-nzoo-gray/10 rounded-2xl border border-nzoo-gray/30 hover:shadow-soft transition-shadow">
                        <h4 className="font-semibold text-nzoo-dark capitalize mb-2 font-montserrat">{method.replace('_', ' ')}</h4>
                        <p className="text-2xl font-bold text-nzoo-dark font-montserrat">{count}</p>
                        <p className="text-sm text-nzoo-dark/60 font-poppins">${revenue.toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;