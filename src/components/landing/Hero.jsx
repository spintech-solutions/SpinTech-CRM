import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, PlayCircle, LayoutGrid, Users, BarChart3, DollarSign, Activity } from 'lucide-react';

export const Hero = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for the tilt
  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    // Calculate position relative to center (range -0.5 to 0.5)
    // Invert X for natural feel if needed, but standard tilt is usually:
    // Left mouse -> rotateY negative (if pivot is center).
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Map mouse position to rotation degrees
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]); // vertical mouse moves rotate X axis
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]); // horizontal mouse moves rotate Y axis
  
  // Add a shine effect that moves with the mouse
  const shineX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  return (
    <section className="lg:pt-32 lg:pb-32 overflow-x-hidden pt-24 pb-20 relative">
      <div className="absolute inset-0 z-0 bg-grid-dashed pointer-events-none"></div>
      <div className="z-10 max-w-7xl mr-auto ml-auto pr-6 pl-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col text-center max-w-4xl mr-auto mb-12 ml-auto items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-gray-800 font-mono tracking-wide uppercase">
              v2.0 Now Available
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl text-gray-900 mb-8 leading-[1.05] font-serif italic tracking-tight">
            Manage relationships,
            <br />
            <span className="not-italic font-sans font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
              not just data.
            </span>
          </h1>
          <p className="text-xl md:text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed font-light">
            SpinTech provides a unified interface to streamline client
            interactions, automate workflows, and close deals faster without the
            clutter.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link to="/login" className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-full font-medium text-base hover:bg-gray-800 transition-all hover:shadow-xl hover:shadow-gray-200/50 flex items-center justify-center gap-2 group">
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full font-medium text-base hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
              <PlayCircle className="w-4 h-4" />
              View Demo
            </button>
          </div>
        </motion.div>

        {/* UI Mockup Container with 3D Tilt */}
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
           style={{ perspective: 1000 }}
           className="relative mx-auto max-w-5xl"
        >
          <motion.div
            style={{ 
              rotateX, 
              rotateY,
              transformStyle: "preserve-3d" 
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            {/* Orangish Animated Glow */}
            <motion.div 
               animate={{ 
                 opacity: [0.3, 0.6, 0.3],
                 scale: [0.95, 1.05, 0.95]
               }}
               transition={{ 
                 duration: 4, 
                 repeat: Infinity, 
                 ease: "easeInOut" 
               }}
               className="absolute -inset-4 bg-orange-500/20 rounded-[2rem] blur-3xl -z-10"
            />
            
            {/* Main Card */}
            <div className="relative bg-white border border-gray-200 rounded-xl shadow-2xl shadow-gray-200/50 overflow-hidden">
              {/* Shine effect overlay */}
              <motion.div 
                 style={{
                    background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.8), transparent 40%)`,
                 }}
                 className="absolute inset-0 pointer-events-none z-50 opacity-10 mix-blend-overlay"
              />

              {/* Fake Window Header - Mac Style */}
              <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-4 justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div> {/* Red */}
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div> {/* Yellow */}
                  <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div> {/* Green */}
                </div>
                <div className="h-4 w-48 bg-gray-100/50 rounded-md border border-gray-100 flex items-center justify-center">
                    <span className="text-[10px] text-gray-400 font-medium">spintech-crm.app</span>
                </div>
              </div>

              {/* App Content */}
              <div className="flex h-[400px] md:h-[500px]">
                {/* Sidebar */}
                <div className="w-16 md:w-64 border-r border-gray-100 flex flex-col p-4 bg-gray-50/30 hidden md:flex">
                  <div className="space-y-1">
                    <div className="h-8 w-full bg-white border border-gray-200 shadow-sm rounded-md flex items-center px-3 gap-3 text-black">
                      <LayoutGrid className="w-4 h-4" />
                      <span className="text-xs font-medium">Dashboard</span>
                    </div>
                    <div className="h-8 w-full hover:bg-gray-100/50 rounded-md flex items-center px-3 gap-3 text-gray-500 transition-colors">
                      <Users className="w-4 h-4" />
                      <span className="text-xs font-medium">Clients</span>
                    </div>
                    <div className="h-8 w-full hover:bg-gray-100/50 rounded-md flex items-center px-3 gap-3 text-gray-500 transition-colors">
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-xs font-medium">Analytics</span>
                    </div>
                  </div>
                  <div className="mt-auto space-y-3">
                    <div className="h-px w-full bg-gray-200"></div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300"></div>
                      <div className="space-y-1">
                        <div className="h-2 w-20 bg-gray-200 rounded"></div>
                        <div className="h-2 w-12 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Area */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden">
                  {/* Top Bar */}
                  <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <h3 className="font-semibold text-sm text-gray-900">
                      Client Overview
                    </h3>
                    <div className="flex gap-2">
                      <div className="px-3 py-1.5 border border-gray-200 rounded-md text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                        Export
                      </div>
                      <div className="px-3 py-1.5 bg-black text-white hover:bg-gray-800 rounded-md text-xs font-medium cursor-pointer transition-colors shadow-lg shadow-gray-200">
                        Add New
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Grid */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto no-scrollbar h-full pb-20">
                    {/* Stat Card 1 */}
                    <div className="p-5 rounded-xl border border-gray-100 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                          +12.5%
                        </span>
                      </div>
                      <div className="text-2xl font-bold tracking-tight text-gray-900 font-mono">
                        $24,500
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-medium">Total Revenue</div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="p-5 rounded-xl border border-gray-100 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <Users className="w-4 h-4" />
                        </div>
                        <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                          +4.2%
                        </span>
                      </div>
                      <div className="text-2xl font-bold tracking-tight text-gray-900 font-mono">
                        1,240
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-medium">Active Clients</div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="p-5 rounded-xl border border-gray-100 bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                          <Activity className="w-4 h-4" />
                        </div>
                        <span className="text-xs text-gray-500 font-bold bg-gray-50 px-2 py-0.5 rounded-full">
                          0.0%
                        </span>
                      </div>
                      <div className="text-2xl font-bold tracking-tight text-gray-900 font-mono">
                        98%
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-medium">Retention Rate</div>
                    </div>

                    {/* Table Mockup */}
                    <div className="col-span-1 md:col-span-3 border border-gray-100 rounded-xl overflow-hidden mt-2 bg-white shadow-sm">
                      <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <div className="w-1/3">Client Name</div>
                        <div className="w-1/3">Status</div>
                        <div className="w-1/3 text-right">Value</div>
                      </div>
                      <div className="divide-y divide-gray-50">
                        <div className="px-4 py-3 flex gap-4 items-center text-sm hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="w-1/3 font-semibold text-gray-900 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">AC</div>
                            Acme Corp
                          </div>
                          <div className="w-1/3">
                            <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide border border-green-200">
                              Active
                            </span>
                          </div>
                          <div className="w-1/3 text-right text-gray-600 font-mono">$12,000</div>
                        </div>
                        <div className="px-4 py-3 flex gap-4 items-center text-sm hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="w-1/3 font-semibold text-gray-900 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">GT</div>
                            Global Tech
                          </div>
                          <div className="w-1/3">
                            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wide border border-blue-200">
                              Negotiation
                            </span>
                          </div>
                          <div className="w-1/3 text-right text-gray-600 font-mono">$8,500</div>
                        </div>
                        <div className="px-4 py-3 flex gap-4 items-center text-sm hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="w-1/3 font-semibold text-gray-900 flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">SI</div>
                            Stark Ind
                          </div>
                          <div className="w-1/3">
                            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wide border border-gray-200">
                              Lead
                            </span>
                          </div>
                          <div className="w-1/3 text-right text-gray-600 font-mono">$45,000</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Trusted By - Moved up slightly */}
        <div className="mt-16 text-center">
          <p className="text-xs font-bold text-gray-400 mb-6 tracking-widest uppercase">
            Trusted by innovative teams
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {/* SVG Logos */}
            <svg className="h-6" viewBox="0 0 100 30" fill="currentColor">
              <path d="M10,15 L20,5 L30,15 L20,25 Z M40,5 H50 V25 H40 Z M60,5 H80 V10 H65 V12 H75 V17 H65 V25 H60 Z"></path>
            </svg>
            <svg className="h-6" viewBox="0 0 100 30" fill="currentColor">
              <circle cx="15" cy="15" r="10"></circle>
              <rect x="35" y="5" width="20" height="20"></rect>
              <path d="M70,25 L80,5 L90,25 Z"></path>
            </svg>
            <svg className="h-6" viewBox="0 0 100 30" fill="currentColor">
              <rect x="10" y="10" width="20" height="10"></rect>
              <circle cx="50" cy="15" r="8"></circle>
              <rect x="70" y="5" width="5" height="20"></rect>
              <rect x="80" y="5" width="5" height="20"></rect>
            </svg>
            <svg className="h-6 hidden sm:block" viewBox="0 0 100 30" fill="currentColor">
              <path d="M10,5 Q30,25 50,5 T90,5" stroke="currentColor" strokeWidth="3" fill="none"></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
