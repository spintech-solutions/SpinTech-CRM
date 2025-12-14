import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal } from 'lucide-react';

export const Workflow = () => {
  return (
    <section id="workflow" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2"
        >
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-6 font-serif font-normal">
            Designed for focus.
          </h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                  1
                </div>
              </div>
              <div className="">
                <h4 className="text-lg font-medium text-gray-900">Import Data</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop CSVs or sync directly from your email provider.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-white border border-gray-300 text-gray-900 flex items-center justify-center text-xs font-bold">
                  2
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  Configure Pipelines
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Customize stages to match your unique sales or support
                  process.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-6 h-6 rounded-full bg-white border border-gray-300 text-gray-900 flex items-center justify-center text-xs font-bold">
                  3
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  Automate & Close
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Let the system handle follow-ups while you focus on the
                  closing call.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2"
        >
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-semibold text-gray-900">Deal Flow</h4>
              <MoreHorizontal className="text-gray-400 w-5 h-5" />
            </div>
            <div className="space-y-3">
              {/* Kanban Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm flex items-center justify-between hover:border-black/20 transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">Lead</div>
                  <div className="text-sm font-medium text-gray-900">
                    Design Agency Pitch
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-900">$12k</div>
              </motion.div>
              {/* Kanban Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm flex items-center justify-between hover:border-black/20 transition-colors cursor-pointer border-l-4 border-l-black"
              >
                <div>
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    Negotiation
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    Enterprise Contract
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-900">$85k</div>
              </motion.div>
              {/* Add Deal Button */}
              <div className="bg-gray-50 border border-gray-100 border-dashed p-4 rounded-lg flex items-center justify-center text-gray-400 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
                + Add Deal
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
