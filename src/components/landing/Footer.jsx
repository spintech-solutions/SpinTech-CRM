import React from 'react';
import { Twitter, Github, Linkedin, CheckCircle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="text-lg font-semibold tracking-tighter text-black flex items-center gap-1 mb-4">
              SpinTech
            </a>
            <p className="text-xs text-gray-500 leading-relaxed">
              Modern client management for forward-thinking teams. Built in San
              Francisco.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Features</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Integrations</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Terms</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-black transition-colors">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Social
            </h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">
            © 2024 SpinTech Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-gray-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
