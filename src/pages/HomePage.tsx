import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, Calendar, CreditCard, Shield } from 'lucide-react';

// Texte FR/EN simple ici
const texts = {
  fr: {
    hero: {
      title: 'Réservez votre espace de travail idéal',
      subtitle:
        'Des bureaux modernes, du coworking flexible, et des salles de réunion professionnelles à Kinshasa',
      ctaPrimary: 'Réserver maintenant',
    },
    spacesTitle: 'Nos Espaces',
    featuresTitle: 'Pourquoi choisir Nzoo Immo ?',
    testimonialsTitle: 'Témoignages',
    spaces: [
      {
        title: 'Coworking',
        description: 'Espaces partagés flexibles pour entrepreneurs et freelances',
        price: 'À partir de $15/jour',
        capacity: 'Max 3 personnes',
        link: '/reservation/coworking',
        color: 'blue',
        img: '/coworking.jpg',
      },
      {
        title: 'Bureau Privé',
        description: 'Bureaux privés entièrement équipés pour votre équipe',
        price: 'À partir de $300/mois',
        capacity: 'Équipe complète',
        link: '/reservation/bureau-prive',
        color: 'green',
        img: '/bureau_prive.jpg',
      },
      {
        title: 'Salle de Réunion',
        description: 'Salles modernes pour vos réunions professionnelles',
        price: 'À partir de $25/heure',
        capacity: 'Jusqu’à 12 personnes',
        link: '/reservation/salle-reunion',
        color: 'purple',
        img: '/salle_reunion.jpg',
      },
    ],
    features: [
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
    ],
    testimonials: [
      {
        name: 'Marie Dupont',
        text: 'Excellent service, espaces très confortables et bien équipés.',
      },
      {
        name: 'Jean Martin',
        text: 'Réservation simple et rapide, je recommande vivement!',
      },
      {
        name: 'Sophie Bernard',
        text: 'Le support client est toujours disponible et efficace.',
      },
    ],
    toggleLangLabel: 'Switch to English',
  },
  en: {
    hero: {
      title: 'Book your ideal workspace',
      subtitle:
        'Modern offices, flexible coworking, and professional meeting rooms in Kinshasa',
      ctaPrimary: 'Book now',
    },
    spacesTitle: 'Our Spaces',
    featuresTitle: 'Why choose Nzoo Immo?',
    testimonialsTitle: 'Testimonials',
    spaces: [
      {
        title: 'Coworking',
        description: 'Flexible shared spaces for entrepreneurs and freelancers',
        price: 'From $15/day',
        capacity: 'Max 3 people',
        link: '/reservation/coworking',
        color: 'blue',
        img: '/coworking.jpg',
      },
      {
        title: 'Private Office',
        description: 'Fully equipped private offices for your team',
        price: 'From $300/month',
        capacity: 'Full team',
        link: '/reservation/bureau-prive',
        color: 'green',
        img: '/bureau_prive.jpg',
      },
      {
        title: 'Meeting Room',
        description: 'Modern rooms for your professional meetings',
        price: 'From $25/hour',
        capacity: 'Up to 12 people',
        link: '/reservation/salle-reunion',
        color: 'purple',
        img: '/salle_reunion.jpg',
      },
    ],
    features: [
      {
        icon: <Calendar className="w-8 h-8 text-blue-600" />,
        title: 'Simple Booking',
        desc: 'Intuitive booking system with interactive calendar.',
      },
      {
        icon: <CreditCard className="w-8 h-8 text-green-600" />,
        title: 'Secure Payment',
        desc: 'VISA cards and Mobile Money accepted.',
      },
      {
        icon: <Shield className="w-8 h-8 text-purple-600" />,
        title: '24/7 Support',
        desc: 'Dedicated team always available.',
      },
    ],
    testimonials: [
      {
        name: 'Marie Dupont',
        text: 'Excellent service, very comfortable and well-equipped spaces.',
      },
      {
        name: 'Jean Martin',
        text: 'Easy and quick booking, highly recommend!',
      },
      {
        name: 'Sophie Bernard',
        text: 'Customer support is always available and efficient.',
      },
    ],
    toggleLangLabel: 'Passer en français',
  },
};

const HomePage: React.FC = () => {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [darkMode, setDarkMode] = useState(false);

  // Persist dark mode in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('dark');
    setDarkMode(stored === 'true');
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('dark', darkMode.toString());
  }, [darkMode]);

  const toggleDark = () => setDarkMode((d) => !d);
  const toggleLang = () => setLang((l) => (l === 'fr' ? 'en' : 'fr'));

  const t = texts[lang];

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-700 font-sans">
        <Helmet>
          <title>Nzoo Immo - {t.hero.title}</title>
        </Helmet>

        {/* Language & Dark mode toggles */}
        <div className="fixed top-4 right-4 z-50 flex space-x-4">
          <button
            onClick={toggleLang}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {t.toggleLangLabel}
          </button>
          <button
            onClick={toggleDark}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="text-yellow-400" />
            ) : (
              <Moon className="text-gray-800" />
            )}
          </button>
        </div>

        {/* Hero Section */}
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
            <h1 className="text-5xl font-bold leading-tight mb-6">{t.hero.title}</h1>
            <p className="text-xl mb-8 opacity-90">{t.hero.subtitle}</p>
            <div className="flex justify-center">
              <Link
                to="/reservation/coworking"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-lg"
              >
                {t.hero.ctaPrimary}
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Spaces Section */}
        <section className="py-24 bg-white dark:bg-gray-800">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-16">
              {t.spacesTitle}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {t.spaces.map(({ title, description, price, capacity, img, link, color }) => {
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
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-16">
              {t.featuresTitle}
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              {t.features.map(({ icon, title, desc }) => (
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

        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-16">
              {t.testimonialsTitle}
            </h2>
            <div className="space-y-12">
              {t.testimonials.map(({ name, text }) => (
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
      </div>
    </HelmetProvider>
  );
};

export default HomePage;
