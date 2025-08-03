// src/components/Testimonials.tsx
import React from 'react';

interface Testimonial {
  name: string;
  text: string;
}

interface TestimonialsProps {
  title: string;
  items: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ title, items }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
          {title}
        </h2>
        <div className="space-y-12">
          {items.map(({ name, text }, idx) => (
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
  );
};

export default Testimonials;
