import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ArrowRight, Flame, Target, Clock, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const stats = [
    { icon: Clock, label: 'Study Time', value: '2h 45m', color: 'blue' },
    { icon: Flame, label: 'Current Streak', value: '7 days', color: 'orange' },
    { icon: Target, label: 'Weekly Goal', value: '12/20h', color: 'emerald' },
    { icon: Trophy, label: 'Rank', value: '#3', color: 'purple' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Welcome back to StudySync
          </h1>
          <p className="text-xl text-slate-600">
            Join focused study sessions and learn with a global community
          </p>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="text-lg font-semibold text-slate-800">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/dashboard-1"
            className="group block bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-3">
              Study Room Explorer
            </h3>
            <p className="text-slate-600 mb-4">
              Browse and join active study rooms with learners worldwide. Find your perfect study group and dive into focused learning sessions.
            </p>
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <span>12 active rooms</span>
              <span>•</span>
              <span>48 participants online</span>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/dashboard-2"
            className="group block bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-md hover:border-emerald-200 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-3">
              Reading Interface
            </h3>
            <p className="text-slate-600 mb-4">
              Engage with content in a distraction-free environment. Use Pomodoro timers, get AI assistance, and track your progress.
            </p>
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <span>AI-powered help</span>
              <span>•</span>
              <span>Focus tracking</span>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200"
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Study Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-slate-700">Completed "React Design Patterns" session</span>
            <span className="text-sm text-slate-500">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-slate-700">Joined "Machine Learning Fundamentals" room</span>
            <span className="text-sm text-slate-500">Yesterday</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-slate-700">Achieved 7-day study streak</span>
            <span className="text-sm text-slate-500">2 days ago</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}