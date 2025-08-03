import React, { useState, useEffect } from 'react';
import { Edit, Save, X, CheckCircle, XCircle, Clock, AlertCircle, Mail, Phone, Eye, Trash2, Lock, Shield, User } from 'lucide-react';
import { useReservations } from '../hooks/useReservations';
import { useAuth } from '../hooks/useAuth';
import { ReservationEditForm } from './ReservationEditForm';
import { type Reservation } from '../lib/supabase';

interface ReservationManagementProps {
  language: 'fr' | 'en';
}

const ReservationManagement: React.FC<ReservationManagementProps> = ({ language }) => {
  const { reservations, loading, error, updateReservationStatus, updateReservation, deleteReservation } = useReservations();
  const { isAdmin, userProfile, loading: authLoading } = useAuth();
  const [editingReservation, setEditingReservation] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Reservation>>({});
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const translations = {
    fr: {
      title: 'Gestion des Réservations',
      search: 'Rechercher...',
      filter: 'Filtrer par statut',
      all: 'Toutes',
      pending: 'En attente',
      confirmed: 'Confirmées',
      cancelled: 'Annulées',
      completed: 'Terminées',
      edit: 'Modifier',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      view: 'Voir',
      contact: 'Contacter',
      status: 'Statut',
      client: 'Client',
      space: 'Espace',
      period: 'Période',
      amount: 'Montant',
      actions: 'Actions',
      noReservations: 'Aucune réservation trouvée',
      editReservation: 'Modifier la réservation',
      fullName: 'Nom complet',
      email: 'Email',
      phone: 'Téléphone',
      company: 'Entreprise',
      activity: 'Activité',
      occupants: 'Occupants',
      paymentMethod: 'Méthode de paiement',
      notes: 'Notes',
      adminNotes: 'Notes admin',
      restrictedAccess: 'Accès restreint - Seul le statut peut être modifié',
      adminOnly: 'Réservé aux administrateurs',
      currentUser: 'Utilisateur actuel',
      role: 'Rôle',
      autoStatusUpdate: 'Statuts mis à jour automatiquement',
      adminAccess: 'Accès administrateur',
      userAccess: 'Accès utilisateur standard',
      permissionsInfo: 'Vos permissions',
      canModifyAll: 'Peut modifier tous les champs',
      canModifyStatus: 'Peut modifier uniquement le statut',
      saveSuccess: 'Réservation mise à jour avec succès',
      saveError: 'Erreur lors de la sauvegarde',
      statusUpdateSuccess: 'Statut mis à jour avec succès',
      statusUpdateError: 'Erreur lors du changement de statut'
    },
    en: {
      title: 'Reservation Management',
      search: 'Search...',
      filter: 'Filter by status',
      all: 'All',
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      view: 'View',
      contact: 'Contact',
      status: 'Status',
      client: 'Client',
      space: 'Space',
      period: 'Period',
      amount: 'Amount',
      actions: 'Actions',
      noReservations: 'No reservations found',
      editReservation: 'Edit reservation',
      fullName: 'Full name',
      email: 'Email',
      phone: 'Phone',
      company: 'Company',
      activity: 'Activity',
      occupants: 'Occupants',
      paymentMethod: 'Payment method',
      notes: 'Notes',
      adminNotes: 'Admin notes',
      restrictedAccess: 'Restricted access - Only status can be modified',
      adminOnly: 'Admin only',
      currentUser: 'Current user',
      role: 'Role',
      autoStatusUpdate: 'Statuses updated automatically',
      adminAccess: 'Administrator access',
      userAccess: 'Standard user access',
      permissionsInfo: 'Your permissions',
      canModifyAll: 'Can modify all fields',
      canModifyStatus: 'Can only modify status',
      saveSuccess: 'Reservation updated successfully',
      saveError: 'Error while saving',
      statusUpdateSuccess: 'Status updated successfully',
      statusUpdateError: 'Error while updating status'
    }
  };

  const t = translations[language];

  // Fonction pour vérifier et mettre à jour automatiquement les statuts
  const checkAndUpdateExpiredReservations = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let updatedCount = 0;
    
    for (const reservation of reservations) {
      const endDate = new Date(reservation.end_date);
      endDate.setHours(0, 0, 0, 0);
      
      // Si la date de fin est inférieure à aujourd'hui
      if (endDate < today) {
        let newStatus: Reservation['status'] | null = null;
        
        // Si confirmé → terminé
        if (reservation.status === 'confirmed') {
          newStatus = 'completed';
        }
        // Si en attente → annulé
        else if (reservation.status === 'pending') {
          newStatus = 'cancelled';
        }
        
        // Mettre à jour le statut si nécessaire
        if (newStatus && newStatus !== reservation.status) {
          try {
            await updateReservationStatus(reservation.id, newStatus);
            updatedCount++;
          } catch (error) {
            console.error(`Erreur lors de la mise à jour de la réservation ${reservation.id}:`, error);
          }
        }
      }
    }
    
    if (updatedCount > 0) {
      showNotification('info', `${updatedCount} réservation(s) ${t.autoStatusUpdate.toLowerCase()}`);
    }
  };

  // Exécuter la vérification automatique au chargement
  useEffect(() => {
    // Désactiver la vérification automatique pour éviter les actualisations constantes
    // if (reservations.length > 0 && !loading) {
    //   checkAndUpdateExpiredReservations();
    // }
  }, [reservations.length, loading]);

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

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation.id);
    setEditFormData({
      full_name: reservation.full_name,
      email: reservation.email,
      phone: reservation.phone,
      company: reservation.company,
      activity: reservation.activity,
      occupants: reservation.occupants,
      amount: reservation.amount,
      status: reservation.status,
      payment_method: reservation.payment_method,
      notes: reservation.notes || '',
      admin_notes: reservation.admin_notes || ''
    });
  };

  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Fonction pour afficher les notifications
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSave = async () => {
    if (!editingReservation) return;
    
    try {
      // Si l'utilisateur n'est pas admin, on ne sauvegarde que le statut
      const dataToSave = isAdmin ? editFormData : { status: editFormData.status };
      
      await updateReservation(editingReservation, dataToSave);
      showNotification('success', t.saveSuccess);
      setEditingReservation(null);
      setEditFormData({});
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showNotification('error', t.saveError + ': ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  const handleCancel = () => {
    setEditingReservation(null);
    setEditFormData({});
  };

  const handleStatusChange = async (reservationId: string, newStatus: Reservation['status']) => {
    try {
      await updateReservationStatus(reservationId, newStatus);
      showNotification('success', t.statusUpdateSuccess);
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      showNotification('error', t.statusUpdateError);
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      reservation.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (loading || authLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
        <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Erreur de chargement</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-400 text-green-700' 
            : notification.type === 'error'
            ? 'bg-red-50 border-red-400 text-red-700'
            : 'bg-blue-50 border-blue-400 text-blue-700'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
            {notification.type === 'error' && <XCircle className="w-5 h-5 mr-2" />}
            {notification.type === 'info' && <AlertCircle className="w-5 h-5 mr-2" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h2>
          <p className="text-gray-600">Gérez les réservations selon vos permissions</p>
        </div>
        
        {/* User Permissions Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-w-80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">{t.permissionsInfo}</h3>
            {isAdmin ? (
              <div className="flex items-center text-green-600">
                <Shield className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium">ADMIN</span>
              </div>
            ) : (
              <div className="flex items-center text-blue-600">
                <User className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium">USER</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{t.currentUser}:</span>
              <span className="font-medium">{userProfile?.full_name || userProfile?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">{t.role}:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isAdmin 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {userProfile?.role || 'user'}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <div className={`flex items-center text-xs ${
                isAdmin ? 'text-green-600' : 'text-blue-600'
              }`}>
                {isAdmin ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {t.canModifyAll}
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {t.canModifyStatus}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-40"
            >
              <option value="all">{t.all}</option>
              <option value="pending">{t.pending}</option>
              <option value="confirmed">{t.confirmed}</option>
              <option value="completed">{t.completed}</option>
              <option value="cancelled">{t.cancelled}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredReservations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">{t.noReservations}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.client}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.space}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.period}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.amount}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.status}</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.actions}</th>
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
                      <select
                        value={reservation.status}
                        onChange={(e) => handleStatusChange(reservation.id, e.target.value as Reservation['status'])}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border cursor-pointer hover:shadow-sm transition-shadow ${getStatusColor(reservation.status)}`}
                      >
                        <option value="pending">{t.pending}</option>
                        <option value="confirmed">{t.confirmed}</option>
                        <option value="completed">{t.completed}</option>
                        <option value="cancelled">{t.cancelled}</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(reservation)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title={isAdmin ? t.edit : `${t.view} / ${t.edit} ${t.status}`}
                        >
                          {isAdmin ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        {isAdmin && (
                          <>
                            <button className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors">
                              <Mail className="w-4 h-4" />
                            </button>
                            <button className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                              <Phone className="w-4 h-4" />
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
        )}
      </div>

      {/* Edit Modal */}
      {editingReservation && (
        <ReservationEditForm
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          onCancel={handleCancel}
          onSave={handleSave}
          isAdmin={isAdmin}
          language={language}
        />
      )}
    </div>
  );
};

export default ReservationManagement;