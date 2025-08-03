export interface SpaceInfo {
  title: string;
  description: string;
  features: string[];
  dailyPrice?: number;
  monthlyPrice?: number;
  yearlyPrice?: number;
  hourlyPrice?: number;
  maxOccupants: number;
}

export interface SpacesData {
  [key: string]: SpaceInfo;
}

const spacesDataFr: SpacesData = {
  coworking: {
    title: 'Espace Coworking',
    description: 'Espace de travail partagé moderne et convivial, idéal pour les freelances, entrepreneurs et équipes créatives.',
    features: [
      'WiFi haut débit',
      'Climatisation',
      'Sécurité 24h/24',
      'Café et thé gratuits',
      'Imprimante/Scanner',
      'Salles de réunion (sur réservation)',
      'Espaces détente',
      'Parking gratuit'
    ],
    dailyPrice: 25,
    monthlyPrice: 500,
    yearlyPrice: 5000,
    maxOccupants: 50
  },
  'bureau-prive': {
    title: 'Bureau Privé',
    description: 'Bureau privé entièrement équipé pour votre équipe, offrant intimité et professionnalisme pour vos activités.',
    features: [
      'Bureau privé fermé',
      'WiFi haut débit dédié',
      'Climatisation individuelle',
      'Mobilier de bureau complet',
      'Ligne téléphonique dédiée',
      'Accès sécurisé 24h/24',
      'Service de ménage',
      'Parking réservé'
    ],
    monthlyPrice: 1200,
    yearlyPrice: 12000,
    maxOccupants: 10
  },
  domiciliation: {
    title: 'Service de Domiciliation',
    description: 'Domiciliez votre entreprise avec une adresse prestigieuse et bénéficiez de services professionnels complets.',
    features: [
      'Adresse commerciale prestigieuse',
      'Réception du courrier',
      'Transfert des appels',
      'Salle de réunion (2h/mois incluses)',
      'Accueil de vos clients',
      'Services administratifs',
      'Certificat de domiciliation',
      'Support juridique'
    ],
    monthlyPrice: 300,
    yearlyPrice: 3000,
    maxOccupants: 1
  }
};

const spacesDataEn: SpacesData = {
  coworking: {
    title: 'Coworking Space',
    description: 'Modern and friendly shared workspace, ideal for freelancers, entrepreneurs and creative teams.',
    features: [
      'High-speed WiFi',
      'Air conditioning',
      '24/7 security',
      'Free coffee and tea',
      'Printer/Scanner',
      'Meeting rooms (by reservation)',
      'Relaxation areas',
      'Free parking'
    ],
    dailyPrice: 25,
    monthlyPrice: 500,
    yearlyPrice: 5000,
    maxOccupants: 50
  },
  'bureau-prive': {
    title: 'Private Office',
    description: 'Fully equipped private office for your team, offering privacy and professionalism for your activities.',
    features: [
      'Private closed office',
      'Dedicated high-speed WiFi',
      'Individual air conditioning',
      'Complete office furniture',
      'Dedicated phone line',
      '24/7 secure access',
      'Cleaning service',
      'Reserved parking'
    ],
    monthlyPrice: 1200,
    yearlyPrice: 12000,
    maxOccupants: 10
  },
  domiciliation: {
    title: 'Business Domiciliation Service',
    description: 'Domicile your business with a prestigious address and benefit from comprehensive professional services.',
    features: [
      'Prestigious business address',
      'Mail reception',
      'Call forwarding',
      'Meeting room (2h/month included)',
      'Client reception',
      'Administrative services',
      'Domiciliation certificate',
      'Legal support'
    ],
    monthlyPrice: 300,
    yearlyPrice: 3000,
    maxOccupants: 1
  }
};

export const getSpaceInfo = (spaceType: string, language: 'fr' | 'en'): SpaceInfo | null => {
  const data = language === 'fr' ? spacesDataFr : spacesDataEn;
  return data[spaceType] || null;
};

export const getAllSpaces = (language: 'fr' | 'en'): SpacesData => {
  return language === 'fr' ? spacesDataFr : spacesDataEn;
};