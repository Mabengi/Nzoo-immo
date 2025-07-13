import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, DollarSign, Shield } from 'lucide-react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface ReservationPageProps {
  language: 'fr' | 'en';
}

type SpaceType = 'coworking' | 'bureau-prive' | 'salle-reunion';

interface FormData {
  fullName: string;
  activity: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  occupants: number;
  subscriptionType: 'daily' | 'monthly' | 'yearly' | 'hourly';
}

const translations = {
  fr: {
    title: 'Réservation d\'Espace',
    steps: ['Sélection', 'Détails', 'Paiement', 'Confirmation'],
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
      maxOccupants: 'Nombre maximum d\'occupants dépassé',
      emailInvalid: 'Email invalide',
      phoneInvalid: 'Téléphone invalide',
    },
    success: {
      title: 'Réservation Confirmée !',
      message: 'Votre réservation a été confirmée avec succès. Vous recevrez un email de confirmation.',
      reference: 'Référence'
    }
  },
  en: {
    title: 'Space Reservation',
    steps: ['Selection', 'Details', 'Payment', 'Confirmation'],
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
      maxOccupants: 'Maximum occupants exceeded',
      emailInvalid: 'Invalid email',
      phoneInvalid: 'Invalid phone number',
    },
    success: {
      title: 'Reservation Confirmed!',
      message: 'Your reservation has been successfully confirmed. You will receive a confirmation email.',
      reference: 'Reference'
    }
  }
};

const ReservationPage: React.FC<ReservationPageProps> = ({ language }) => {
  const { spaceType } = useParams<{ spaceType: SpaceType }>();
  const t = translations[language] || translations.fr;
  const spaceInfo = t.spaces[spaceType || 'coworking'];

  const [selectedDates, setSelectedDates] = useState<[Date, Date] | null>(null);
  const [formData, setFormData] = useState<FormData>({
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validation helpers
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const validatePhone = (phone: string) =>
    /^[0-9+\-\s]{6,15}$/.test(phone.trim());

  // Validation by step
  const validateStep = (step: number): boolean => {
    setValidationErrors([]);
    const errors: string[] = [];

    if (step === 1) {
      if (!selectedDates) errors.push(t.validation.selectDates);
    }
    if (step === 2) {
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.activity.trim()) {
        errors.push(t.validation.fillRequired);
      }
      if (!validateEmail(formData.email)) {
        errors.push(t.validation.emailInvalid);
      }
      if (!validatePhone(formData.phone)) {
        errors.push(t.validation.phoneInvalid);
      }
      if (formData.occupants > spaceInfo.maxOccupants) {
        errors.push(t.validation.maxOccupants);
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Calcul du total
  const calculateTotal = useMemo(() => {
    if (!selectedDates) return 0;

    const [startDate, endDate] = selectedDates;
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay) + 1;

    if (spaceType === 'salle-reunion') {
      // For meeting room, hourlyPrice * 8 hours * number of days
      return (spaceInfo.hourlyPrice || 0) * 8 * days;
    }

    switch (formData.subscriptionType) {
      case 'daily':
        return (spaceInfo.dailyPrice || 0) * days;
      case 'monthly': {
        const months = Math.ceil(days / 30);
        return (spaceInfo.monthlyPrice || 0) * months;
      }
      case 'yearly': {
        const years = Math.ceil(days / 365);
        return (spaceInfo.yearlyPrice || 0) * years;
      }
      default:
        return 0;
    }
  }, [selectedDates, formData.subscriptionType, spaceInfo, spaceType]);

  // Gestion input changement
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // occupants and subscriptionType are handled specifically
    setFormData(prev => ({
      ...prev,
      [name]: name === 'occupants' ? Number(value) : value,
    }));
  };

  // Navigation étapes
  const nextStep = () => {
    if (validateStep(currentStep)) setCurrentStep(prev => Math.min(prev + 1, 4));
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  // Simulation de la réservation (ex: appel API)
  const handleReservation = () => {
    if (!validateStep(currentStep)) return;
    setShowPayment(true);
    setTimeout(() => {
      setShowPayment(false);
      setCurrentStep(4);
    }, 2500);
  };

  // Reset formulaire
  const resetForm = () => {
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
    setValidationErrors([]);
  };

  // Affichage des erreurs
  const renderValidationErrors = () => {
    if (validationErrors.length === 0) return null;
    return (
      <ul className="mb-4 text-red-600 list-disc list-inside">
        {validationErrors.map((err, i) => (
          <li key={i}>{err}</li>
        ))}
      </ul>
    );
  };

  // Composants pour chaque étape

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8 space-x-6">
      {t.steps.map((stepLabel, i) => {
        const step = i + 1;
        const active = currentStep === step;
        const completed = currentStep > step;
        return (
          <div key={step} className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                completed ? 'bg-blue-600 text-white' : active ? 'bg-blue-400 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {completed ? <CheckCircle className="w-6 h-6" /> : step}
            </div>
            <span className={`hidden sm:block font-medium ${active ? 'text-blue-600' : 'text-gray-600'}`}>
              {stepLabel}
            </span>
            {step < t.steps.length && (
              <div
                className={`w-12 h-1 ${
                  completed ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const Step1 = () => (
    <>
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{spaceInfo.title}</h3>
        <p className="text-gray-700 mb-6">{spaceInfo.description}</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold mb-3">{language === 'fr' ? 'Équipements Inclus' : 'Included Features'}</h4>
            <ul className="space-y-2 list-disc list-inside text-gray-700">
              {spaceInfo.features.map((f, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{language === 'fr' ? 'Tarifs' : 'Prices'}</h4>
            <div className="space-y-1 text-gray-700">
              {spaceInfo.dailyPrice && <div className="flex justify-between"><span>{language === 'fr' ? 'Journalier' : 'Daily'}:</span> <strong>${spaceInfo.dailyPrice}</strong></div>}
              {spaceInfo.monthlyPrice && <div className="flex justify-between"><span>{language === 'fr' ? 'Mensuel' : 'Monthly'}:</span> <strong>${spaceInfo.monthlyPrice}</strong></div>}
              {spaceInfo.yearlyPrice && <div className="flex justify-between"><span>{language === 'fr' ? 'Annuel' : 'Yearly'}:</span> <strong>${spaceInfo.yearlyPrice}</strong></div>}
              {spaceInfo.hourlyPrice && <div className="flex justify-between"><span>{language === 'fr' ? 'Horaire' : 'Hourly'}:</span> <strong>${spaceInfo.hourlyPrice}</strong></div>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        <h4 className="font-semibold mb-4">{language === 'fr' ? 'Sélectionner les Dates' : 'Select Dates'}</h4>
        <div className="flex justify-center">
          <ReactCalendar
            onChange={(value) => {
              if (Array.isArray(value) && value.length === 2) setSelectedDates([value[0], value[1]]);
              else setSelectedDates(null);
            }}
            value={selectedDates}
            selectRange
            minDate={new Date()}
            className="border-none shadow-sm"
          />
        </div>
        {selectedDates && (
          <p className="mt-4 text-center text-blue-600">
            {language === 'fr' ? 'Période sélectionnée' : 'Selected Period'} : {selectedDates[0].toLocaleDateString()} - {selectedDates[1].toLocaleDateString()}
          </p>
        )}
      </div>
    </>
  );

  const Step2 = () => (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">{language === 'fr' ? 'Informations de Réservation' : 'Reservation Details'}</h3>

      {renderValidationErrors()}

      <div className="grid md:grid-cols-2 gap-6">
        {[
          { name: 'fullName', label: t.form.fullName, type: 'text', required: true },
          { name: 'email', label: t.form.email, type: 'email', required: true },
          { name: 'phone', label: t.form.phone, type: 'tel', required: true },
          { name: 'activity', label: t.form.activity, type: 'text', required: true },
          { name: 'company', label: t.form.company, type: 'text', required: false }
        ].map(({ name, label, type, required }) => (
          <div key={name}>
            <label className="block mb-2 font-medium text-gray-700">{label}{required && ' *'}</label>
            <input
              type={type}
              name={name}
              value={formData[name as keyof FormData] as string}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={required}
            />
          </div>
        ))}

        <div>
          <label className="block mb-2 font-medium text-gray-700">{t.form.occupants} *</label>
          <select
            name="occupants"
            value={formData.occupants}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {Array.from({ length: spaceInfo.maxOccupants }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {spaceType !== 'salle-reunion' && (
          <div>
            <label className="block mb-2 font-medium text-gray-700">{t.form.subscriptionType} *</label>
            <select
              name="subscriptionType"
              value={formData.subscriptionType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {spaceInfo.dailyPrice && <option value="daily">{t.form.daily}</option>}
              {spaceInfo.monthlyPrice && <option value="monthly">{t.form.monthly}</option>}
              {spaceInfo.yearlyPrice && <option value="yearly">{t.form.yearly}</option>}
            </select>
          </div>
        )}

        <div className="md:col-span-2">
          <label className="block mb-2 font-medium text-gray-700">{t.form.address}</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200 max-w-md mx-auto text-center">
      <h3 className="text-xl font-semibold mb-6">{t.payment.title}</h3>
      {showPayment ? (
        <div className="flex flex-col items-center space-y-4 text-blue-600 animate-pulse">
          <DollarSign className="w-12 h-12" />
          <p>{t.payment.processing}</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <strong>{t.payment.total} :</strong> ${calculateTotal.toFixed(2)}
          </div>

          <div className="flex justify-center space-x-8 mb-6 text-gray-700">
            <div className="flex flex-col items-center">
              <img src="/icons/mobile-money.svg" alt="Mobile Money" className="w-12 h-12 mb-2" />
              <span>{t.payment.mobileMoney}</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/icons/visa.svg" alt="VISA" className="w-12 h-12 mb-2" />
              <span>{t.payment.visa}</span>
            </div>
          </div>

          <button
            onClick={handleReservation}
            className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-3 rounded-lg shadow"
          >
            {t.buttons.pay}
          </button>
        </>
      )}
    </div>
  );

  const Step4 = () => (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200 max-w-md mx-auto text-center">
      <CheckCircle className="mx-auto mb-4 text-green-600" size={48} />
      <h3 className="text-2xl font-semibold mb-2">{t.success.title}</h3>
      <p className="mb-4">{t.success.message}</p>
      <p>
        <strong>{t.success.reference} :</strong> #{Math.floor(100000 + Math.random() * 900000)}
      </p>

      <button
        onClick={resetForm}
        className="mt-6 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-3 rounded-lg shadow"
      >
        {t.buttons.newReservation}
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <h1 className="text-3xl font-bold text-center mb-10">{t.title}</h1>

      <StepIndicator />

      {currentStep === 1 && <Step1 />}
      {currentStep === 2 && <Step2 />}
      {currentStep === 3 && <Step3 />}
      {currentStep === 4 && <Step4 />}

      <div className="flex justify-between mt-8 max-w-xl mx-auto">
        {currentStep > 1 && currentStep < 4 && (
          <button
            onClick={prevStep}
            className="px-5 py-3 bg-gray-300 rounded-md hover:bg-gray-400 transition"
          >
            {t.buttons.previous}
          </button>
        )}
        {currentStep < 3 && (
          <button
            onClick={nextStep}
            className="ml-auto px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {t.buttons.next}
          </button>
        )}
      </div>
    </main>
  );
};

export default ReservationPage;
