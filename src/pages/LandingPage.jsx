import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Workflow } from '../components/landing/Workflow';
import { Testimonial } from '../components/landing/Testimonial';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';

export const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-gray-200 selection:text-black overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Workflow />
      <Testimonial />
      <CTA />
      <Footer />
    </div>
  );
};
