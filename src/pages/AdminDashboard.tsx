import React, { useState } from 'react';
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
  Settings
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface AdminDashboardProps {
  language: 'fr' | 'en';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const translations = {
    fr: {
      title: 'Tableau de Bord Administrateur',
      subtitle: 'Gérez vos réservations et suivez vos performances',
      tabs: {
        overview: 'Vue d\'ensemble',
        reservations: 'Réservations',
        payments: 'Paiements',
        spaces: 'Espaces',
        statistics: 'Statistiques',
        clients: 'Clients'
      },
      stats: {
        totalReservations: 'Réservations Totales',
        monthlyRevenue: 'Revenus Mensuels',
        activeSpaces: 'Espaces Actifs',
        occupancyRate: 'Taux d\'Occupation',
        pendingPayments: 'Paiements en Attente',
        newClients: 'Nouveaux Clients'
      },
      reservations: {
        pending: 'En Attente',
        confirmed: 'Confirmées',
        cancelled: 'Annulées',
        completed: 'Terminées',
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
      recent: {
        title: 'Réservations Récentes',
        viewAll: 'Voir tout'
      },
      charts: {
        revenue: 'Évolution des Revenus',
        occupancy: 'Taux d\'Occupation par Espace',
        bookings: 'Réservations par Mois'
      }
    },
    en: {
      title: 'Admin Dashboard',
      subtitle: 'Manage your reservations and track your performance',
      tabs: {
        overview: 'Overview',
        reservations: 'Reservations',
        payments: 'Payments',
        spaces: 'Spaces',
        statistics: 'Statistics',
        clients: 'Clients'
      },
      stats: {
        totalReservations: 'Total Reservations',
        monthlyRevenue: 'Monthly Revenue',
        activeSpaces: 'Active Spaces',
        occupancyRate: 'Occupancy Rate',
        pendingPayments: 'Pending Payments',
        newClients: 'New Clients'
      },
      reservations: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        cancelled: 'Cancelled',
        completed: 'Completed',
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
      recent: {
        title: 'Recent Reservations',
        viewAll: 'View All'
      },
      charts: {
        revenue: 'Revenue Evolution',
        occupancy: 'Occupancy Rate by Space',
        bookings: 'Bookings per Month'
      }
    }
  };

  const t = translations[language];

  // Mock data
  const stats = {
    totalReservations: 156,
    monthlyRevenue: 12450,
    activeSpaces: 8,
    occupancyRate: 78,
    pendingPayments: 5,
    newClients: 23
  };

  const recentReservations = [
    {
      id: 1,
      client: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      phone: '+243 123 456 789',
      space: 'Coworking A',
      date: '2024-01-15',
      endDate: '2024-01-20',
      amount: 225,
      status: 'confirmed',
      occupants: 2,
      activity: 'Développement Web',
      company: 'Tech Solutions'
    },
    {
      id: 2,
      client: 'Marie Martin',
      email: 'marie.martin@email.com',
      phone: '+243 987 654 321',
      space: 'Bureau Privé B',
      date: '2024-01-16',
      endDate: '2024-02-16',
      amount: 300,
      status: 'pending',
      occupants: 5,
      activity: 'Consulting',
      company: 'Business Corp'
    },
    {
      id: 3,
      client: 'Paul Mbala',
      email: 'paul.mbala@email.com',
      phone: '+243 555 123 456',
      space: 'Salle Réunion C',
      date: '2024-01-17',
      endDate: '2024-01-17',
      amount: 75,
      status: 'completed',
      occupants: 8,
      activity: 'Formation',
      company: 'EduTech'
    },
    {
      id: 4,
      client: 'Sophie Kasongo',
      email: 'sophie.kasongo@email.com',
      phone: '+243 777 888 999',
      space: 'Coworking B',
      date: '2024-01-18',
      endDate: '2024-01-25',
      amount: 315,
      status: 'confirmed',
      occupants: 3,
      activity: 'Design Graphique',
      company: 'Creative Studio'
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 8500 },
    { month: 'Fév', revenue: 9200 },
    { month: 'Mar', revenue: 10800 },
    { month: 'Avr', revenue: 11200 },
    { month: 'Mai', revenue: 12450 },
    { month: 'Jun', revenue: 13100 }
  ];

  const occupancyData = [
    { name: 'Coworking A', value: 85, color: '#3B82F6' },
    { name: 'Coworking B', value: 72, color: '#10B981' },
    { name: 'Bureau Privé A', value: 90, color: '#F59E0B' },
    { name: 'Bureau Privé B', value: 65, color: '#EF4444' },
    { name: 'Salle Réunion A', value: 78, color: '#8B5CF6' },
    { name: 'Salle Réunion B', value: 82, color: '#06B6D4' }
  ];

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

  const filteredReservations = recentReservations.filter(reservation => {
    const matchesSearch = reservation.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.space.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || reservation.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12% ce mois</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.stats.monthlyRevenue}</p>
              <p className="text-3xl font-bold text-gray-900">${stats.monthlyRevenue}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+8% ce mois</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.stats.occupancyRate}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.occupancyRate}%</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${stats.occupancyRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.stats.activeSpaces}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeSpaces}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">Tous opérationnels</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.stats.pendingPayments}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingPayments}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-red-600">Nécessite attention</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t.stats.newClients}</p>
              <p className="text-3xl font-bold text-gray-900">{stats.newClients}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+15% ce mois</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.charts.revenue}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenus']} />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.charts.occupancy}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={occupancyData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {occupancyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{t.recent.title}</h3>
            <button 
              onClick={() => setActiveTab('reservations')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {t.recent.viewAll}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espace</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReservations.slice(0, 5).map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{reservation.client}</div>
                      <div className="text-sm text-gray-500">{reservation.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.space}</div>
                    <div className="text-sm text-gray-500">{reservation.occupants} personnes</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.date}</div>
                    <div className="text-sm text-gray-500">au {reservation.endDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${reservation.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
                      {getStatusIcon(reservation.status)}
                      <span className="ml-1">{t.reservations[reservation.status as keyof typeof t.reservations]}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                        <Edit className="w-4 h-4" />
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

  const renderReservations = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espace</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{reservation.client}</div>
                      <div className="text-sm text-gray-500">{reservation.email}</div>
                      <div className="text-sm text-gray-500">{reservation.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.company}</div>
                    <div className="text-sm text-gray-500">{reservation.activity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.space}</div>
                    <div className="text-sm text-gray-500">{reservation.occupants} personnes</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{reservation.date}</div>
                    <div className="text-sm text-gray-500">au {reservation.endDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${reservation.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
                      {getStatusIcon(reservation.status)}
                      <span className="ml-1">{t.reservations[reservation.status as keyof typeof t.reservations]}</span>
                    </span>
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
                      <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      {reservation.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
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
    { id: 'payments', label: t.tabs.payments, icon: DollarSign },
    { id: 'spaces', label: t.tabs.spaces, icon: Building },
    { id: 'statistics', label: t.tabs.statistics, icon: TrendingUp },
    { id: 'clients', label: t.tabs.clients, icon: Users }
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
                  3
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
          {activeTab === 'payments' && (
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Module Paiements</h3>
              <p className="text-gray-600">Gestion des paiements en cours de développement</p>
            </div>
          )}
          {activeTab === 'spaces' && (
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion des Espaces</h3>
              <p className="text-gray-600">Module de gestion des espaces en cours de développement</p>
            </div>
          )}
          {activeTab === 'statistics' && (
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Statistiques Avancées</h3>
              <p className="text-gray-600">Analyses détaillées en cours de développement</p>
            </div>
          )}
          {activeTab === 'clients' && (
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion des Clients</h3>
              <p className="text-gray-600">Base de données clients en cours de développement</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;