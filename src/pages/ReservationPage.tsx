import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
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
        return formData.fullName !== '' && formData.email !== '' && formData.phone !== '' && formData.activity !== '';
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

  // Fonction pour initialiser la transaction via CinetPay et ouvrir la popup
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

      // Ouvre popup CinetPay avec le payment_token
      const win = window.open(`https://payment.cinetpay.com/?payment_token=${data.data.payment_token}`, '_blank', 'width=600,height=700');
      if (!win) {
        setPaymentError(language === 'fr' ? "Impossible d'ouvrir la fenêtre de paiement. Autorisez les pop-ups." : 'Cannot open payment window. Allow pop-ups.');
        setPaymentProcessing(false);
        return;
      }
      setPaymentWindow(win);

      // Commence à checker le statut du paiement
      setCheckingPayment(true);
      checkPaymentStatus(txId, win);

    } catch (err) {
      setPaymentError(language === 'fr' ? 'Erreur de connexion au service de paiement.' : 'Payment service connection error');
      setPaymentProcessing(false);
    }
  };

  // Vérifie le statut de paiement toutes les 5 secondes
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
          setCurrentStep(4); // paiement OK, confirmation
        } else if (statusData.data.status === 'REFUSED' || statusData.data.status === 'CANCELED') {
          clearInterval(intervalId);
          setPaymentProcessing(false);
          setCheckingPayment(false);
          if (win && !win.closed) win.close();
          setPaymentError(language === 'fr' ? 'Paiement refusé ou annulé.' : 'Payment refused or cancelled.');
        }
      } catch (e) {
        // Erreur réseau : on peut log ou ignorer, continue à checker
      }
    }, 5000);
  };

  // Nouveau handler pour lancer paiement
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.form.activity} *</label>
          <input
            type="text"
            name="activity"
            value={formData.activity}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.form.company}</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.form.phone} *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.form.email} *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.form.address}</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.form.occupants}</label>
          <input
            type="number"
            name="occupants"
            min={1}
            max={spaceInfo.maxOccupants || 10}
            value={formData.occupants}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {(spaceType === 'coworking' || spaceType === 'bureau-prive') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.form.subscriptionType}</label>
            <select
              name="subscriptionType"
              value={formData.subscriptionType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="daily">{t.form.daily}</option>
              <option value="monthly">{t.form.monthly}</option>
              <option value="yearly">{t.form.yearly}</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">{t.payment.title}</h3>

      <div className="mb-6">
        <p className="mb-2 font-semibold">{t.payment.methods}:</p>
        <div className="flex items-center space-x-6">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="mobileMoney"
              checked={paymentMethod === 'mobileMoney'}
              onChange={() => setPaymentMethod('mobileMoney')}
              disabled={paymentProcessing}
              className="form-radio"
            />
            <span className="ml-2">{t.payment.mobileMoney}</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="visa"
              checked={paymentMethod === 'visa'}
              onChange={() => setPaymentMethod('visa')}
              disabled={paymentProcessing}
              className="form-radio"
            />
            <span className="ml-2">{t.payment.visa}</span>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <p>
          <strong>{t.payment.total}:</strong> {calculateTotal()} XAF
        </p>
      </div>

      {paymentError && (
        <p className="mb-4 text-red-600 font-semibold">
          {t.payment.error} {paymentError}
        </p>
      )}

      <button
        onClick={handleReservation}
        disabled={!paymentMethod || paymentProcessing}
        className={`w-full py-3 rounded-md text-white font-semibold ${
          !paymentMethod || paymentProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {paymentProcessing ? t.payment.processing : t.buttons.pay}
      </button>

      {checkingPayment && (
        <p className="mt-4 text-center text-blue-600 font-semibold">{t.payment.checking}</p>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center max-w-md mx-auto">
      <CheckCircle className="mx-auto mb-4 text-green-600" size={64} />
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">{t.success.title}</h3>
      <p className="mb-4">{t.success.message}</p>
      <p>
        <strong>{t.success.reference}:</strong> {transactionId}
      </p>

      <button
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
        onClick={() => {
          setCurrentStep(1);
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
          setSelectedDates(null);
          setPaymentMethod(null);
          setPaymentToken(null);
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
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold text-center mb-8">{t.title}</h1>
      {renderStepIndicator()}

      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}

      <div className="flex justify-between mt-8 max-w-md mx-auto">
        {currentStep > 1 && currentStep < 4 && (
          <button
            onClick={prevStep}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {t.buttons.previous}
          </button>
        )}

        {currentStep < 3 && (
          <button
            onClick={nextStep}
            disabled={!validateStep(currentStep)}
            className={`px-6 py-3 rounded-md text-white font-semibold ${
              validateStep(currentStep) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {t.buttons.next}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReservationPage;
