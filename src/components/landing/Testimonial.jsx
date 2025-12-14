import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export const Testimonial = () => {
  return (
    <section className="py-24 bg-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 text-center"
      >
        <div className="mb-8">
          <Quote className="text-black mx-auto h-8 w-8" />
        </div>
        <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900 leading-snug mb-8">
          "SpinTech replaced three other tools for us. It's incredibly fast,
          looks amazing, and just works. Our sales team actually enjoys using a
          CRM for the first time."
        </h3>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full mb-3 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="text-sm font-semibold text-gray-900">Sarah Jenkins</div>
          <div className="text-xs text-gray-500">VP of Sales, MonoSoft</div>
        </div>
      </motion.div>
    </section>
  );
};
