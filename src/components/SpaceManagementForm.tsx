import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Eye, EyeOff } from 'lucide-react';
import { useSpaces } from '../hooks/useSpaces';
import { type Space } from '../lib/supabase';

interface SpaceManagementFormProps {
  language: 'fr' | 'en';
}

const SpaceManagementForm: React.FC<SpaceManagementFormProps> = ({ language }) => {
  const { spaces, loading, error, createSpace, updateSpace, deleteSpace } = useSpaces();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'coworking' as 'coworking' | 'bureau-prive' | 'salle-reunion',
    description: '',
    features: [] as string[],
    max_occupants: 1,
    daily_price: 0,
    monthly_price: 0,
    yearly_price: 0,
    hourly_price: 0,
    is_active: true,
    images: [] as string[],
    display_order: 0,
    admin_notes: '',
    availability_status: 'available' as 'available' | 'maintenance' | 'reserved' | 'unavailable'
  });
  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');

  const translations = {
    fr: {
      title: 'Gestion des Espaces',
      addSpace: 'Ajouter un Espace',
      editSpace: 'Modifier l\'Espace',
      form: {
        name: 'Nom de l\'espace',
        type: 'Type d\'espace',
        description: 'Description',
        features: 'Équipements',
        maxOccupants: 'Nombre maximum d\'occupants',
        dailyPrice: 'Prix journalier ($)',
        monthlyPrice: 'Prix mensuel ($)',
        yearlyPrice: 'Prix annuel ($)',
        hourlyPrice: 'Prix horaire ($)',
        isActive: 'Espace actif',
        images: 'Images (URLs)',
        displayOrder: 'Ordre d\'affichage',
        adminNotes: 'Notes administratives',
        availabilityStatus: 'Statut de disponibilité'
      },
      types: {
        coworking: 'Coworking',
        'bureau-prive': 'Bureau Privé',
        'salle-reunion': 'Salle de Réunion'
      },
      status: {
        available: 'Disponible',
        maintenance: 'Maintenance',
        reserved: 'Réservé',
        unavailable: 'Indisponible'
      },
      actions: {
        save: 'Enregistrer',
        cancel: 'Annuler',
        edit: 'Modifier',
        delete: 'Supprimer',
        add: 'Ajouter',
        addFeature: 'Ajouter équipement',
        addImage: 'Ajouter image'
      },
      messages: {
        loading: 'Chargement...',
        error: 'Erreur: ',
        success: 'Opération réussie',
        confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet espace ?'
      }
    },
    en: {
      title: 'Space Management',
      addSpace: 'Add Space',
      editSpace: 'Edit Space',
      form: {
        name: 'Space name',
        type: 'Space type',
        description: 'Description',
        features: 'Features',
        maxOccupants: 'Maximum occupants',
        dailyPrice: 'Daily price ($)',
        monthlyPrice: 'Monthly price ($)',
        yearlyPrice: 'Yearly price ($)',
        hourlyPrice: 'Hourly price ($)',
        isActive: 'Active space',
        images: 'Images (URLs)',
        displayOrder: 'Display order',
        adminNotes: 'Admin notes',
        availabilityStatus: 'Availability status'
      },
      types: {
        coworking: 'Coworking',
        'bureau-prive': 'Private Office',
        'salle-reunion': 'Meeting Room'
      },
      status: {
        available: 'Available',
        maintenance: 'Maintenance',
        reserved: 'Reserved',
        unavailable: 'Unavailable'
      },
      actions: {
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        add: 'Add',
        addFeature: 'Add feature',
        addImage: 'Add image'
      },
      messages: {
        loading: 'Loading...',
        error: 'Error: ',
        success: 'Operation successful',
        confirmDelete: 'Are you sure you want to delete this space?'
      }
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (editingSpace) {
      setFormData({
        name: editingSpace.name,
        type: editingSpace.type,
        description: editingSpace.description,
        features: editingSpace.features || [],
        max_occupants: editingSpace.max_occupants,
        daily_price: editingSpace.daily_price || 0,
        monthly_price: editingSpace.monthly_price || 0,
        yearly_price: editingSpace.yearly_price || 0,
        hourly_price: editingSpace.hourly_price || 0,
        is_active: editingSpace.is_active,
        images: editingSpace.images || [],
        display_order: editingSpace.display_order || 0,
        admin_notes: editingSpace.admin_notes || '',
        availability_status: editingSpace.availability_status || 'available'
      });
    }
  }, [editingSpace]);

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'coworking',
      description: '',
      features: [],
      max_occupants: 1,
      daily_price: 0,
      monthly_price: 0,
      yearly_price: 0,
      hourly_price: 0,
      is_active: true,
      images: [],
      display_order: 0,
      admin_notes: '',
      availability_status: 'available'
    });
    setEditingSpace(null);
    setNewFeature('');
    setNewImage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    
    try {
      if (editingSpace) {
        await updateSpace(editingSpace.id, formData);
      } else {
        await createSpace(formData);
      }
      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la sauvegarde';
      setSubmitError(errorMessage);
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (space: Space) => {
    setEditingSpace(space);
    setIsFormOpen(true);
  };

  const handleDelete = async (space: Space) => {
    if (window.confirm(t.messages.confirmDelete)) {
      try {
        await deleteSpace(space.id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }));
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
        </div>
        <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">{t.messages.loading}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t.addSpace}
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Erreur de connexion à la base de données</p>
          <p className="text-sm mt-1">{error}</p>
          <p className="text-sm mt-2">Vous pouvez toujours ajouter des espaces, ils seront sauvegardés une fois la connexion rétablie.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t.addSpace}
        </button>
      </div>

      {/* Spaces List */}
      <div className="grid gap-4">
        {spaces.map((space) => (
          <div key={space.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{space.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    space.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {space.is_active ? 'Actif' : 'Inactif'}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {t.types[space.type]}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{space.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {space.daily_price && (
                    <div>
                      <span className="font-medium">Journalier:</span> ${space.daily_price}
                    </div>
                  )}
                  {space.monthly_price && (
                    <div>
                      <span className="font-medium">Mensuel:</span> ${space.monthly_price}
                    </div>
                  )}
                  {space.yearly_price && (
                    <div>
                      <span className="font-medium">Annuel:</span> ${space.yearly_price}
                    </div>
                  )}
                  {space.hourly_price && (
                    <div>
                      <span className="font-medium">Horaire:</span> ${space.hourly_price}
                    </div>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Capacité:</span> {space.max_occupants} personnes
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(space)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(space)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  {editingSpace ? t.editSpace : t.addSpace}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">Erreur lors de la sauvegarde</p>
                    <p className="text-sm mt-1">{submitError}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.form.name}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.form.type}
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="coworking">{t.types.coworking}</option>
                      <option value="bureau-prive">{t.types['bureau-prive']}</option>
                      <option value="salle-reunion">{t.types['salle-reunion']}</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.form.description}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Prix */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.form.dailyPrice}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.daily_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, daily_price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.form.monthlyPrice}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.monthly_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, monthly_price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.form.yearlyPrice}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.yearly_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, yearly_price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.form.hourlyPrice}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.hourly_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, hourly_price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Capacité et ordre */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.form.maxOccupants}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.max_occupants}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_occupants: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.form.displayOrder}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.display_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Équipements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.form.features}
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Nouvel équipement..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        {t.actions.add}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.form.images}
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="URL de l'image..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={addImage}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        {t.actions.addImage}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Statuts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.form.availabilityStatus}
                    </label>
                    <select
                      value={formData.availability_status}
                      onChange={(e) => setFormData(prev => ({ ...prev, availability_status: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="available">{t.status.available}</option>
                      <option value="maintenance">{t.status.maintenance}</option>
                      <option value="reserved">{t.status.reserved}</option>
                      <option value="unavailable">{t.status.unavailable}</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="mr-2"
                      />
                      {t.form.isActive}
                    </label>
                  </div>
                </div>

                {/* Notes admin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.form.adminNotes}
                  </label>
                  <textarea
                    value={formData.admin_notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Boutons */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    {t.actions.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {submitLoading ? t.messages.loading : t.actions.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceManagementForm;