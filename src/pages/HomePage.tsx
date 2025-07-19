import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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

  // Fonction pour naviguer vers la page des espaces
  const goToSpaces = () => {
    navigate('/spaces');
  };


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
              <button
                onClick={goToSpaces}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow-lg transition-colors"
              >
                {t.hero.ctaPrimary}
              </button>
            </div>
          </motion.div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                {lang === 'fr' ? 'Nos Services' : 'Our Services'}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {lang === 'fr' 
                  ? 'Découvrez nos packs adaptés à tous vos besoins professionnels'
                  : 'Discover our packages adapted to all your professional needs'
                }
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {/* Pack Startup & Freelance */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-8 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                 <div className="bg-blue-600 p-4 rounded-lg mr-6 flex-shrink-0">
                   <img src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop" alt="Startup" className="w-20 h-16 object-cover rounded-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200">
                    {lang === 'fr' ? 'PACK STARTUP & FREE-LANCE' : 'STARTUP & FREELANCE PACK'}
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {lang === 'fr' 
                    ? 'Destiné aux startups, freelances, télétravailleurs et professionnels à la recherche d\'un espace flexible, accessible et stimulant.'
                    : 'For startups, freelancers, remote workers and professionals looking for a flexible, accessible and stimulating space.'
                  }
                </p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">$300/mois</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">ou $15/jour</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Accès à un poste de travail en open space' : 'Access to open space workstation'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Connexion Internet haut débit' : 'High-speed Internet connection'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Accès à l\'espace détente (café/thé en option)' : 'Access to relaxation area (coffee/tea optional)'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? '2h gratuites de salles de réunion/semaine' : '2 free hours of meeting rooms/week'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Réception de courrier professionnel' : 'Professional mail reception'}
                  </li>
                </ul>
              </motion.div>

              {/* Pack Welcome to Kin */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-8 border border-green-200 dark:border-green-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                 <div className="bg-green-600 p-4 rounded-lg mr-6 flex-shrink-0">
                   <img src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop" alt="Welcome" className="w-20 h-16 object-cover rounded-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                    {lang === 'fr' ? 'PACK WELCOME TO KIN' : 'WELCOME TO KIN PACK'}
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {lang === 'fr' 
                    ? 'Destiné aux entrepreneurs étrangers, membres de la diaspora et professionnels internationaux souhaitant s\'implanter à Kinshasa.'
                    : 'For foreign entrepreneurs, diaspora members and international professionals wishing to establish themselves in Kinshasa.'
                  }
                </p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">$1000/mois</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Accès à un poste de travail en open space' : 'Access to open space workstation'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Hébergement studio meublé à proximité' : 'Furnished studio accommodation nearby'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Accompagnement personnalisé à l\'installation' : 'Personalized installation support'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Services de secrétariat partiels' : 'Partial secretarial services'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Support bilingue (français/anglais)' : 'Bilingual support (French/English)'}
                  </li>
                </ul>
              </motion.div>

              {/* Pack Invest Lounge */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-xl p-8 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                 <div className="bg-purple-600 p-4 rounded-lg mr-6 flex-shrink-0">
                   <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop" alt="Investment" className="w-20 h-16 object-cover rounded-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200">
                    {lang === 'fr' ? 'PACK INVEST LOUNGE' : 'INVEST LOUNGE PACK'}
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {lang === 'fr' 
                    ? 'Destiné aux investisseurs et Business Angels souhaitant s\'implanter ou développer une activité à Kinshasa.'
                    : 'For investors and Business Angels wishing to establish or develop an activity in Kinshasa.'
                  }
                </p>
                <div className="mb-4">
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {lang === 'fr' ? 'Sur mesure' : 'Custom pricing'}
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Recherche de partenariats fiables' : 'Reliable partnership search'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Facilitation des échanges locaux' : 'Local exchange facilitation'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Visibilité aux projets' : 'Project visibility'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Identification des meilleurs profils' : 'Best profile identification'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Suivi des projets financés' : 'Funded project tracking'}
                  </li>
                </ul>
              </motion.div>

              {/* Domiciliation Commerciale */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-800 rounded-xl p-8 border border-orange-200 dark:border-orange-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                 <div className="bg-orange-600 p-4 rounded-lg mr-6 flex-shrink-0">
                   <img src="https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=200&h=150&fit=crop" alt="Domiciliation" className="w-20 h-16 object-cover rounded-lg" />
                  </div>
                  <h3 className="text-xl font-bold text-orange-800 dark:text-orange-200">
                    {lang === 'fr' ? 'DOMICILIATION COMMERCIALE' : 'COMMERCIAL DOMICILIATION'}
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {lang === 'fr' 
                    ? 'Services de domiciliation commerciale destinée aux Startups, PME, Freelances et porteurs de projets.'
                    : 'Commercial domiciliation services for Startups, SMEs, Freelancers and project holders.'
                  }
                </p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">$800/an</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">ou $100/mois</span>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {lang === 'fr' ? 'Min 6 mois' : 'Min 6 months'}
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Adresse légale à Kinshasa' : 'Legal address in Kinshasa'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Gestion du courrier administratif' : 'Administrative mail management'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Attestation de domiciliation' : 'Domiciliation certificate'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? 'Création de site vitrine' : 'Showcase website creation'}
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    {lang === 'fr' ? '2 jours/mois en coworking' : '2 days/month coworking access'}
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center mt-16"
            >
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                {lang === 'fr' 
                  ? 'Besoin d\'un pack personnalisé ? Contactez-nous pour une solution sur mesure.'
                  : 'Need a custom pack? Contact us for a tailor-made solution.'
                }
              </p>
              <button
                onClick={() => navigate('/spaces')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
              >
                {lang === 'fr' ? 'Découvrir nos espaces' : 'Discover our spaces'}
              </button>
            </motion.div>
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

        {/* Quick Access to Spaces */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {lang === 'fr' ? 'Découvrez nos espaces' : 'Discover our spaces'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {lang === 'fr' 
                ? 'Explorez notre gamme complète d\'espaces de travail modernes et équipés.'
                : 'Explore our complete range of modern and equipped workspaces.'
              }
            </p>
            <Link
              to="/spaces"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {lang === 'fr' ? 'Voir tous nos espaces' : 'View all our spaces'}
            </Link>
          </div>
        </section>
      </div>
    </HelmetProvider>
  );
};

export default HomePage;
