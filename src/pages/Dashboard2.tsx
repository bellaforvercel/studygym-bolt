import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Play,
  Pause,
  RotateCcw,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Settings,
  ChevronRight,
  Clock,
  Users,
  Trophy,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard2() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3 * 60); // 3 minutes for demo
  const [zoomLevel, setZoomLevel] = useState(100);

  const studyRoomParticipants = [
    { id: 1, name: 'Alex', avatar: '👨‍💼', isOnline: true },
    { id: 2, name: 'Sarah', avatar: '👩‍🎓', isOnline: true },
    { id: 3, name: 'Mike', avatar: '👨‍🔬', isOnline: true },
    { id: 4, name: 'Emma', avatar: '👩‍💻', isOnline: true },
    { id: 5, name: 'David', avatar: '👨‍🎨', isOnline: true }
  ];

  const topLearners = [
    { 
      id: 1, 
      name: 'Alex Kim', 
      avatar: '👨‍💼', 
      points: 1250, 
      studyTime: '4h 15m', 
      pagesRead: 87,
      rank: 1 
    },
    { 
      id: 2, 
      name: 'Jamie Chen', 
      avatar: '👩‍🎓', 
      points: 880, 
      studyTime: '3h 45m', 
      pagesRead: 62,
      rank: 2 
    },
    { 
      id: 3, 
      name: 'Taylor Swift', 
      avatar: '👩‍💻', 
      points: 840, 
      studyTime: '3h 10m', 
      pagesRead: 53,
      rank: 3 
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((3 * 60 - timeLeft) / (3 * 60)) * 100;

  return (
    <div className="h-screen bg-white flex">
      {/* Main Content - Document Viewer */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">StudyFlow</span>
            </div>
            <span className="text-gray-600">Introduction to Quantum Physics</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search documents..." 
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <button className="p-1 hover:bg-gray-100 rounded">
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium">{zoomLevel}%</span>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white rounded-lg shadow-sm p-8 min-h-full">
              <div className="flex items-center space-x-2 mb-4 text-sm text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span>PDF</span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-8">
                Introduction to Quantum Physics
              </h1>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Quantum physics is a fundamental theory in physics that provides a description of the physical properties of 
                  nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics including 
                  quantum chemistry, quantum field theory, quantum technology, and quantum information science.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                  Wave-Particle Duality
                </h2>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Wave–particle duality is the concept in quantum mechanics that every particle or quantum entity may be 
                  described as either a particle or a wave. It expresses the inability of the classical concepts "particle" or "wave" 
                  to fully describe the behavior of quantum-scale objects.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                  Heisenberg's Uncertainty Principle
                </h2>

                <p className="text-gray-700 leading-relaxed mb-6">
                  The uncertainty principle is any of a variety of mathematical inequalities asserting a fundamental limit to the 
                  accuracy with which the values for certain pairs of physical quantities of a particle, such as position and 
                  momentum, can be predicted from initial conditions.
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                  Quantum Entanglement
                </h2>

                <p className="text-gray-700 leading-relaxed mb-6">
                  Quantum entanglement is a physical phenomenon that occurs when a group of particles are generated, 
                  interact, or share spatial proximity in a way such that the quantum state of each particle of the group cannot 
                  be described independently of the state of the others, including when the particles are separated by a large 
                  distance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Study Dashboard */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Study Dashboard</h2>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Focus Timer */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Focus Timer</h3>
          
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              {/* Timer Circle */}
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
            >
              {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={() => {
                setTimeLeft(3 * 60);
                setIsTimerRunning(false);
              }}
              className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Study Room */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Study Room</h3>
          
          <div className="flex items-center space-x-2 mb-4">
            {studyRoomParticipants.map((participant) => (
              <div key={participant.id} className="relative">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                  {participant.avatar}
                </div>
                {participant.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
            ))}
          </div>
          
          <p className="text-sm text-gray-600">
            <span className="font-medium">{studyRoomParticipants.length} students</span> studying now
          </p>
        </div>

        {/* Today's Top Learners */}
        <div className="flex-1 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Today's Top Learners</h3>
          
          <div className="space-y-4">
            {topLearners.map((learner) => (
              <div key={learner.id} className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-6 h-6">
                  {learner.rank === 1 && (
                    <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Trophy className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {learner.rank === 2 && (
                    <span className="text-lg font-bold text-gray-400">{learner.rank}</span>
                  )}
                  {learner.rank === 3 && (
                    <span className="text-lg font-bold text-orange-400">{learner.rank}</span>
                  )}
                </div>
                
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                  {learner.avatar}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {learner.name}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{learner.studyTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{learner.pagesRead} pages</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">
                    {learner.points}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}