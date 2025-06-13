import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users,
  Lock,
  AlertTriangle,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard1() {
  const navigate = useNavigate();

  const focusRooms = [
    {
      id: 1,
      name: 'Focus Room 1',
      participants: 619,
      isLocked: false,
      description: 'General study room for focused work'
    },
    {
      id: 2,
      name: 'Focus Room 2',
      participants: 58,
      isLocked: false,
      description: 'Collaborative learning space'
    },
    {
      id: 3,
      name: '"Do Anything" Room',
      participants: 2,
      isLocked: true,
      description: 'Flexible study environment'
    }
  ];

  const handleJoinRoom = (roomId: number) => {
    navigate('/dashboard-2', { state: { roomId } });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-slate-700/50"
        >
          <h1 className="text-3xl font-bold text-white mb-6">
            Welcome to StudyStream!
          </h1>
          
          <div className="space-y-4 text-slate-300">
            <p className="text-lg leading-relaxed">
              Our <span className="inline-flex items-center mx-1">
                <Users className="w-5 h-5 text-orange-400" />
              </span> 
              <strong className="text-white">Focus Rooms</strong> are especially designed to elevate your study experience, getting 
              accountability and motivation from others
            </p>
            
            <p className="text-lg leading-relaxed">
              Whether you're a <span className="text-yellow-400">🎓</span> student, a <span className="text-yellow-400">💡</span> professional, or a <span className="text-red-400">❤️</span> lifelong learner, our rooms connect you 
              with others who share your passion for progress.
            </p>
          </div>
        </motion.div>

        {/* Report Issue Button */}
        <div className="flex justify-end mb-8">
          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 rounded-lg transition-colors border border-slate-700/50">
            <AlertTriangle className="w-4 h-4 text-blue-400" />
            <span>Report an issue</span>
          </button>
        </div>

        {/* Focus Rooms Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {focusRooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
            >
              {/* Room Header */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {room.name}
                </h3>
                
                {/* Participants Count */}
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-slate-300 font-medium">
                    {room.participants} online
                  </span>
                  {room.isLocked && (
                    <Info className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                {/* Lock Status */}
                {room.isLocked && (
                  <div className="flex items-center space-x-2 text-slate-400 text-sm">
                    <Lock className="w-4 h-4" />
                    <span>Requires sign up</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button 
                  className="flex-1 px-4 py-2 text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium"
                  disabled={room.isLocked}
                >
                  Join lite
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleJoinRoom(room.id)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Join
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-16 pt-8 border-t border-slate-700/50 text-slate-400 text-sm">
          <div className="flex space-x-6">
            <button className="hover:text-slate-200 transition-colors">Terms</button>
            <button className="hover:text-slate-200 transition-colors">Privacy</button>
          </div>
        </div>
      </div>
    </div>
  );
}