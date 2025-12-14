import React from 'react';
import { motion } from 'framer-motion';
import SpintechLogo from '../assets/SpintechLogo.png';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ 
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-20 h-20 rounded-full bg-black flex items-center justify-center overflow-hidden shadow-lg"
        >
          <img src={SpintechLogo} alt="SpinTech" className="w-full h-full object-cover p-2" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <h2 className="text-xl font-bold tracking-tight text-gray-900">SpinTech</h2>
          <div className="flex gap-1">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              className="w-2 h-2 bg-black rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              className="w-2 h-2 bg-black rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              className="w-2 h-2 bg-black rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
