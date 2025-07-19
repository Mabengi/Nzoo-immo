import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, CreditCard, Smartphone, Banknote } from 'lucide-react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { createReservation } from '../services/reservationService';
import { getSpaceInfo } from '../data/spacesData';

interface ReservationPageProps {
  language: 'fr' | 'en';
}

const CINETPAY_API_KEY = '17852597076873f647d76131.41366104';
const CINETPAY_SITE_ID = '105901836';

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
    subscriptionType: 'daily',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  // Ajout 'cash' ici
  const [paymentMethod, setPaymentMethod] = useState<'mobileMoney' | 'visa' | 'cash' | null>(null);

  // Nouveaux états pour paiement avancé
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Nouveaux états pour la gestion des réservations
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  // --- Ajout useEffect pour forcer subscriptionType si bureau-prive ---
  useEffect(() => {
    if (spaceType === 'bureau-prive' && formData.subscriptionType === 'daily') {
      setFormData((prev) => ({ ...prev, subscriptionType: 'monthly' }));
    }
  }, [spaceType, formData.subscriptionType]);
  // --------------------------------------------------------------------

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
      },
      payment: {
        title: 'Paiement Sécurisé',
        methods: 'Moyens de Paiement',
        mobileMoney: 'Mobile Money',
        visa: 'Carte VISA',
        cash: "Paiement en espèces",
        total: 'Total à Payer',
        processing: 'Traitement du Paiement...',
        checking: 'Vérification du paiement en cours...',
        error: 'Erreur de paiement : ',
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
      },
      payment: {
        title: 'Secure Payment',
        methods: 'Payment Methods',
        mobileMoney: 'Mobile Money',
        visa: 'VISA Card',
        cash: 'Cash Payment',
        total: 'Total to Pay',
        processing: 'Processing Payment...',
        checking: 'Checking payment status...',
        error: 'Payment error: ',
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

    if (spaceType === 'salle-reunion') {
      return (spaceInfo.hourlyPrice || 0) * 8 * days; // 8 hours per day
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
        return paymentMethod !== null && !paymentProcessing;
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

  // ------------- DÉBUT intégration paiement CinetPay avancé -------------
  const initiatePayment = async () => {
    setPaymentProcessing(true);
    setPaymentError(null);

    const amount = calculateTotal();
    const currency = 'USD';
    const txId = `NzooImmo_${Date.now()}`;
    setTransactionId(txId);

    const channels = paymentMethod === 'visa' ? 'CARD' : 'MOBILE_MONEY';

    const payload = {
      apikey: CINETPAY_API_KEY,
      site_id: CINETPAY_SITE_ID,
      transaction_id: txId,
      amount: amount,
      currency: currency,
      channels: channels,
      description: `Réservation ${spaceType}`,
      customer_name: formData.fullName,
      customer_email: formData.email,
      customer_phone_number: formData.phone,
      notify_url: 'https://ton-backend.com/api/cinetpay-notify', // à adapter à ton backend
      return_url: window.location.origin + '/reservation-complete',
    };

    try {
      const res = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.code !== '201') {
        setPaymentError(language === 'fr' ? "Erreur lors de l'initialisation du paiement." : 'Payment initialization error');
        setPaymentProcessing(false);
        return;
      }

      setPaymentToken(data.data.payment_token);

      const win = window.open(`https://payment.cinetpay.com/?payment_token=${data.data.payment_token}`, '_blank', 'width=600,height=700');
      if (!win) {
        setPaymentError(language === 'fr' ? "Impossible d'ouvrir la fenêtre de paiement. Autorisez les pop-ups." : 'Cannot open payment window. Allow pop-ups.');
        setPaymentProcessing(false);
        return;
      }
      setPaymentWindow(win);

      setCheckingPayment(true);
      checkPaymentStatus(txId, win);
    } catch (err) {
      setPaymentError(language === 'fr' ? 'Erreur de connexion au service de paiement.' : 'Payment service connection error');
      setPaymentProcessing(false);
    }
  };

  const checkPaymentStatus = (txId: string, win: Window | null) => {
    const intervalId = setInterval(async () => {
      if (win && win.closed) {
        clearInterval(intervalId);
        setPaymentProcessing(false);
        setCheckingPayment(false);
        setPaymentError(language === 'fr' ? "Paiement annulé par l'utilisateur." : 'Payment cancelled by user.');
        return;
      }

      try {
        const statusRes = await fetch(
          `https://api-checkout.cinetpay.com/v2/payment/check?apikey=${CINETPAY_API_KEY}&site_id=${CINETPAY_SITE_ID}&transaction_id=${txId}`
        );
        const statusData = await statusRes.json();

        if (statusData.code === '00' && statusData.data.status === 'ACCEPTED') {
          clearInterval(intervalId);
          setPaymentProcessing(false);
          setCheckingPayment(false);
          if (win && !win.closed) win.close();
          setCurrentStep(4);
        } else if (statusData.data.status === 'REFUSED' || statusData.data.status === 'CANCELED') {
          clearInterval(intervalId);
          setPaymentProcessing(false);
          setCheckingPayment(false);
          if (win && !win.closed) win.close();
          setPaymentError(language === 'fr' ? 'Paiement refusé ou annulé.' : 'Payment refused or cancelled.');
        }
      } catch (e) {
        // ignore network errors, continue checking
      }
    }, 5000);
  };

  // Modifié pour gérer paiement cash
  const handleReservation = () => {
    if (!paymentMethod) return;

    if (paymentMethod === 'cash') {
      handleCashPayment();
      return;
    }

    // Paiement en ligne via CinetPay
    initiatePayment();
  };

  const handleCashPayment = async () => {
    if (!selectedDates) return;

    setPaymentProcessing(true);
    setPaymentError(null);
    setReservationError(null);

    const transactionId = `CASH_${Date.now()}`;
    setTransactionId(transactionId);

    try {
      const reservationData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        activity: formData.activity,
        address: formData.address,
        spaceType: spaceType || 'coworking',
        startDate: selectedDates[0].toISOString().split('T')[0],
        endDate: selectedDates[1].toISOString().split('T')[0],
        occupants: formData.occupants,
        subscriptionType: formData.subscriptionType,
        amount: calculateTotal(),
        paymentMethod: 'cash',
        transactionId: transactionId,
      };

      const result = await createReservation(reservationData);
      
      if (result.success) {
        setReservationSuccess(true);
        setEmailSent(result.emailSent);
        setCurrentStep(4);
      }
    } catch (error) {
      setReservationError(error instanceof Error ? error.message : 'Erreur lors de la réservation');
    } finally {
      setPaymentProcessing(false);
    }
  };
  // ------------- FIN intégration paiement CinetPay avancé -------------

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {currentStep > step ? <CheckCircle className="w-6 h-6" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`w-16 h-1 mx-2 ${
                currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
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
            selectRange={true}
            value={selectedDates}
            minDate={new Date()}
            className="rounded-lg border border-gray-300 shadow-sm"
          />
        </div>
        {!selectedDates && (
          <p className="text-red-600 mt-3">{t.validation.selectDates}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          {t.form.fullName} *
        </label>
        <input
          type="text"
          name="fullName"
          id="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
          required
        />
      </div>

      <div>
        <label htmlFor="activity" className="block text-sm font-medium text-gray-700">
          {t.form.activity} *
        </label>
        <input
          type="text"
          name="activity"
          id="activity"
          value={formData.activity}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
          required
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
          {t.form.company}
        </label>
        <input
          type="text"
          name="company"
          id="company"
          value={formData.company}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          {t.form.phone} *
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t.form.email} *
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
          required
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          {t.form.address}
        </label>
        <textarea
          name="address"
          id="address"
          rows={3}
          value={formData.address}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
        />
      </div>

      {spaceType !== 'salle-reunion' && (
        <>
          <div>
            <label htmlFor="occupants" className="block text-sm font-medium text-gray-700">
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
            />
            {formData.occupants > spaceInfo.maxOccupants && (
              <p className="text-red-600 mt-2">{t.validation.maxOccupants}</p>
            )}
          </div>

          <div>
            <label htmlFor="subscriptionType" className="block text-sm font-medium text-gray-700">
              {t.form.subscriptionType}
            </label>
            <select
              id="subscriptionType"
              name="subscriptionType"
              value={formData.subscriptionType}
              onChange={handleInputChange}
              disabled={spaceType === 'bureau-prive'}
              className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
            >
              <option value="daily">{t.form.daily}</option>
              <option value="monthly">{t.form.monthly}</option>
              <option value="yearly">{t.form.yearly}</option>
            </select>
            {spaceType === 'bureau-prive' && (
              <p className="mt-2 text-sm italic text-gray-600">
                {language === 'fr'
                  ? "Pour les bureaux privés, seul l'abonnement mensuel est disponible."
                  : "For private offices, only monthly subscription is available."}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );

  const renderStep3 = () => {
    const total = calculateTotal();

    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">{t.payment.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Mobile Money Button */}
          <button
            type="button"
            onClick={() => setPaymentMethod('mobileMoney')}
            className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-200 ${
              paymentMethod === 'mobileMoney'
                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl ring-4 ring-orange-200'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300 hover:shadow-lg'
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-full transition-colors ${
                paymentMethod === 'mobileMoney'
                  ? 'bg-white/20'
                  : 'bg-orange-100 group-hover:bg-orange-200'
              }`}>
                <Smartphone className={`w-8 h-8 ${
                  paymentMethod === 'mobileMoney' ? 'text-white' : 'text-orange-600'
                }`} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{t.payment.mobileMoney}</h3>
                <p className={`text-sm mt-1 ${
                  paymentMethod === 'mobileMoney' ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {language === 'fr' ? 'Orange Money, Airtel Money' : 'Orange Money, Airtel Money'}
                </p>
              </div>
            </div>
            {paymentMethod === 'mobileMoney' && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                </div>
              </div>
            )}
          </button>

          {/* Visa Card Button */}
          <button
            type="button"
            onClick={() => setPaymentMethod('visa')}
            className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 ${
              paymentMethod === 'visa'
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl ring-4 ring-blue-200'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-lg'
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-full transition-colors ${
                paymentMethod === 'visa'
                  ? 'bg-white/20'
                  : 'bg-blue-100 group-hover:bg-blue-200'
              }`}>
                <CreditCard className={`w-8 h-8 ${
                  paymentMethod === 'visa' ? 'text-white' : 'text-blue-600'
                }`} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{t.payment.visa}</h3>
                <p className={`text-sm mt-1 ${
                  paymentMethod === 'visa' ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {language === 'fr' ? 'Visa, Mastercard' : 'Visa, Mastercard'}
                </p>
              </div>
            </div>
            {paymentMethod === 'visa' && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            )}
          </button>

          {/* Cash Payment Button */}
          <button
            type="button"
            onClick={() => setPaymentMethod('cash')}
            className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-200 ${
              paymentMethod === 'cash'
                ? 'bg-gradient-to-br from-green-600 to-green-700 text-white shadow-xl ring-4 ring-green-200'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300 hover:shadow-lg'
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-full transition-colors ${
                paymentMethod === 'cash'
                  ? 'bg-white/20'
                  : 'bg-green-100 group-hover:bg-green-200'
              }`}>
                <Banknote className={`w-8 h-8 ${
                  paymentMethod === 'cash' ? 'text-white' : 'text-green-600'
                }`} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{t.payment.cash}</h3>
                <p className={`text-sm mt-1 ${
                  paymentMethod === 'cash' ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {language === 'fr' ? 'Paiement sur place' : 'Pay on-site'}
                </p>
              </div>
            </div>
            {paymentMethod === 'cash' && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>
            )}
          </button>
        </div>

        {paymentMethod === 'cash' && (
          <p className="mt-4 text-sm text-gray-600 italic">
            {language === 'fr'
              ? "Vous avez choisi de payer en espèces. Merci de régler sur place lors de votre arrivée."
              : "You have chosen to pay cash. Please pay on-site upon arrival."}
          </p>
        )}

        <div className="mt-6 font-semibold text-xl">
          {t.payment.total}: ${total}
        </div>

        {paymentError && (
          <p className="mt-4 text-red-600 font-semibold">{t.payment.error + paymentError}</p>
        )}

        {reservationError && (
          <p className="mt-4 text-red-600 font-semibold">Erreur: {reservationError}</p>
        )}

        {paymentProcessing && <p className="mt-4">{t.payment.processing}</p>}
        {checkingPayment && <p className="mt-2">{t.payment.checking}</p>}

      </div>
    );
  };

  const renderStep4 = () => (
    <div className="text-center space-y-6 p-8 bg-white rounded-xl shadow-md border border-green-200">
      <CheckCircle className="mx-auto w-16 h-16 text-green-500" />
      <h2 className="text-2xl font-bold">{t.success.title}</h2>
      <p>{t.success.message}</p>
      
      {emailSent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-sm">
            ✅ Email de confirmation envoyé avec succès
          </p>
        </div>
      )}
      
      {!emailSent && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700 text-sm">
            ⚠️ Réservation confirmée, mais email non envoyé
          </p>
        </div>
      )}
      
      <p>
        <strong>{t.success.reference}:</strong> {transactionId}
      </p>

      <button
        type="button"
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
            subscriptionType: 'daily',
          });
          setPaymentMethod(null);
          setPaymentError(null);
          setTransactionId(null);
          setReservationError(null);
          setReservationSuccess(false);
          setEmailSent(false);
          setPaymentProcessing(false);
          setCheckingPayment(false);
          setPaymentWindow(null);
        }}
        className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {t.buttons.newReservation}
      </button>
    </div>
  );

  return (
    <main className="max-w-3xl mx-auto p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-center">{t.title}</h1>

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
          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                disabled={paymentProcessing}
              >
                {t.buttons.previous}
              </button>
            )}
            
            {currentStep !== 3 && (
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto disabled:opacity-50"
                disabled={!validateStep(currentStep)}
              >
                {t.buttons.next}
              </button>
            )}
            
            {currentStep === 3 && (
              <button
                type="button"
                onClick={handleReservation}
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto disabled:opacity-50"
                disabled={paymentProcessing || !paymentMethod}
              >
                {paymentProcessing ? 
                  (language === 'fr' ? 'Traitement...' : 'Processing...') : 
                  (paymentMethod === 'cash' ? t.buttons.reserve : t.buttons.pay)
                }
              </button>
            )}
          </div>
        )}
      </form>
    </main>
  );
};

export default ReservationPage;