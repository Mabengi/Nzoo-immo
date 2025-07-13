import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, CreditCard, Smartphone } from 'lucide-react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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
  const [paymentMethod, setPaymentMethod] = useState<'mobileMoney' | 'visa' | null>(null);

  // Nouveaux états pour paiement avancé
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

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
      spaces: {
        coworking: {
          title: 'Espace Coworking',
          description: 'Espace de travail partagé moderne et équipé',
          features: ['WiFi Haut Débit', 'Café/Thé Gratuit', 'Imprimante', 'Salle de Réunion'],
          dailyPrice: 15,
          monthlyPrice: 300,
          yearlyPrice: 3000,
          maxOccupants: 3,
        },
        'bureau-prive': {
          title: 'Bureau Privé',
          description: 'Bureau privé entièrement équipé pour votre équipe',
          features: ['Bureau Privé', 'WiFi Dédié', 'Parking', 'Sécurité 24/7'],
          monthlyPrice: 500,
          yearlyPrice: 5500,
          maxOccupants: 10,
        },
        'salle-reunion': {
          title: 'Salle de Réunion',
          description: 'Salle moderne pour vos réunions professionnelles',
          features: ['Écran de Présentation', 'Système Audio', 'WiFi', 'Climatisation'],
          hourlyPrice: 25,
          maxOccupants: 12,
        },
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
      spaces: {
        coworking: {
          title: 'Coworking Space',
          description: 'Modern and equipped shared workspace',
          features: ['High-Speed WiFi', 'Free Coffee/Tea', 'Printer', 'Meeting Room'],
          dailyPrice: 15,
          monthlyPrice: 300,
          yearlyPrice: 3000,
          maxOccupants: 3,
        },
        'bureau-prive': {
          title: 'Private Office',
          description: 'Fully equipped private office for your team',
          features: ['Private Office', 'Dedicated WiFi', 'Parking', '24/7 Security'],
          monthlyPrice: 500,
          yearlyPrice: 5500,
          maxOccupants: 10,
        },
        'salle-reunion': {
          title: 'Meeting Room',
          description: 'Modern room for your professional meetings',
          features: ['Presentation Screen', 'Audio System', 'WiFi', 'Air Conditioning'],
          hourlyPrice: 25,
          maxOccupants: 12,
        },
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
  const spaceInfo = t.spaces[spaceType as keyof typeof t.spaces] || t.spaces.coworking;

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

  const handleReservation = () => {
    if (!paymentMethod) return;
    initiatePayment();
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
          value={formData.address}
          onChange={handleInputChange}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
        />
      </div>

      <div>
        <label htmlFor="occupants" className="block text-sm font-medium text-gray-700">
          {t.form.occupants} *
        </label>
        <input
          type="number"
          name="occupants"
          id="occupants"
          min={1}
          max={spaceInfo.maxOccupants}
          value={formData.occupants}
          onChange={handleInputChange}
          className="mt-1 block w-24 rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200"
          required
        />
      </div>

      {spaceType !== 'salle-reunion' && (
        <div>
          <label htmlFor="subscriptionType" className="block text-sm font-medium text-gray-700">
            {t.form.subscriptionType}
          </label>
          <select
            name="subscriptionType"
            id="subscriptionType"
            value={formData.subscriptionType}
            onChange={handleInputChange}
            disabled={spaceType === 'bureau-prive'}
            className={`mt-1 block w-48 rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-600 focus:ring focus:ring-blue-200 ${
              spaceType === 'bureau-prive' ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          >
            <option value="daily">{t.form.daily}</option>
            <option value="monthly">{t.form.monthly}</option>
            <option value="yearly">{t.form.yearly}</option>
          </select>
        </div>
      )}
    </div>
  );

  // --- REMPLACEMENT intégral de renderStep3 par la nouvelle version design ---
  const renderStep3 = () => {
    const totalAmount = calculateTotal();

    return (
      <div className="space-y-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-md mx-auto">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">{t.payment.title}</h3>

        <div>
          <p className="text-gray-700 mb-2 font-medium">{t.payment.methods} :</p>
          <div className="flex space-x-6">
            <button
              type="button"
              onClick={() => setPaymentMethod('mobileMoney')}
              className={`flex items-center space-x-2 px-5 py-3 border rounded-lg transition-colors duration-200 focus:outline-none ${
                paymentMethod === 'mobileMoney'
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
              }`}
            >
              <Smartphone className="w-6 h-6" />
              <span>{t.payment.mobileMoney}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('visa')}
              className={`flex items-center space-x-2 px-5 py-3 border rounded-lg transition-colors duration-200 focus:outline-none ${
                paymentMethod === 'visa'
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
              }`}
            >
              <CreditCard className="w-6 h-6" />
              <span>{t.payment.visa}</span>
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200 flex justify-between items-center">
          <span className="text-gray-700 font-semibold">{t.payment.total} :</span>
          <span className="text-xl font-bold text-blue-600">${totalAmount}</span>
        </div>

        {(paymentProcessing || checkingPayment) && (
          <div className="flex items-center space-x-2 text-blue-600 font-medium">
            <svg
              className="animate-spin h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span>{paymentProcessing ? t.payment.processing : t.payment.checking}</span>
          </div>
        )}

        {paymentError && (
          <p className="text-red-600 font-semibold mt-2">{t.payment.error + paymentError}</p>
        )}

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={paymentProcessing}
            className="px-5 py-3 border rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            {t.buttons.previous}
          </button>

          <button
            type="button"
            onClick={handleReservation}
            disabled={!paymentMethod || paymentProcessing}
            className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
          >
            {t.buttons.pay}
          </button>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="text-center space-y-6 max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <CheckCircle className="mx-auto w-16 h-16 text-green-600" />
      <h2 className="text-2xl font-semibold text-gray-900">{t.success.title}</h2>
      <p className="text-gray-700">{t.success.message}</p>
      <p className="font-mono text-gray-600">
        {t.success.reference}: <strong>{transactionId}</strong>
      </p>
      <button
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
          setPaymentProcessing(false);
          setCheckingPayment(false);
          setTransactionId(null);
        }}
      >
        {t.buttons.newReservation}
      </button>
    </div>
  );

  return (
    <main className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen flex flex-col">
      <h1 className="text-4xl font-bold mb-8 text-center">{t.title}</h1>

      {renderStepIndicator()}

      <section className="flex-grow">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </section>

      <footer className="mt-8 flex justify-between">
        {currentStep > 1 && currentStep < 4 && (
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            {t.buttons.previous}
          </button>
        )}

        {currentStep < 3 && (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t.buttons.next}
          </button>
        )}
      </footer>
    </main>
  );
};

export default ReservationPage;
