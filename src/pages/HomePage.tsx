import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CreditCard, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';

interface HomePageProps {
  language: 'fr' | 'en';
}

const HomePage: React.FC<HomePageProps> = ({ language }) => {
  const translations = {
    fr: {
      meta: {
        title: 'Nzoo Immo - Réservez votre espace de travail à Kinshasa',
        description:
          'Découvrez nos espaces de coworking, bureaux privés et salles de réunion modernes et équipés à Kinshasa. Réservation simple et paiement sécurisé.',
        keywords:
          'coworking Kinshasa, bureau privé Kinshasa, salle de réunion, location espace travail, Nzoo Immo',
      },
      hero: {
        title: 'Réservez votre espace de travail idéal',
        subtitle:
          'Découvrez nos espaces de coworking, bureaux privés et salles de réunion modernes et équipés',
        cta: 'Réserver maintenant',
        heroAlt: 'Photo nette d’un espace de coworking moderne Nzoo Immo',
      },
      spaces: {
        title: 'Nos Espaces',
        coworking: {
          title: 'Coworking',
          description: 'Espaces partagés flexibles pour entrepreneurs et freelances',
          price: 'À partir de $15/jour',
          capacity: 'Max 3 personnes',
          imgAlt: 'Photo d’espace coworking Nzoo Immo',
        },
        office: {
          title: 'Bureau Privé',
          description: 'Bureaux privés entièrement équipés pour votre équipe',
          price: 'À partir de $300/mois',
          capacity: 'Équipe complète',
          imgAlt: 'Photo de bureau privé Nzoo Immo',
        },
        meeting: {
          title: 'Salle de Réunion',
          description: 'Salles modernes pour vos réunions professionnelles',
          price: 'À partir de $25/heure',
          capacity: 'Jusqu\'à 12 personnes',
          imgAlt: 'Photo salle de réunion Nzoo Immo',
        },
      },
      features: {
        title: 'Pourquoi choisir Nzoo Immo ?',
        booking: {
          title: 'Réservation Simple',
          description: 'Système de réservation en ligne intuitif avec calendrier interactif',
        },
        payment: {
          title: 'Paiement Sécurisé',
          description: 'Mobile Money et cartes VISA acceptées avec sécurité maximale',
        },
        support: {
          title: 'Support 24/7',
          description: 'Équipe dédiée pour vous accompagner à tout moment',
        },
      },
      videoTitle: 'Découvrez Nzoo Immo en vidéo',
      videoAlt: 'Vidéo promotionnelle Nzoo Immo',
      testimonials: {
        title: 'Témoignages',
        items: [
          { name: 'Marie Dupont', text: 'Excellent service, espaces très confortables et bien équipés.' },
          { name: 'Jean Martin', text: 'Réservation simple et rapide, je recommande vivement!' },
          { name: 'Sophie Bernard', text: 'Le support client est toujours disponible et efficace.' },
        ],
      },
    },
    en: {
      meta: {
        title: 'Nzoo Immo - Book your workspace in Kinshasa',
        description:
          'Discover our modern and equipped coworking spaces, private offices, and meeting rooms in Kinshasa. Simple booking and secure payment.',
        keywords:
          'coworking Kinshasa, private office Kinshasa, meeting room, workspace rental, Nzoo Immo',
      },
      hero: {
        title: 'Book your ideal workspace',
        subtitle: 'Discover our modern and equipped coworking spaces, private offices and meeting rooms',
        cta: 'Book now',
        heroAlt: 'Sharp photo of a modern coworking space Nzoo Immo',
      },
      spaces: {
        title: 'Our Spaces',
        coworking: {
          title: 'Coworking',
          description: 'Flexible shared spaces for entrepreneurs and freelancers',
          price: 'From $15/day',
          capacity: 'Max 3 people',
          imgAlt: 'Photo of Nzoo Immo coworking space',
        },
        office: {
          title: 'Private Office',
          description: 'Fully equipped private offices for your team',
          price: 'From $300/month',
          capacity: 'Full team',
          imgAlt: 'Photo of Nzoo Immo private office',
        },
        meeting: {
          title: 'Meeting Room',
          description: 'Modern rooms for your professional meetings',
          price: 'From $25/hour',
          capacity: 'Up to 12 people',
          imgAlt: 'Photo of Nzoo Immo meeting room',
        },
      },
      features: {
        title: 'Why choose Nzoo Immo?',
        booking: {
          title: 'Simple Booking',
          description: 'Intuitive online booking system with interactive calendar',
        },
        payment: {
          title: 'Secure Payment',
          description: 'Mobile Money and VISA cards accepted with maximum security',
        },
        support: {
          title: '24/7 Support',
          description: 'Dedicated team to assist you at any time',
        },
      },
      videoTitle: 'Discover Nzoo Immo in video',
      videoAlt: 'Nzoo Immo promotional video',
      testimonials: {
        title: 'Testimonials',
        items: [
          { name: 'Mary Smith', text: 'Excellent service, very comfortable and well-equipped spaces.' },
          { name: 'John Martin', text: 'Simple and fast booking, highly recommended!' },
          { name: 'Sophie Bernard', text: 'Customer support is always available and efficient.' },
        ],
      },
    },
  };

  const t = translations[language];
  const [modalImage, setModalImage] = useState<string | null>(null);

  return (
    <HelmetProvider>
      <>
        <Helmet>
          <title>{t.meta.title}</title>
          <meta name="description" content={t.meta.description} />
          <meta name="keywords" content={t.meta.keywords} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* Open Graph (Facebook, LinkedIn) */}
          <meta property="og:title" content={t.meta.title} />
          <meta property="og:description" content={t.meta.description} />
          <meta property="og:type" content="website" />
          {/* Twitter */}
          <meta name="twitter:title" content={t.meta.title} />
          <meta name="twitter:description" content={t.meta.description} />
        </Helmet>

        <main className="min-h-screen">
          {/* Hero Section */}
          <section className="relative text-white py-24 bg-black">
            <img
              src="/coworking.jpg" // Remplace par ta vraie image nette
              alt={t.hero.heroAlt}
              className="absolute inset-0 w-full h-[400px] md:h-[400px] object-cover"
              style={{ filter: 'none' }}
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center"
            >
             

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-xl">
                {t.hero.title}
              </h1>
              <p className="text-lg md:text-2xl mb-8 font-medium max-w-3xl mx-auto text-white drop-shadow-md">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link
                  to="/reservation/coworking"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105"
                >
                  {t.hero.cta}
                </Link>
               
              </div>
            </motion.div>
          </section>

          {/* Modal Image */}
          {modalImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
              onClick={() => setModalImage(null)}
            >
              <img src={modalImage} alt="preview" className="max-h-full max-w-full" />
            </div>
          )}

          {/* Spaces Section */}
          <section className="py-24 bg-white" aria-labelledby="spaces-title">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2
                id="spaces-title"
                className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
              >
                {t.spaces.title}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {/* Coworking */}
                <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                  <img
                    src="/coworking.jpg"
                    alt={t.spaces.coworking.imgAlt}
                    className="w-full h-[500px] object-cover cursor-pointer"
                    loading="lazy"
                    decoding="async"
                    onClick={() => setModalImage('/coworking.jpg')}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t.spaces.coworking.title}</h3>
                    <p className="text-gray-600 mb-4">{t.spaces.coworking.description}</p>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span className="font-medium text-blue-500">{t.spaces.coworking.price}</span>
                      <span>{t.spaces.coworking.capacity}</span>
                    </div>
                    <Link
                      to="/reservation/coworking"
                      className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
                    >
                      {t.hero.cta}
                    </Link>
                  </div>
                </article>

                {/* Office */}
                <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                  <img
                    src="/bureau_prive.jpg"
                    alt={t.spaces.office.imgAlt}
                    className="w-full h-[500px] object-cover cursor-pointer"
                    loading="lazy"
                    decoding="async"
                    onClick={() => setModalImage('/bureau_prive.jpg')}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t.spaces.office.title}</h3>
                    <p className="text-gray-600 mb-4">{t.spaces.office.description}</p>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span className="font-medium text-blue-500">{t.spaces.office.price}</span>
                      <span>{t.spaces.office.capacity}</span>
                    </div>
                    <Link
                      to="/reservation/bureau-prive"
                      className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
                    >
                      {t.hero.cta}
                    </Link>
                  </div>
                </article>

                {/* Meeting Room */}
                <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                  <img
                    src="/salle_reunion.jpg"
                    alt={t.spaces.meeting.imgAlt}
                    className="w-full h-[500px] object-cover cursor-pointer"
                    loading="lazy"
                    decoding="async"
                    onClick={() => setModalImage('/salle_reunion.jpg')}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{t.spaces.meeting.title}</h3>
                    <p className="text-gray-600 mb-4">{t.spaces.meeting.description}</p>
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span className="font-medium text-blue-500">{t.spaces.meeting.price}</span>
                      <span>{t.spaces.meeting.capacity}</span>
                    </div>
                    <Link
                      to="/reservation/salle-reunion"
                      className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
                    >
                      {t.hero.cta}
                    </Link>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-gray-50" aria-labelledby="features-title">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2
                id="features-title"
                className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
              >
                {t.features.title}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <article className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-blue-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{t.features.booking.title}</h3>
                  <p className="text-gray-600">{t.features.booking.description}</p>
                </article>
                <article className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-green-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{t.features.payment.title}</h3>
                  <p className="text-gray-600">{t.features.payment.description}</p>
                </article>
                <article className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{t.features.support.title}</h3>
                  <p className="text-gray-600">{t.features.support.description}</p>
                </article>
              </div>
            </div>
          </section>

          {/* Video Section */}
          <section
            id="video-section"
            className="py-20 bg-black"
            aria-label={language === 'fr' ? 'Vidéo promotionnelle' : 'Promotional video'}
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
                {t.videoTitle}
              </h2>
              <div className="aspect-video rounded-lg shadow-lg overflow-hidden">
                <video
                  controls
                  className="w-full h-full object-cover"
                  poster="/video_poster.jpg" // Optionnel : image poster avant lecture
                  preload="metadata"
                >
                  <source src="/video_pub.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 bg-white" aria-labelledby="testimonials-title">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2
                id="testimonials-title"
                className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16"
              >
                {t.testimonials.title}
              </h2>
              <div className="space-y-12">
                {t.testimonials.items.map(({ name, text }, idx) => (
                  <blockquote
                    key={idx}
                    className="bg-gray-100 p-8 rounded-lg shadow-md text-gray-700 text-center italic"
                  >
                    <p>"{text}"</p>
                    <footer className="mt-4 font-semibold text-gray-900">— {name}</footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>
        </main>
      </>
    </HelmetProvider>
  );
};

export default HomePage;
