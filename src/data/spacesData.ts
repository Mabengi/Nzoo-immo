export interface SpaceInfo {
  title: string;
  description: string;
  features: string[];
  dailyPrice?: number;
  monthlyPrice?: number;
  yearlyPrice?: number;
  hourlyPrice?: number;
  maxOccupants: number;
  images: string[];
  type: 'coworking' | 'bureau-prive' | 'salle-reunion';
}

export interface SpacesData {
  fr: Record<string, SpaceInfo>;
  en: Record<string, SpaceInfo>;
}

export const spacesData: SpacesData = {
  fr: {
    coworking: {
      title: 'Espace Coworking',
      description: 'Espace de travail partagé moderne et équipé',
      features: ['WiFi Haut Débit', 'Café/Thé Gratuit', 'Imprimante', 'Salle de Réunion'],
      dailyPrice: 15,
      monthlyPrice: 300,
      yearlyPrice: 3000,
      maxOccupants: 3,
      images: ['/coworking.jpg', '/WhatsApp Image 2025-07-11 à 10.17.26_243d1eea.jpg'],
      type: 'coworking'
    },
    'bureau-prive': {
      title: 'Bureau Privé',
      description: 'Bureau privé entièrement équipé pour votre équipe',
      features: ['Bureau Privé', 'WiFi Dédié', 'Parking', 'Sécurité 24/7'],
      monthlyPrice: 500,
      yearlyPrice: 5500,
      maxOccupants: 10,
      images: ['/bureau_prive.jpg', '/WhatsApp Image 2025-07-11 à 10.17.27_3a034c36.jpg'],
      type: 'bureau-prive'
    },
    'salle-reunion': {
      title: 'Salle de Réunion',
      description: 'Salle moderne pour vos réunions professionnelles',
      features: ['Écran de Présentation', 'Système Audio', 'WiFi', 'Climatisation'],
      hourlyPrice: 25,
      maxOccupants: 12,
      images: ['/salle_reunion.jpg', '/WhatsApp Image 2025-07-11 à 10.17.28_c20d6202.jpg'],
      type: 'salle-reunion'
    }
  },
  en: {
    coworking: {
      title: 'Coworking Space',
      description: 'Modern and equipped shared workspace',
      features: ['High-Speed WiFi', 'Free Coffee/Tea', 'Printer', 'Meeting Room'],
      dailyPrice: 15,
      monthlyPrice: 300,
      yearlyPrice: 3000,
      maxOccupants: 3,
      images: ['/coworking.jpg', '/WhatsApp Image 2025-07-11 à 10.17.26_243d1eea.jpg'],
      type: 'coworking'
    },
    'bureau-prive': {
      title: 'Private Office',
      description: 'Fully equipped private office for your team',
      features: ['Private Office', 'Dedicated WiFi', 'Parking', '24/7 Security'],
      monthlyPrice: 500,
      yearlyPrice: 5500,
      maxOccupants: 10,
      images: ['/bureau_prive.jpg', '/WhatsApp Image 2025-07-11 à 10.17.27_3a034c36.jpg'],
      type: 'bureau-prive'
    },
    'salle-reunion': {
      title: 'Meeting Room',
      description: 'Modern room for your professional meetings',
      features: ['Presentation Screen', 'Audio System', 'WiFi', 'Air Conditioning'],
      hourlyPrice: 25,
      maxOccupants: 12,
      images: ['/salle_reunion.jpg', '/WhatsApp Image 2025-07-11 à 10.17.28_c20d6202.jpg'],
      type: 'salle-reunion'
    }
  }
};

// Fonction utilitaire pour obtenir les informations d'un espace
export const getSpaceInfo = (spaceType: string, language: 'fr' | 'en'): SpaceInfo | null => {
  return spacesData[language][spaceType] || null;
};

// Fonction pour obtenir tous les espaces dans une langue
export const getAllSpaces = (language: 'fr' | 'en'): Record<string, SpaceInfo> => {
  return spacesData[language];
};