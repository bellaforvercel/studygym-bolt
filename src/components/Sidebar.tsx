import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Settings,
  X,
  LogOut,
  User,
  Flame,
  Trophy,
  Target,
  Calendar,
  Users,
  BarChart3,
  MessageSquare,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isDark?: boolean;
}

export default function Sidebar({ isOpen, onToggle, isDark = false }: SidebarProps) {
  const { user, signOut } = useAuth();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/dashboard-1', icon: Users, label: 'Focus Rooms' },
    { to: '/dashboard-2', icon: BookOpen, label: 'Reading Session' },
    { to: '#', icon: BarChart3, label: 'Analytics' },
    { to: '#', icon: MessageSquare, label: 'Community' },
    { to: '#', icon: Settings, label: 'Settings' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const sidebarBg = isDark ? 'bg-slate-800/95' : 'bg-white/90';
  const borderColor = isDark ? 'border-slate-700' : 'border-gray-200';
  const textPrimary = isDark ? 'text-slate-200' : 'text-slate-800';
  const textSecondary = isDark ? 'text-slate-400' : 'text-slate-600';
  const hoverBg = isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <motion.div 
        initial={false}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed top-0 left-0 h-full ${sidebarBg} backdrop-blur-sm shadow-lg z-50
          lg:relative lg:translate-x-0 lg:shadow-none lg:border-r ${borderColor}
          w-64 flex flex-col
        `}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className={`text-xl font-bold ${textPrimary}`}>StudyStream</h1>
          </div>
          <button
            onClick={onToggle}
            className={`lg:hidden p-1 rounded-lg ${hoverBg} transition-colors`}
          >
            <X className={`w-5 h-5 ${textSecondary}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? `${isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-700'} border-r-2 ${isDark ? 'border-blue-400' : 'border-blue-700'} shadow-sm` 
                  : `${textSecondary} ${hoverBg} hover:scale-102`
                }
              `}
              onClick={() => window.innerWidth < 1024 && onToggle()}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className={`p-4 border-t ${borderColor}`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${textPrimary} truncate`}>
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className={`text-xs ${textSecondary}`}>Online</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors`}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </motion.div>
    </>
  );
}