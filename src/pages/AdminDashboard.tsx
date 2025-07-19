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
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useReservations } from '../hooks/useReservations';
import SpaceManagementForm from '../components/SpaceManagementForm';

interface AdminDashboardProps {
  language: 'fr' | 'en';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // today, week, month, all
  
  // Utiliser le hook pour récupérer les vraies données
  const { reservations, loading, error } = useReservations();

  const translations = {
    fr: {
      title: 'Tableau de Bord Administrateur',
      subtitle: 'Gérez vos réservations et suivez vos performances',
      tabs: {
        overview: 'Vue d\'ensemble',
        reservations: 'Réservations',
        revenue: 'Revenus',
        clients: 'Clients',
        statistics: 'Statistiques'
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
        revenue: 'Revenue',
        clients: 'Clients',
        statistics: 'Statistics'
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
    if (!reservations.length) {
      return {
        totalReservations: 0,
        totalRevenue: 0,
        todayReservations: 0,
        weekReservations: 0,
        monthReservations: 0,
        averageAmount: 0,
        revenueByType: {
          coworking: 0,
          'bureau-prive': 0,
          'salle-reunion': 0
        }
      };
    }

    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const stats = reservations.reduce((acc, reservation) => {
      const reservationDate = new Date(reservation.created_at);
      const amount = Number(reservation.amount) || 0;

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
      if (reservation.space_type in acc.revenueByType) {
        acc.revenueByType[reservation.space_type as keyof typeof acc.revenueByType] += amount;
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
        'bureau-prive': 0,
        'salle-reunion': 0
      }
    });

    stats.averageAmount = stats.totalReservations > 0 ? stats.totalRevenue / stats.totalReservations : 0;

    return stats;
  };

  const stats = calculateStats();

  // Données pour les graphiques
  const revenueByTypeData = [
    { name: 'Coworking', value: stats.revenueByType.coworking, color: '#3B82F6' },
    { name: 'Bureau Privé', value: stats.revenueByType['bureau-prive'], color: '#10B981' },
    { name: 'Salle Réunion', value: stats.revenueByType['salle-reunion'], color: '#F59E0B' }
  ];

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

    return last30Days.map(day => ({
      ...day,
      displayDate: new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
    }));
  };

  const reservationsOverTime = getReservationsOverTime();

  // Calcul des clients uniques
  const getClientsStats = () => {
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
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.stats.totalReservations}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalReservations}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.stats.totalRevenue}</p>
              <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.stats.todayReservations}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.todayReservations}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.stats.averageAmount}</p>
              <p className="text-3xl font-bold text-gray-900">${stats.averageAmount.toFixed(2)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Période Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.stats.weekReservations}</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.weekReservations}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.stats.monthReservations}</h3>
          <p className="text-2xl font-bold text-green-600">{stats.monthReservations}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.clients.totalClients}</h3>
          <p className="text-2xl font-bold text-purple-600">{clientsStats.totalClients}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.charts.revenueByType}</h3>
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
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.charts.reservationsOverTime}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reservationsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="displayDate" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
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
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.stats.privateOfficeRevenue}</h3>
          <p className="text-2xl font-bold text-green-600">${stats.revenueByType['bureau-prive'].toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.stats.meetingRoomRevenue}</h3>
          <p className="text-2xl font-bold text-orange-600">${stats.revenueByType['salle-reunion'].toFixed(2)}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des Revenus (30 derniers jours)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={reservationsOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="displayDate" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value}`, 'Revenus']} />
            <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
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
    { id: 'spaces', label: 'Espaces', icon: Building },
    { id: 'revenue', label: t.tabs.revenue, icon: DollarSign },
    { id: 'clients', label: t.tabs.clients, icon: Users },
    { id: 'statistics', label: t.tabs.statistics, icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600 mt-2">{t.subtitle}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.todayReservations}
                </span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
        <div className="animate-fadeIn">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'reservations' && renderReservations()}
          {activeTab === 'spaces' && <SpaceManagementForm language={language} />}
          {activeTab === 'revenue' && renderRevenue()}
          {activeTab === 'clients' && renderClients()}
          {activeTab === 'statistics' && (
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Statistiques Avancées</h3>
              <p className="text-gray-600">Analyses détaillées en cours de développement</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;