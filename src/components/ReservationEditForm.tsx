import React from 'react';
import { Save, X, Lock, AlertCircle } from 'lucide-react';
import { type Reservation } from '../hooks/useReservations';

interface ReservationEditFormProps {
  editFormData: Partial<Reservation>;
  setEditFormData: (data: Partial<Reservation>) => void;
  onCancel: () => void;
  onSave: () => void;
  isAdmin: boolean;
  language: 'fr' | 'en';
}

export const ReservationEditForm: React.FC<ReservationEditFormProps> = ({
  editFormData,
  setEditFormData,
  onCancel,
  onSave,
  isAdmin,
  language
}) => {
  const translations = {
    fr: {
      editReservation: 'Modifier la réservation',
      fullName: 'Nom complet',
      email: 'Email',
      phone: 'Téléphone',
      company: 'Entreprise',
      activity: 'Activité',
      occupants: 'Occupants',
      amount: 'Montant',
      paymentMethod: 'Méthode de paiement',
      status: 'Statut',
      notes: 'Notes',
      adminNotes: 'Notes admin',
      pending: 'En attente',
      confirmed: 'Confirmé',
      cancelled: 'Annulé',
      completed: 'Terminé',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      restrictedAccess: 'Accès restreint - Seul le statut peut être modifié',
      adminOnly: 'Réservé aux administrateurs'
    },
    en: {
      editReservation: 'Edit reservation',
      fullName: 'Full name',
      email: 'Email',
      phone: 'Phone',
      company: 'Company',
      activity: 'Activity',
      occupants: 'Occupants',
      amount: 'Amount',
      paymentMethod: 'Payment method',
      status: 'Status',
      notes: 'Notes',
      adminNotes: 'Admin notes',
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed',
      save: 'Save',
      cancel: 'Cancel',
      restrictedAccess: 'Restricted access - Only status can be modified',
      adminOnly: 'Admin only'
    }
  };

  const t = translations[language];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">{t.editReservation}</h3>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isAdmin && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800 font-medium">{t.restrictedAccess}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.fullName}
                {!isAdmin && <Lock className="w-4 h-4 inline ml-1 text-gray-400" />}
              </label>
              <input
                type="text"
                value={editFormData.full_name || ''}
                onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                disabled={!isAdmin}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isAdmin 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.email}
                {!isAdmin && <Lock className="w-4 h-4 inline ml-1 text-gray-400" />}
              </label>
              <input
                type="email"
                value={editFormData.email || ''}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                disabled={!isAdmin}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isAdmin 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.phone}
                {!isAdmin && <Lock className="w-4 h-4 inline ml-1 text-gray-400" />}
              </label>
              <input
                type="tel"
                value={editFormData.phone || ''}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                disabled={!isAdmin}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isAdmin 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.company}
                {!isAdmin && <Lock className="w-4 h-4 inline ml-1 text-gray-400" />}
              </label>
              <input
                type="text"
                value={editFormData.company || ''}
                onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                disabled={!isAdmin}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isAdmin 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Activity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.activity}
                {!isAdmin && <Lock className="w-4 h-4 inline ml-1 text-gray-400" />}
              </label>
              <input
                type="text"
                value={editFormData.activity || ''}
                onChange={(e) => setEditFormData({ ...editFormData, activity: e.target.value })}
                disabled={!isAdmin}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isAdmin 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Occupants */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.occupants}
                {!isAdmin && <Lock className="w-4 h-4 inline ml-1 text-gray-400" />}
              </label>
              <input
                type="number"
                value={editFormData.occupants || ''}
                onChange={(e) => setEditFormData({ ...editFormData, occupants: parseInt(e.target.value) })}
                disabled={!isAdmin}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isAdmin 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.amount}
                {!isAdmin && <Lock className="w-4 h-4 inline ml-1 text-gray-400" />}
              </label>
              <input
                type="number"
                step="0.01"
                value={editFormData.amount || ''}
                onChange={(e) => setEditFormData({ ...editFormData, amount: parseFloat(e.target.value) })}
                disabled={!isAdmin}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isAdmin 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.paymentMethod}
                {!isAdmin && <Lock className="w-4 h-4 inline ml-1 text-gray-400" />}
              </label>
              <input
                type="text"
                value={editFormData.payment_method || ''}
                onChange={(e) => setEditFormData({ ...editFormData, payment_method: e.target.value })}
                disabled={!isAdmin}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isAdmin 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                    : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
                }`}
              />
            </div>
          </div>

          {/* Status - Always editable */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.status}
            </label>
            <select
              value={editFormData.status || 'pending'}
              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as Reservation['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">{t.pending}</option>
              <option value="confirmed">{t.confirmed}</option>
              <option value="cancelled">{t.cancelled}</option>
              <option value="completed">{t.completed}</option>
            </select>
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.notes}
              {!isAdmin && <Lock className="w-4 h-4 inline ml-1 text-gray-400" />}
            </label>
            <textarea
              value={editFormData.notes || ''}
              onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
              disabled={!isAdmin}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg ${
                isAdmin 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                  : 'border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Admin Notes - Only for admins */}
          {isAdmin && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.adminNotes}
              </label>
              <textarea
                value={editFormData.admin_notes || ''}
                onChange={(e) => setEditFormData({ ...editFormData, admin_notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t mt-6">
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              {t.cancel}
            </button>
            <button
              onClick={onSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};