import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isReadingInterface = location.pathname === '/dashboard-2';
  const isDashboard1 = location.pathname === '/dashboard-1';
  const showSidebar = !isReadingInterface; // Show sidebar on all pages except reading interface

  return (
    <div className={`flex h-screen ${isDashboard1 ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      {showSidebar && (
        <div className="hidden lg:block">
          <Sidebar isOpen={true} onToggle={toggleSidebar} isDark={isDashboard1} />
        </div>
      )}
      
      <div className={`flex-1 flex flex-col overflow-hidden ${isReadingInterface ? 'w-full' : ''}`}>
        {/* Mobile header - only show on non-reading interface */}
        {showSidebar && (
          <header className={`lg:hidden ${isDashboard1 ? 'bg-slate-800/90' : 'bg-white/90'} backdrop-blur-sm shadow-sm border-b ${isDashboard1 ? 'border-slate-700' : 'border-gray-200'} px-4 py-3`}>
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-lg ${isDashboard1 ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              <Menu className={`w-6 h-6 ${isDashboard1 ? 'text-slate-300' : 'text-slate-600'}`} />
            </button>
          </header>
        )}
        
        {/* Mobile sidebar */}
        {showSidebar && sidebarOpen && (
          <div className="lg:hidden">
            <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} isDark={isDashboard1} />
          </div>
        )}

        {/* Main content */}
        <main className={`flex-1 overflow-auto ${isDashboard1 ? 'bg-slate-900' : ''}`}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={isReadingInterface ? 'h-full' : isDashboard1 ? 'h-full' : 'p-6'}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}