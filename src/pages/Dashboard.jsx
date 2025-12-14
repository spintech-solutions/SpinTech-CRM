import React, { useState } from 'react';
import { UserNav } from '@/components/dashboard/UserNav';
import { ClientManager } from '@/components/dashboard/ClientManager';
import { TeamView } from '@/components/dashboard/TeamView';
import { AnalyticsView } from '@/components/dashboard/AnalyticsView';
import { LayoutDashboard, Users, BarChart3, Settings, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Dashboard = () => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const renderContent = () => {
        switch (currentView) {
            case 'dashboard':
                return <ClientManager />;
            case 'team':
                return <TeamView />;
            case 'analytics':
                return <AnalyticsView />;
            default:
                return <ClientManager />;
        }
    };

    const SidebarContent = ({ onClose }) => (
        <div className="h-full flex flex-col">
            <div className="flex h-16 items-center border-b border-gray-200 px-6">
               <span className="text-xl font-bold tracking-tight">SpinTech</span>
            </div>
            <div className="space-y-1 p-4 flex-1">
                 <div 
                    onClick={() => { setCurrentView('dashboard'); onClose?.(); }}
                    className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium cursor-pointer transition-colors",
                        currentView === 'dashboard' ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                 >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                 </div>
                 <div 
                    onClick={() => { setCurrentView('team'); onClose?.(); }}
                    className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium cursor-pointer transition-colors",
                        currentView === 'team' ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                 >
                    <Users className="h-4 w-4" />
                    Team
                 </div>
                 <div 
                    onClick={() => { setCurrentView('analytics'); onClose?.(); }}
                    className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium cursor-pointer transition-colors",
                        currentView === 'analytics' ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                 >
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                 </div>
                 <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    Settings
                 </div>
            </div>
        </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r border-gray-200 bg-white md:block sticky top-0 h-screen z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
           <SidebarContent onClose={() => setIsMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <main className="flex-1 min-h-screen">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6 sticky top-0 z-50">
           <div className="flex items-center gap-4">
               {/* Mobile Menu Button */}
               <button 
                onClick={() => setIsMobileOpen(true)} 
                className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-md"
               >
                 <Menu className="w-6 h-6" />
               </button>
               <h1 className="text-lg font-semibold text-gray-900 capitalize">{currentView}</h1>
           </div>
           
           <div className="flex items-center gap-4">
             <UserNav />
           </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-6">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};
