import React from 'react';
import { motion } from 'framer-motion';

export const CTA = () => {
  return (
    <section className="py-24 border-t border-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gray-50 -z-10"></div>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl text-gray-900 mb-6 font-serif font-normal"
        >
          Ready to spin up your growth?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-500 mb-10"
        >
          Join 10,000+ companies managing their clients better. No credit card
          required.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <button className="bg-black text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-gray-800 transition-all hover:shadow-lg">
            Get Started for Free
          </button>
          <button className="bg-white text-gray-900 border border-gray-200 px-8 py-3 rounded-full font-medium text-sm hover:bg-gray-50 transition-all">
            Talk to Sales
          </button>
        </motion.div>
      </div>
    </section>
  );
};
