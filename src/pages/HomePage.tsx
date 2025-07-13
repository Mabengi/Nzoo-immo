import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CreditCard, Shield, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Utilitaires stockage local pour dark mode
const getDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('dark') === 'true';
};

const saveDarkMode = (value: boolean) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('dark', value.toString());
};

// Composant toggle dark mode
const DarkModeToggle = ({
  darkMode,
  toggleDark,
}: {
  darkMode: boolean;
  toggleDark: () => void;
}) => (
  <button
    onClick={toggleDark}
    className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
    aria-label="Toggle dark mode"
  >
    {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
  </button>
);

// Hero Section
const HeroSection = () => (
  <section className="relative flex items-center justify-center bg-black min-h-[80vh]">
    <img
      src="/coworking.jpg"
      alt="Espace coworking Nzoo"
      className="absolute inset-0 w-full h-full object-cover opacity-80"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative z-10 text-center text-white px-4 max-w-4xl"
    >
      <h1 className="text-5xl font-bold leading-tight mb-6">
        Réservez votre espace de travail idéal
      </h1>
      <p className="text-xl mb-8 opacity-90">
        Des bureaux modernes, du coworking flexible, et des salles de réunion professionnelles à
        Kinshasa
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/reservation/coworking"
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-lg"
        >
          Réserver maintenant
        </Link>
      </div>
    </motion.div>
  </section>
);

// Données espaces
const spaces = [
  {
    title: 'Coworking',
    description: 'Espaces partagés flexibles pour entrepreneurs et freelances',
    price: 'À partir de $15/jour',
    capacity: 'Max 3 personnes',
    img: '/coworking.jpg',
    link: '/reservation/coworking',
    color: 'blue',
  },
  {
    title: 'Bureau Privé',
    description: 'Bureaux privés entièrement équipés pour votre équipe',
    price: 'À partir de $300/mois',
    capacity: 'Équipe complète',
    img: '/bureau_prive.jpg',
    link: '/reservation/bureau-prive',
    color: 'green',
  },
  {
    title: 'Salle de Réunion',
    description: 'Salles modernes pour vos réunions professionnelles',
    price: 'À partir de $25/heure',
    capacity: 'Jusqu’à 12 personnes',
    img: '/salle_reunion.jpg',
    link: '/reservation/salle-reunion',
    color: 'purple',
  },
];

// Section espaces
const SpacesSection = () => {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
  };
  const buttonMap: Record<string, string> = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
  };

  return (
    <section className="py-24 bg-white dark:bg-gray-800">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-16">
          Nos Espaces
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {spaces.map(({ title, description, price, capacity, img, link, color }) => (
            <motion.article
              key={title}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col"
            >
              <img
                src={img}
                alt={title}
                className="w-full h-64 object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className={`text-xl font-bold mb-2 ${colorMap[color]}`}>{title}</h3>
                <p className="text-gray-600 dark:text-gray-300 flex-grow">{description}</p>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-4 mb-6">
                  <span className="font-semibold">{price}</span>
                  <span>{capacity}</span>
                </div>
                <Link
                  to={link}
                  className={`block ${buttonMap[color]} text-white text-center py-2 rounded-lg transition`}
                >
                  Réserver
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

// Features (Pourquoi choisir Nzoo Immo)
const features = [
  {
    icon: <Calendar className="w-8 h-8 text-blue-600" />,
    title: 'Réservation Simple',
    desc: 'Système de réservation intuitif avec calendrier interactif.',
  },
  {
    icon: <CreditCard className="w-8 h-8 text-green-600" />,
    title: 'Paiement Sécurisé',
    desc: 'Cartes VISA et Mobile Money acceptés.',
  },
  {
    icon: <Shield className="w-8 h-8 text-purple-600" />,
    title: 'Support 24/7',
    desc: 'Une équipe dédiée toujours disponible.',
  },
];

// Section Features
const FeaturesSection = () => (
  <section className="py-20 bg-gray-50 dark:bg-gray-900" aria-labelledby="features-title">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2
        id="features-title"
        className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-16"
      >
        Pourquoi choisir Nzoo Immo ?
      </h2>
      <div className="grid md:grid-cols-3 gap-12">
        {features.map(({ icon, title, desc }) => (
          <article key={title} className="text-center">
            <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{desc}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

// Témoignages
const testimonials = [
  { name: 'Marie Dupont', text: 'Excellent service, espaces très confortables et bien équipés.' },
  { name: 'Jean Martin', text: 'Réservation simple et rapide, je recommande vivement!' },
  { name: 'Sophie Bernard', text: 'Le support client est toujours disponible et efficace.' },
];

// Section Testimonials
const TestimonialsSection = () => (
  <section className="py-20 bg-white dark:bg-gray-800" aria-labelledby="testimonials-title">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2
        id="testimonials-title"
        className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-16"
      >
        Témoignages
      </h2>
      <div className="space-y-12">
        {testimonials.map(({ name, text }) => (
          <motion.blockquote
            key={name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg shadow-md text-gray-700 dark:text-gray-300 text-center italic"
          >
            <p>“{text}”</p>
            <footer className="mt-4 font-semibold text-gray-900 dark:text-gray-100">— {name}</footer>
          </motion.blockquote>
        ))}
      </div>
    </div>
  </section>
);

// Composant principal HomePage
const HomePage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setDarkMode(getDarkMode());
  }, []);

  const toggleDark = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    saveDarkMode(newVal);
  };

  return (
    <HelmetProvider>
      <div className={darkMode ? 'dark' : ''}>
        <Helmet>
          <title>Nzoo Immo - Espace de travail à Kinshasa</title>
        </Helmet>

        <main className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen transition-colors duration-700">
          <DarkModeToggle darkMode={darkMode} toggleDark={toggleDark} />
          <HeroSection />
          <SpacesSection />
          <FeaturesSection />
          <TestimonialsSection />
        </main>
      </div>
    </HelmetProvider>
  );
};

export default HomePage;
