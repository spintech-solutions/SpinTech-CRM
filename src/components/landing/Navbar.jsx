import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SpintechLogo from '../../assets/SpintechLogo.png';

export const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className="fixed top-0 w-full z-50 glass-panel border-b border-gray-100 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="#" className="group flex items-center gap-2.5 no-underline">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut"
              }}
              className="w-8 h-8 rounded-full bg-black flex items-center justify-center overflow-hidden shadow-md"
            >
               <img src={SpintechLogo} alt="Logo" className="w-full h-full object-cover p-1" />
            </motion.div>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-black transition-colors"
            >
              SpinTech
            </motion.span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
              Features
            </a>
            <a href="#workflow" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
              Workflow
            </a>
            <a href="#customers" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
              Customers
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden md:block text-sm font-medium text-gray-500 hover:text-black transition-colors">
            Log in
          </Link>
          <Link to="/login" className="bg-black hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 border border-transparent hover:shadow-lg hover:shadow-gray-200">
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};
