import React from 'react';
import { Smartphone, CreditCard, CheckCircle } from 'lucide-react';
import { CONGO_PAYMENT_METHODS } from '../services/cinetpayService';

interface CongoPaymentMethodsProps {
  selectedMethod: string | null;
  onMethodSelect: (method: string) => void;
  language: 'fr' | 'en';
}

const CongoPaymentMethods: React.FC<CongoPaymentMethodsProps> = ({
  selectedMethod,
  onMethodSelect,
  language
}) => {
  const translations = {
    fr: {
      title: 'Choisissez votre moyen de paiement',
      mobileMoney: 'Mobile Money',
      bankCard: 'Carte Bancaire',
      popular: 'Populaire',
      secure: 'Sécurisé'
    },
    en: {
      title: 'Choose your payment method',
      mobileMoney: 'Mobile Money',
      bankCard: 'Bank Card',
      popular: 'Popular',
      secure: 'Secure'
    }
  };

  const t = translations[language];

  const paymentMethods = [
    {
      id: 'ORANGE_MONEY',
      ...CONGO_PAYMENT_METHODS.ORANGE_MONEY,
      description: language === 'fr' ? 'Paiement via Orange Money' : 'Pay with Orange Money',
      popular: true
    },
    {
      id: 'AIRTEL_MONEY',
      ...CONGO_PAYMENT_METHODS.AIRTEL_MONEY,
      description: language === 'fr' ? 'Paiement via Airtel Money' : 'Pay with Airtel Money',
      popular: true
    },
    {
      id: 'VISA',
      ...CONGO_PAYMENT_METHODS.VISA,
      description: language === 'fr' ? 'Carte Visa internationale' : 'International Visa card',
      popular: false
    },
    {
      id: 'MASTERCARD',
      ...CONGO_PAYMENT_METHODS.MASTERCARD,
      description: language === 'fr' ? 'Carte Mastercard internationale' : 'International Mastercard',
      popular: false
    }
  ];

  const getMethodIcon = (method: any) => {
    if (method.code === 'MOBILE_MONEY') {
      return <Smartphone className="w-8 h-8" />;
    }
    return <CreditCard className="w-8 h-8" />;
  };

  const getMethodColor = (color: string, selected: boolean) => {
    const colors = {
      orange: selected 
        ? 'bg-orange-600 text-white border-orange-600' 
        : 'bg-white text-orange-600 border-orange-200 hover:border-orange-300',
      red: selected 
        ? 'bg-red-600 text-white border-red-600' 
        : 'bg-white text-red-600 border-red-200 hover:border-red-300',
      green: selected 
        ? 'bg-green-600 text-white border-green-600' 
        : 'bg-white text-green-600 border-green-200 hover:border-green-300',
      blue: selected 
        ? 'bg-blue-600 text-white border-blue-600' 
        : 'bg-white text-blue-600 border-blue-200 hover:border-blue-300'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
        {t.title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onMethodSelect(method.id)}
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${getMethodColor(method.color, isSelected)}`}
            >
              {/* Badge populaire */}
              {method.popular && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {t.popular}
                </div>
              )}

              {/* Icône de sélection */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-current" />
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center space-y-4">
                {/* Icône du moyen de paiement */}
                <div className={`p-3 rounded-full transition-colors ${
                  isSelected 
                    ? 'bg-white/20' 
                    : `bg-${method.color}-100`
                }`}>
                  {getMethodIcon(method)}
                </div>

                {/* Nom et description */}
                <div className="text-center">
                  <h4 className="font-bold text-lg mb-1">{method.name}</h4>
                  <p className={`text-sm ${
                    isSelected ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {method.description}
                  </p>
                </div>

                {/* Badge sécurisé */}
                <div className={`text-xs px-3 py-1 rounded-full ${
                  isSelected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  🔒 {t.secure}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Informations sur les frais */}
    </div>
  );
};

export default CongoPaymentMethods;