import React, { useState, useEffect } from 'react';
import { CheckCircle, CreditCard, Smartphone, Banknote, AlertCircle, Clock, Calendar } from 'lucide-react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { createReservation } from '../services/reservationService';
import { getSpaceInfo } from '../data/spacesData';

interface ReservationPageProps {
  language: 'fr' | 'en';
  spaceType?: string;
}

const ReservationPage: React.FC<ReservationPageProps> = ({ language, spaceType = 'coworking' }) => {
  const [selectedDates, setSelectedDates] = useState<[Date, Date] | null>(null);
  const [autoSelectDates, setAutoSelectDates] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    activity: '',
    company: '',
    phone: '',
    email: '',
    address: '',
    occupants: 1,
    subscriptionType: 'daily',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);

  // Nouveaux états pour la gestion des réservations
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  // Fonction améliorée pour mapper les types d'espaces vers les valeurs de la base de données
  const mapSpaceType = (type: string) => {
    const spaceTypeMap: Record<string, string> = {
      'coworking': 'coworking',
      'bureau-prive': 'bureau_prive',
      'domiciliation': 'domiciliation',
    };
    return spaceTypeMap[type] || type;
  };

  // --- Ajout useEffect pour forcer subscriptionType si ce n'est pas coworking ---
  useEffect(() => {
    if (spaceType !== 'coworking' && formData.subscriptionType === 'daily') {
      setFormData((prev) => ({ ...prev, subscriptionType: 'monthly' }));
    }
  }, [spaceType, formData.subscriptionType]);

  // Fonction améliorée pour sélectionner automatiquement une période d'un mois
  const handleDateSelection = (value: any) => {
    if (spaceType === 'coworking') {
      // Pour le coworking, comportement normal de sélection libre
      setSelectedDates(value);
      setAutoSelectDates(false);
    } else {
      // Pour les autres services, sélectionner automatiquement un mois
      if (value && !Array.isArray(value)) {
        // Si une seule date est sélectionnée, calculer automatiquement la période d'un mois
        const startDate = new Date(value);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(endDate.getDate() - 1); // Dernier jour de la période d'un mois
        
        setSelectedDates([startDate, endDate]);
        setAutoSelectDates(true);
        
        // Afficher un message informatif à l'utilisateur
        setTimeout(() => {
          const message = language === 'fr' 
            ? `Période automatiquement sélectionnée : ${startDate.toLocaleDateString('fr-FR')} au ${endDate.toLocaleDateString('fr-FR')}`
            : `Period automatically selected: ${startDate.toLocaleDateString('en-US')} to ${endDate.toLocaleDateString('en-US')}`;
          
          console.log(message);
        }, 100);
        
      } else if (Array.isArray(value) && value.length === 2) {
        // Si une plage est déjà sélectionnée, la conserver
        setSelectedDates(value);
        setAutoSelectDates(false);
      }
    }
  };

  // Fonction pour réinitialiser la sélection de dates
  const handleResetDates = () => {
    setSelectedDates(null);
    setAutoSelectDates(false);
  };

  // Fonction pour calculer le nombre de jours sélectionnés
  const calculateSelectedDays = () => {
    if (!selectedDates) return 0;
    
    if (Array.isArray(selectedDates) && selectedDates.length === 2) {
      const startDate = new Date(selectedDates[0]);
      const endDate = new Date(selectedDates[1]);
      const timeDifference = endDate.getTime() - startDate.getTime();
      return Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;
    }
    
    return 1;
  };

  const translations = {
    fr: {
      title: "Réservation d'Espace",
      steps: {
        selection: 'Sélection',
        details: 'Détails',
        payment: 'Paiement',
        confirmation: 'Confirmation',
      },
      form: {
        fullName: 'Nom Complet',
        activity: 'Activité',
        company: 'Entreprise',
        phone: 'Téléphone',
        email: 'Email',
        address: 'Adresse Physique',
        occupants: "Nombre d'Occupants",
        period: 'Période Souhaitée',
        subscriptionType: "Type d'Abonnement",
        daily: 'Journalier',
        monthly: 'Mensuel',
        yearly: 'Annuel',
        hourly: 'Horaire',
        dates: 'Dates de réservation',
        cancel: 'Annuler',
        submit: 'Confirmer la réservation'
      },
      payment: {
        title: 'Paiement Sécurisé',
        methods: 'Moyens de Paiement',
        mobileMoney: 'Mobile Money',
        visa: 'Carte VISA',
        cash: "Paiement en espèces",
        total: 'Total à Payer',
        processing: 'Traitement en cours...',
        checking: 'Vérification du paiement en cours...',
        error: 'Erreur de paiement : ',
        success: 'Paiement réussi !',
        failed: 'Paiement échoué',
        cancelled: 'Paiement annulé'
      },
      buttons: {
        next: 'Suivant',
        previous: 'Précédent',
        reserve: 'Réserver',
        pay: 'Payer Maintenant',
        newReservation: 'Nouvelle Réservation',
      },
      validation: {
        selectDates: 'Veuillez sélectionner les dates',
        fillRequired: 'Veuillez remplir tous les champs obligatoires',
        maxOccupants: "Nombre maximum d'occupants dépassé",
      },
      success: {
        title: 'Réservation Confirmée !',
        message:
          'Votre réservation a été confirmée avec succès. Vous recevrez un email de confirmation.',
        reference: 'Référence',
      },
    },
    en: {
      title: 'Space Reservation',
      steps: {
        selection: 'Selection',
        details: 'Details',
        payment: 'Payment',
        confirmation: 'Confirmation',
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
        hourly: 'Hourly',
        dates: 'Reservation dates',
        cancel: 'Cancel',
        submit: 'Confirm reservation'
      },
      payment: {
        title: 'Secure Payment',
        methods: 'Payment Methods',
        mobileMoney: 'Mobile Money',
        visa: 'VISA Card',
        cash: 'Cash Payment',
        total: 'Total to Pay',
        processing: 'Processing...',
        checking: 'Checking payment status...',
        error: 'Payment error: ',
        success: 'Payment successful!',
        failed: 'Payment failed',
        cancelled: 'Payment cancelled'
      },
      buttons: {
        next: 'Next',
        previous: 'Previous',
        reserve: 'Reserve',
        pay: 'Pay Now',
        newReservation: 'New Reservation',
      },
      validation: {
        selectDates: 'Please select dates',
        fillRequired: 'Please fill all required fields',
        maxOccupants: 'Maximum occupants exceeded',
      },
      success: {
        title: 'Reservation Confirmed!',
        message:
          'Your reservation has been successfully confirmed. You will receive a confirmation email.',
        reference: 'Reference',
      },
    },
  };

  const t = translations[language];
  
  // Obtenir les informations de l'espace depuis le fichier de données
  const spaceInfo = getSpaceInfo(spaceType || 'coworking', language);

  if (!spaceInfo) {
    return (
      <div className="max-w-3xl mx-auto p-6 min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            {language === 'fr' ? 'Espace non trouvé' : 'Space not found'}
          </h1>
          <p className="mt-4">
            {language === 'fr' 
              ? 'L\'espace demandé n\'existe pas.' 
              : 'The requested space does not exist.'}
          </p>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!selectedDates) return 0;

    const [startDate, endDate] = selectedDates;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (spaceType === 'domiciliation') {
      return (spaceInfo.monthlyPrice || 0) * Math.ceil(days / 30);
    }

    switch (formData.subscriptionType) {
      case 'daily':
        return (spaceInfo.dailyPrice || 0) * days;
      case 'monthly':
        const months = Math.ceil(days / 30);
        return (spaceInfo.monthlyPrice || 0) * months;
      case 'yearly':
        const years = Math.ceil(days / 365);
        return (spaceInfo.yearlyPrice || 0) * years;
      default:
        return 0;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'occupants' ? Number(value) : value,
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return selectedDates !== null;
      case 2:
        return (
          formData.fullName !== '' &&
          formData.email !== '' &&
          formData.phone !== '' &&
          formData.activity !== ''
        );
      case 3:
        return selectedPaymentMethod !== null && !paymentProcessing;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCashPayment = async () => {
    if (!selectedDates) return;

    setReservationError(null);

    const cashTransactionId = `CASH_${Date.now()}`;

    try {
      const mappedSpaceType = mapSpaceType(spaceType || 'coworking');
      
      // Formatage correct des dates pour éviter les problèmes de timezone
      const startDateFormatted = selectedDates[0].toISOString().split('T')[0];
      const endDateFormatted = selectedDates[1].toISOString().split('T')[0];
      
      console.log(`🔍 Preparing reservation data:`, {
        originalSpaceType: spaceType,
        mappedSpaceType: mappedSpaceType,
        startDate: startDateFormatted,
        endDate: endDateFormatted,
        subscriptionType: formData.subscriptionType,
        amount: calculateTotal()
      });

      const reservationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        activity: formData.activity,
        address: formData.address,
        spaceType: mappedSpaceType,
        startDate: startDateFormatted,
        endDate: endDateFormatted,
        occupants: formData.occupants,
        subscriptionType: formData.subscriptionType,
        amount: calculateTotal(),
        paymentMethod: 'cash',
        transactionId: cashTransactionId,
      };

      console.log(`🚀 Sending reservation data:`, reservationData);

      const result = await createReservation(reservationData);
      
      if (result.success) {
        console.log(`✅ Reservation created successfully:`, result);
        setReservationSuccess(true);
        setEmailSent(result.emailSent || false);
        setCurrentStep(4);
        
        // Afficher une notification si l'email n'a pas été envoyé
        if (!result.emailSent) {
          console.warn('⚠️ Email de confirmation non envoyé pour la réservation:', result.reservation?.id);
        }
      } else {
        throw new Error(result.error || 'Échec de la création de la réservation');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la réservation cash:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la réservation';
      setReservationError(errorMessage);
      
      // Log détaillé pour debug
      console.error('❌ Détails de l\'erreur:', {
        error,
        spaceType,
        mappedSpaceType: mapSpaceType(spaceType || 'coworking'),
        formData,
        selectedDates
      });
    }
  };

  // Gestion principale des réservations
  const handleReservation = async () => {
    if (!selectedPaymentMethod) return;
    
    // Déterminer le type de paiement et la méthode
    let paymentMethod = '';
    let transactionId = '';
    
    switch (selectedPaymentMethod) {
      case 'ORANGE_MONEY':
        paymentMethod = 'orange_money';
        transactionId = `OM_${Date.now()}`;
        break;
      case 'AIRTEL_MONEY':
        paymentMethod = 'airtel_money';
        transactionId = `AM_${Date.now()}`;
        break;
      case 'VISA':
        paymentMethod = 'visa';
        transactionId = `VISA_${Date.now()}`;
        break;
      case 'CASH':
        paymentMethod = 'cash';
        transactionId = `CASH_${Date.now()}`;
        break;
      default:
        paymentMethod = 'cash';
        transactionId = `CASH_${Date.now()}`;
    }
    
    await handlePayment(paymentMethod, transactionId);
  };
  
  const handlePayment = async (paymentMethod: string, transactionId: string) => {
    if (!selectedDates) return;

    setReservationError(null);

    try {
      const mappedSpaceType = mapSpaceType(spaceType || 'coworking');
      
      // Formatage correct des dates pour éviter les problèmes de timezone
      const startDateFormatted = selectedDates[0].toISOString().split('T')[0];
      const endDateFormatted = selectedDates[1].toISOString().split('T')[0];
      
      console.log(`🔍 Preparing reservation data:`, {
        originalSpaceType: spaceType,
        mappedSpaceType: mappedSpaceType,
        startDate: startDateFormatted,
        endDate: endDateFormatted,
        subscriptionType: formData.subscriptionType,
        amount: calculateTotal(),
        paymentMethod
      });

      const reservationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        activity: formData.activity,
        address: formData.address,
        spaceType: mappedSpaceType,
        startDate: startDateFormatted,
        endDate: endDateFormatted,
        occupants: formData.occupants,
        subscriptionType: formData.subscriptionType,
        amount: calculateTotal(),
        paymentMethod: paymentMethod,
        transactionId: transactionId,
      };

      console.log(`🚀 Sending reservation data:`, reservationData);

      const result = await createReservation(reservationData);
      
      if (result.success) {
        console.log(`✅ Reservation created successfully:`, result);
        setReservationSuccess(true);
        setEmailSent(result.emailSent || false);
        setCurrentStep(4);
        
        // Afficher une notification si l'email n'a pas été envoyé
        if (!result.emailSent) {
          console.warn('⚠️ Email de confirmation non envoyé pour la réservation:', result.reservation?.id);
        }
      } else {
        throw new Error(result.error || 'Échec de la création de la réservation');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la réservation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la réservation';
      setReservationError(errorMessage);
      
      // Log détaillé pour debug
      console.error('❌ Détails de l\'erreur:', {
        error,
        spaceType,
        mappedSpaceType: mapSpaceType(spaceType || 'coworking'),
        formData,
        selectedDates
      });
    }
  };

  // Variables pour compatibilité
  const paymentLoading = false;
  const paymentProcessing = false;
  const checkingPayment = false;
  const paymentError = null;
  const transactionId = formData.fullName + '_' + Date.now();

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
              currentStep >= step 
                ? 'bg-blue-600 text-white shadow-lg transform scale-110' 
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {currentStep > step ? <CheckCircle className="w-7 h-7" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`w-20 h-1 mx-3 rounded-full transition-all duration-300 ${
                currentStep > step 
                  ? 'bg-blue-600' 
                  : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-10">
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{spaceInfo.title}</h3>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">{spaceInfo.description}</p>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Équipements Inclus</h4>
            <div className="space-y-3">
              {spaceInfo.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-lg">Tarifs</h4>
            <div className="space-y-3 bg-gray-50 p-6 rounded-xl border border-gray-200">
              {spaceInfo.dailyPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Journalier:</span>
                  <span className="font-bold text-blue-600 text-lg">${spaceInfo.dailyPrice}</span>
                </div>
              )}
              {spaceInfo.monthlyPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mensuel:</span>
                  <span className="font-bold text-blue-600 text-lg">${spaceInfo.monthlyPrice}</span>
                </div>
              )}
              {spaceInfo.yearlyPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Annuel:</span>
                  <span className="font-bold text-blue-600 text-lg">${spaceInfo.yearlyPrice}</span>
                </div>
              )}
              {spaceInfo.hourlyPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Horaire:</span>
                  <span className="font-bold text-blue-600 text-lg">${spaceInfo.hourlyPrice}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-6 text-xl text-center">
          {t.form.dates}
        </h4>
        
        {/* Informations spéciales pour les services non-coworking */}
        {spaceType !== 'coworking' && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  {language === 'fr' 
                    ? "Sélection automatique d'un mois"
                    : "Automatic one-month selection"}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {language === 'fr'
                    ? "Sélectionnez une date de début, le système choisira automatiquement une période d'un mois."
                    : "Select a start date, the system will automatically choose a one-month period."}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center bg-gray-50 p-6 rounded-xl border border-gray-200">
          <ReactCalendar
            onChange={handleDateSelection}
            selectRange={spaceType === 'coworking'}
            value={selectedDates}
            minDate={new Date()}
            className="rounded-xl border-2 border-blue-200 shadow-lg"
          />
        </div>

        {/* Affichage de la période sélectionnée */}
        {selectedDates && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {Array.isArray(selectedDates) && selectedDates.length === 2 ? (
                    language === 'fr' 
                      ? `Période : ${new Date(selectedDates[0]).toLocaleDateString('fr-FR')} au ${new Date(selectedDates[1]).toLocaleDateString('fr-FR')}`
                      : `Period: ${new Date(selectedDates[0]).toLocaleDateString('en-US')} to ${new Date(selectedDates[1]).toLocaleDateString('en-US')}`
                  ) : (
                    language === 'fr' 
                      ? `Date sélectionnée : ${new Date(selectedDates).toLocaleDateString('fr-FR')}`
                      : `Selected date: ${new Date(selectedDates).toLocaleDateString('en-US')}`
                  )}
                </span>
              </div>
              
              {autoSelectDates && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {language === 'fr' ? "Auto-sélection" : "Auto-selected"}
                </span>
              )}
            </div>
            
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-green-600">
                {language === 'fr' 
                  ? `Durée : ${calculateSelectedDays()} jour${calculateSelectedDays() > 1 ? 's' : ''}`
                  : `Duration: ${calculateSelectedDays()} day${calculateSelectedDays() > 1 ? 's' : ''}`
                }
              </span>
              
              <button
                type="button"
                onClick={handleResetDates}
                className="text-xs text-green-600 hover:text-green-800 underline"
              >
                {language === 'fr' ? "Modifier" : "Change"}
              </button>
            </div>
          </div>
        )}

        {!selectedDates && (
          <p className="text-red-600 mt-4 text-center font-medium">{t.validation.selectDates}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Informations Personnelles</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-600 mb-2">
            {t.form.fullName} *
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            required
          />
        </div>

        <div>
          <label htmlFor="activity" className="block text-sm font-semibold text-gray-600 mb-2">
            {t.form.activity} *
          </label>
          <input
            type="text"
            name="activity"
            id="activity"
            value={formData.activity}
            onChange={handleInputChange}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            required
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-gray-600 mb-2">
            {t.form.company}
          </label>
          <input
            type="text"
            name="company"
            id="company"
            value={formData.company}
            onChange={handleInputChange}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-600 mb-2">
            {t.form.phone} *
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-600 mb-2">
            {t.form.email} *
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="address" className="block text-sm font-semibold text-gray-600 mb-2">
          {t.form.address}
        </label>
        <textarea
          name="address"
          id="address"
          rows={3}
          value={formData.address}
          onChange={handleInputChange}
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
        />
      </div>

      {spaceType !== 'domiciliation' && (
        <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 mt-6">
          <div>
            <label htmlFor="occupants" className="block text-sm font-semibold text-gray-600 mb-2">
              {t.form.occupants}
            </label>
            <input
              type="number"
              min={1}
              max={spaceInfo.maxOccupants}
              name="occupants"
              id="occupants"
              value={formData.occupants}
              onChange={handleInputChange}
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
            {formData.occupants > spaceInfo.maxOccupants && (
              <p className="text-red-600 mt-2 font-medium">{t.validation.maxOccupants}</p>
            )}
          </div>

          <div>
            <label htmlFor="subscriptionType" className="block text-sm font-semibold text-gray-600 mb-2">
              {t.form.subscriptionType}
            </label>
            <select
              id="subscriptionType"
              name="subscriptionType"
              value={formData.subscriptionType}
              onChange={handleInputChange}
              disabled={spaceType !== 'coworking'}
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            >
              {spaceType === 'coworking' && <option value="daily">{t.form.daily}</option>}
              <option value="monthly">{t.form.monthly}</option>
              <option value="yearly">{t.form.yearly}</option>
            </select>
            {spaceType !== 'coworking' && (
              <p className="mt-2 text-sm italic text-gray-600 bg-orange-50 p-3 rounded-lg">
                {language === 'fr'
                  ? "Pour ce service, seuls les abonnements mensuels et annuels sont disponibles."
                  : "For this service, only monthly and yearly subscriptions are available."}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => {
    const total = calculateTotal();
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">{t.payment.title}</h2>

        {/* Options de paiement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Orange Money */}
          <button
            type="button"
            onClick={() => setSelectedPaymentMethod('ORANGE_MONEY')}
            className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
              selectedPaymentMethod === 'ORANGE_MONEY'
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white text-orange-600 border-orange-200 hover:border-orange-300'
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-full ${
                selectedPaymentMethod === 'ORANGE_MONEY' 
                  ? 'bg-white/20' 
                  : 'bg-orange-100'
              }`}>
                <Smartphone className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">Orange Money</h3>
                <p className="text-sm mt-1">
                  {language === 'fr' ? 'Paiement via Orange Money' : 'Pay with Orange Money'}
                </p>
              </div>
              {selectedPaymentMethod === 'ORANGE_MONEY' && (
                <CheckCircle className="w-5 h-5" />
              )}
            </div>
          </button>

          {/* Airtel Money */}
          <button
            type="button"
            onClick={() => setSelectedPaymentMethod('AIRTEL_MONEY')}
            className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
              selectedPaymentMethod === 'AIRTEL_MONEY'
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-red-600 border-red-200 hover:border-red-300'
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-full ${
                selectedPaymentMethod === 'AIRTEL_MONEY' 
                  ? 'bg-white/20' 
                  : 'bg-red-100'
              }`}>
                <Smartphone className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">Airtel Money</h3>
                <p className="text-sm mt-1">
                  {language === 'fr' ? 'Paiement via Airtel Money' : 'Pay with Airtel Money'}
                </p>
              </div>
              {selectedPaymentMethod === 'AIRTEL_MONEY' && (
                <CheckCircle className="w-5 h-5" />
              )}
            </div>
          </button>

          {/* Carte VISA */}
          <button
            type="button"
            onClick={() => setSelectedPaymentMethod('VISA')}
            className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
              selectedPaymentMethod === 'VISA'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-blue-600 border-blue-200 hover:border-blue-300'
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-full ${
                selectedPaymentMethod === 'VISA' 
                  ? 'bg-white/20' 
                  : 'bg-blue-100'
              }`}>
                <CreditCard className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">Carte VISA</h3>
                <p className="text-sm mt-1">
                  {language === 'fr' ? 'Carte bancaire internationale' : 'International bank card'}
                </p>
              </div>
              {selectedPaymentMethod === 'VISA' && (
                <CheckCircle className="w-5 h-5" />
              )}
            </div>
          </button>

          {/* Paiement en espèces */}
          <button
            type="button"
            onClick={() => setSelectedPaymentMethod('CASH')}
            className={`p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
              selectedPaymentMethod === 'CASH'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-green-600 border-green-200 hover:border-green-300'
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-full ${
                selectedPaymentMethod === 'CASH' 
                  ? 'bg-white/20' 
                  : 'bg-green-100'
              }`}>
                <Banknote className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">{t.payment.cash}</h3>
                <p className="text-sm mt-1">
                  {language === 'fr' ? 'Paiement sur place' : 'Pay on-site'}
                </p>
              </div>
              {selectedPaymentMethod === 'CASH' && (
                <CheckCircle className="w-5 h-5" />
              )}
            </div>
          </button>
        </div>

        {/* Messages informatifs selon la méthode sélectionnée */}
        {selectedPaymentMethod && (
          <div className="mb-6 p-4 rounded-xl border">
            {selectedPaymentMethod === 'ORANGE_MONEY' && (
              <div className="bg-orange-50 border-orange-200">
                <p className="text-orange-700 text-center font-medium">
                  {language === 'fr'
                    ? "Vous avez choisi Orange Money. Vous recevrez un SMS avec les instructions de paiement."
                    : "You have chosen Orange Money. You will receive an SMS with payment instructions."}
                </p>
              </div>
            )}
            {selectedPaymentMethod === 'AIRTEL_MONEY' && (
              <div className="bg-red-50 border-red-200">
                <p className="text-red-700 text-center font-medium">
                  {language === 'fr'
                    ? "Vous avez choisi Airtel Money. Vous recevrez un SMS avec les instructions de paiement."
                    : "You have chosen Airtel Money. You will receive an SMS with payment instructions."}
                </p>
              </div>
            )}
            {selectedPaymentMethod === 'VISA' && (
              <div className="bg-blue-50 border-blue-200">
                <p className="text-blue-700 text-center font-medium">
                  {language === 'fr'
                    ? "Vous avez choisi le paiement par carte VISA. Vous serez redirigé vers une page de paiement sécurisée."
                    : "You have chosen VISA card payment. You will be redirected to a secure payment page."}
                </p>
              </div>
            )}
            {selectedPaymentMethod === 'CASH' && (
              <div className="bg-green-50 border-green-200">
                <p className="text-green-700 text-center font-medium">
                  {language === 'fr'
                    ? "Vous avez choisi de payer en espèces. Merci de régler sur place lors de votre arrivée."
                    : "You have chosen to pay cash. Please pay on-site upon arrival."}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Total à payer</p>
            <p className="text-3xl font-bold text-blue-600">
              {t.payment.total}: ${total}
            </p>
          </div>
        </div>

        {reservationError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 font-semibold text-center">Erreur: {reservationError}</p>
          </div>
        )}

        {paymentProcessing && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-700 text-center font-medium">{t.payment.processing}</p>
          </div>
        )}
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="text-center space-y-8 p-12 bg-white rounded-xl shadow-sm border border-gray-100">
      <CheckCircle className="mx-auto w-24 h-24 text-green-500" />
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{t.success.title}</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">{t.success.message}</p>
      
      {emailSent && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <p className="text-green-700 font-medium">
            ✅ {language === 'fr' ? 'Email de confirmation envoyé avec succès' : 'Confirmation email sent successfully'}
          </p>
        </div>
      )}
      
      {!emailSent && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <p className="text-orange-700 font-medium">
            ⚠️ {language === 'fr' 
              ? 'Réservation confirmée, mais email de confirmation non envoyé. Veuillez noter votre référence de réservation.' 
              : 'Reservation confirmed, but confirmation email not sent. Please note your reservation reference.'}
          </p>
          <p className="text-orange-600 text-sm mt-2">
            {language === 'fr' 
              ? 'Vous pouvez contacter notre support si vous avez besoin d\'une confirmation par email.' 
              : 'You can contact our support if you need an email confirmation.'}
          </p>
        </div>
      )}
      
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <p className="text-gray-600 mb-2">Référence de votre réservation</p>
        <p className="text-xl font-bold text-blue-600 font-mono">{transactionId}</p>
      </div>

      <button
        type="button"
        onClick={() => {
          setCurrentStep(1);
          setSelectedDates(null);
          setAutoSelectDates(false);
          setFormData({
            fullName: '',
            activity: '',
            company: '',
            phone: '',
            email: '',
            address: '',
            occupants: 1,
            subscriptionType: 'daily',
          });
          setSelectedPaymentMethod(null);
          setReservationError(null);
          setReservationSuccess(false);
          setEmailSent(false);
        }}
        className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg transform hover:scale-105"
      >
        {t.buttons.newReservation}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-700 font-sans pt-20">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t.title}
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Réservez votre espace de travail en quelques étapes simples
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepIndicator()}
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentStep === 3) {
              handleReservation();
            } else {
              nextStep();
            }
          }}
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep !== 4 && (
            <div className="mt-12 flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 font-medium"
                  disabled={paymentProcessing}
                >
                  {t.buttons.previous}
                </button>
              )}
              
              {currentStep !== 3 && (
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto disabled:opacity-50 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105"
                  disabled={!validateStep(currentStep) || paymentLoading}
                >
                  {t.buttons.next}
                </button>
              )}
              
              {currentStep === 3 && (
                <button
                  type="button"
                  onClick={handleReservation}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto disabled:opacity-50 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105"
                  disabled={paymentProcessing || paymentLoading || !selectedPaymentMethod}
                >
                  {paymentProcessing || paymentLoading ? 
                    (language === 'fr' ? 'Traitement...' : 'Processing...') : 
                    (selectedPaymentMethod === 'CASH' ? t.buttons.reserve : t.buttons.pay)
                  }
                </button>
              )}
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default ReservationPage;