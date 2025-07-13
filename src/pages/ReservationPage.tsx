import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Users, DollarSign, Clock, MapPin, Wifi, Coffee, Car, Shield, CheckCircle } from 'lucide-react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface ReservationPageProps {
  language: 'fr' | 'en';
}

const ReservationPage: React.FC<ReservationPageProps> = ({ language }) => {
  const { spaceType } = useParams();
  const [selectedDates, setSelectedDates] = useState<[Date, Date] | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    activity: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    occupants: 1,
    subscriptionType: 'daily'
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);

  const translations = {
    fr: {
      title: 'Réservation d\'Espace',
      steps: {
        selection: 'Sélection',
        details: 'Détails',
        payment: 'Paiement',
        confirmation: 'Confirmation'
      },
      spaces: {
        coworking: {
          title: 'Espace Coworking',
          description: 'Espace de travail partagé moderne et équipé',
          features: ['WiFi Haut Débit', 'Café/Thé Gratuit', 'Imprimante', 'Salle de Réunion'],
          dailyPrice: 15,
          monthlyPrice: 300,
          yearlyPrice: 3000,
          maxOccupants: 3
        },
        'bureau-prive': {
          title: 'Bureau Privé',
          description: 'Bureau privé entièrement équipé pour votre équipe',
          features: ['Bureau Privé', 'WiFi Dédié', 'Parking', 'Sécurité 24/7'],
          monthlyPrice: 500,
          yearlyPrice: 5500,
          maxOccupants: 10
        },
        'salle-reunion': {
          title: 'Salle de Réunion',
          description: 'Salle moderne pour vos réunions professionnelles',
          features: ['Écran de Présentation', 'Système Audio', 'WiFi', 'Climatisation'],
          hourlyPrice: 25,
          maxOccupants: 12
        }
      },
      form: {
        fullName: 'Nom Complet',
        activity: 'Activité',
        company: 'Entreprise',
        phone: 'Téléphone',
        email: 'Email',
        address: 'Adresse Physique',
        occupants: 'Nombre d\'Occupants',
        period: 'Période Souhaitée',
        subscriptionType: 'Type d\'Abonnement',
        daily: 'Journalier',
        monthly: 'Mensuel',
        yearly: 'Annuel',
        hourly: 'Horaire'
      },
      payment: {
        title: 'Paiement Sécurisé',
        methods: 'Moyens de Paiement',
        mobileMoney: 'Mobile Money',
        visa: 'Carte VISA',
        total: 'Total à Payer',
        processing: 'Traitement du Paiement...'
      },
      buttons: {
        next: 'Suivant',
        previous: 'Précédent',
        reserve: 'Réserver',
        pay: 'Payer Maintenant',
        newReservation: 'Nouvelle Réservation'
      },
      validation: {
        selectDates: 'Veuillez sélectionner les dates',
        fillRequired: 'Veuillez remplir tous les champs obligatoires',
        maxOccupants: 'Nombre maximum d\'occupants dépassé'
      },
      success: {
        title: 'Réservation Confirmée !',
        message: 'Votre réservation a été confirmée avec succès. Vous recevrez un email de confirmation.',
        reference: 'Référence'
      }
    },
    en: {
      title: 'Space Reservation',
      steps: {
        selection: 'Selection',
        details: 'Details',
        payment: 'Payment',
        confirmation: 'Confirmation'
      },
      spaces: {
        coworking: {
          title: 'Coworking Space',
          description: 'Modern and equipped shared workspace',
          features: ['High-Speed WiFi', 'Free Coffee/Tea', 'Printer', 'Meeting Room'],
          dailyPrice: 15,
          monthlyPrice: 300,
          yearlyPrice: 3000,
          maxOccupants: 3
        },
        'bureau-prive': {
          title: 'Private Office',
          description: 'Fully equipped private office for your team',
          features: ['Private Office', 'Dedicated WiFi', 'Parking', '24/7 Security'],
          monthlyPrice: 500,
          yearlyPrice: 5500,
          maxOccupants: 10
        },
        'salle-reunion': {
          title: 'Meeting Room',
          description: 'Modern room for your professional meetings',
          features: ['Presentation Screen', 'Audio System', 'WiFi', 'Air Conditioning'],
          hourlyPrice: 25,
          maxOccupants: 12
        }
      },
      form: {
        fullName: 'Full Name',
        activity: 'Activity',
        company: 'Company',
        phone: 'Phone',
        email: 'Email',
        address: 'Physical Address',
        occupants: 'Number of Occupants',
        period: 'Desired Period',
        subscriptionType: 'Subscription Type',
        daily: 'Daily',
        monthly: 'Monthly',
        yearly: 'Yearly',
        hourly: 'Hourly'
      },
      payment: {
        title: 'Secure Payment',
        methods: 'Payment Methods',
        mobileMoney: 'Mobile Money',
        visa: 'VISA Card',
        total: 'Total to Pay',
        processing: 'Processing Payment...'
      },
      buttons: {
        next: 'Next',
        previous: 'Previous',
        reserve: 'Reserve',
        pay: 'Pay Now',
        newReservation: 'New Reservation'
      },
      validation: {
        selectDates: 'Please select dates',
        fillRequired: 'Please fill all required fields',
        maxOccupants: 'Maximum occupants exceeded'
      },
      success: {
        title: 'Reservation Confirmed!',
        message: 'Your reservation has been successfully confirmed. You will receive a confirmation email.',
        reference: 'Reference'
      }
    }
  };

  const t = translations[language];
  const spaceInfo = t.spaces[spaceType as keyof typeof t.spaces] || t.spaces.coworking;

  const calculateTotal = () => {
    if (!selectedDates) return 0;

    const [startDate, endDate] = selectedDates;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (spaceType === 'salle-reunion') {
      return spaceInfo.hourlyPrice * 8 * days; // 8 hours per day
    }

    switch (formData.subscriptionType) {
      case 'daily':
        return spaceInfo.dailyPrice * days;
      case 'monthly':
        const months = Math.ceil(days / 30);
        return spaceInfo.monthlyPrice * months;
      case 'yearly':
        const years = Math.ceil(days / 365);
        return spaceInfo.yearlyPrice * years;
      default:
        return 0;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return selectedDates !== null;
      case 2:
        return formData.fullName && formData.email && formData.phone && formData.activity;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleReservation = () => {
    setShowPayment(true);
    setTimeout(() => {
      setCurrentStep(4);
      setShowPayment(false);
    }, 3000);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
            currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
          </div>
          {step < 4 && (
            <div className={`w-16 h-1 mx-2 ${
              currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{spaceInfo.title}</h3>
        <p className="text-gray-600 mb-6">{spaceInfo.description}</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Équipements Inclus</h4>
            <div className="space-y-2">
              {spaceInfo.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Tarifs</h4>
            <div className="space-y-2">
              {spaceInfo.dailyPrice && (
                <div className="flex justify-between">
                  <span>Journalier:</span>
                  <span className="font-semibold">${spaceInfo.dailyPrice}</span>
                </div>
              )}
              {spaceInfo.monthlyPrice && (
                <div className="flex justify-between">
                  <span>Mensuel:</span>
                  <span className="font-semibold">${spaceInfo.monthlyPrice}</span>
                </div>
              )}
              {spaceInfo.yearlyPrice && (
                <div className="flex justify-between">
                  <span>Annuel:</span>
                  <span className="font-semibold">${spaceInfo.yearlyPrice}</span>
                </div>
              )}
              {spaceInfo.hourlyPrice && (
                <div className="flex justify-between">
                  <span>Horaire:</span>
                  <span className="font-semibold">${spaceInfo.hourlyPrice}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-4">Sélectionner les Dates</h4>
        <div className="flex justify-center">
          <ReactCalendar
            onChange={setSelectedDates}
            value={selectedDates}
            selectRange={true}
            minDate={new Date()}
            className="border-none shadow-sm"
          />
        </div>
        {selectedDates && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sky-light-600">
              Période sélectionnée: {selectedDates[0].toLocaleDateString()} - {selectedDates[1].toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Informations de Réservation</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.fullName} *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.email} *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.phone} *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.activity} *
          </label>
          <input
            type="text"
            name="activity"
            value={formData.activity}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.company}
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.occupants} *
          </label>
          <select
            name="occupants"
            value={formData.occupants}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: spaceInfo.maxOccupants }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>{num} personne{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.form.address}
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {spaceType === 'coworking' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.form.subscriptionType}
            </label>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="subscriptionType"
                  value="daily"
                  checked={formData.subscriptionType === 'daily'}
                  onChange={handleInputChange}
                  className="text-blue-600"
                />
                <span>{t.form.daily}</span>
              </label>
              <label className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="subscriptionType"
                  value="monthly"
                  checked={formData.subscriptionType === 'monthly'}
                  onChange={handleInputChange}
                  className="text-blue-600"
                />
                <span>{t.form.monthly}</span>
              </label>
              <label className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="subscriptionType"
                  value="yearly"
                  checked={formData.subscriptionType === 'yearly'}
                  onChange={handleInputChange}
                  className="text-blue-600"
                />
                <span>{t.form.yearly}</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Récapitulatif de la Réservation</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Espace:</span>
            <span className="font-medium">{spaceInfo.title}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Client:</span>
            <span className="font-medium">{formData.fullName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Période:</span>
            <span className="font-medium">
              {selectedDates && `${selectedDates[0].toLocaleDateString()} - ${selectedDates[1].toLocaleDateString()}`}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Occupants:</span>
            <span className="font-medium">{formData.occupants} personne{formData.occupants > 1 ? 's' : ''}</span>
          </div>
          <div className="flex justify-between py-3 text-lg font-semibold text-blue-600">
            <span>Total:</span>
            <span>${calculateTotal()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-4">{t.payment.methods}</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border-2 border-sky-light-200 rounded-lg bg-sky-light-50 cursor-pointer hover:bg-sky-light-100 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-sky-light-400 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900">{t.payment.mobileMoney}</h5>
                <p className="text-sm text-gray-600">Orange Money, Airtel Money</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h5 className="font-medium text-gray-900">{t.payment.visa}</h5>
                <p className="text-sm text-gray-600">Paiement sécurisé</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPayment && (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">{t.payment.processing}</p>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.success.title}</h3>
      <p className="text-gray-600 mb-6">{t.success.message}</p>
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600">{t.success.reference}: <span className="font-mono font-medium">NZ-{Date.now()}</span></p>
      </div>
      <button
        onClick={() => {
          setCurrentStep(1);
          setSelectedDates(null);
          setFormData({
            fullName: '',
            activity: '',
            company: '',
            phone: '',
            email: '',
            address: '',
            occupants: 1,
            subscriptionType: 'daily'
          });
        }}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {t.buttons.newReservation}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">{t.title}</h1>
        </div>

        {renderStepIndicator()}

        <div className="mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {currentStep < 4 && (
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {t.buttons.previous}
            </button>

            <button
              onClick={currentStep === 3 ? handleReservation : nextStep}
              disabled={!validateStep(currentStep)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                !validateStep(currentStep)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-sky-light-400 text-white hover:bg-sky-light-500'
              }`}
            >
              {currentStep === 3 ? t.buttons.pay : t.buttons.next}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationPage;