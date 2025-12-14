import React from 'react';
import { motion } from 'framer-motion';
import { Zap, PieChart, ShieldCheck, Slack, Mail, Github } from 'lucide-react';

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 md:text-center max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl text-gray-900 mb-4 font-serif font-normal"
          >
            Everything you need to scale.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg"
          >
            SpinTech unifies your entire customer stack into a single, elegant
            platform designed for speed and clarity.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="group p-8 rounded-2xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="h-10 w-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <Zap className="text-gray-900 w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-serif italic font-normal">
              Automated Workflows
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Trigger actions based on client behavior. Send emails, update
              statuses, and notify teams without lifting a finger.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group p-8 rounded-2xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="h-10 w-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <PieChart className="text-gray-900 w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
              Deep Analytics
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Visualize sales pipelines and performance metrics in real-time.
              Make data-driven decisions instantly.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group p-8 rounded-2xl bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="h-10 w-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="text-gray-900 w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
              Enterprise Security
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              SOC2 compliant data protection with granular permission controls.
              Your client data is safe with us.
            </p>
          </motion.div>
        </div>

        {/* Bento Grid Style Feature */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative rounded-2xl bg-gray-50 border border-gray-200 p-8 overflow-hidden h-80"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
                Seamless Integration
              </h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Connect with Slack, Gmail, and 100+ tools effortlessly.
              </p>
            </div>
            {/* Decorative Graphic */}
            <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-white border-t border-l border-gray-200 rounded-tl-2xl shadow-sm p-4 translate-y-4 translate-x-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <Slack className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                   <Mail className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <Github className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-gray-100 rounded"></div>
                <div className="h-2 w-2/3 bg-gray-100 rounded"></div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative rounded-2xl bg-black text-white p-8 overflow-hidden h-80"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-2 tracking-tight">
                Command Menu
              </h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Navigate SpinTech entirely with your keyboard. Speed is a
                feature.
              </p>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-12 bg-gray-800 rounded-lg border border-gray-700 flex items-center px-4 justify-between shadow-2xl group-hover:scale-105 transition-transform">
              <span className="text-sm text-gray-300">Search clients...</span>
              <div className="flex gap-1">
                <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-gray-400">
                  ⌘
                </span>
                <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded text-gray-400">
                  K
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
