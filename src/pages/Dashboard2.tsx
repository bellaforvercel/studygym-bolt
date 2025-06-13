import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, Pause, RotateCcw, Search, ZoomIn, ZoomOut, RotateCw, Settings,
  ChevronRight, ChevronLeft, ChevronDown, Clock, Users, Trophy, BookOpen,
  Menu, X, Moon, Sun, Bell, MessageCircle, Bookmark, Share2, MoreHorizontal,
  CheckCircle2, HelpCircle, Volume2, VolumeX, BookText, Maximize2, Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type StudyParticipant = {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'idle' | 'away';
  isActive: boolean;
};

type TopLearner = {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  points: number;
  studyTime: string;
  pagesRead: number;
};

type DocumentType = 'PDF' | 'DOCX' | 'TXT' | 'MD';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15 }
  }
};

// Sample data
const STUDY_ROOM_PARTICIPANTS: StudyParticipant[] = [
  { id: '1', name: 'Alex Johnson', avatar: '👨\u200d💻', status: 'online', isActive: true },
  { id: '2', name: 'Taylor Smith', avatar: '👩\u200d🎓', status: 'online', isActive: true },
  { id: '3', name: 'Jordan Lee', avatar: '👨\u200d🔬', status: 'idle', isActive: false },
  { id: '4', name: 'Casey Kim', avatar: '👩\u200d💼', status: 'away', isActive: false },
  { id: '5', name: 'Riley Chen', avatar: '👨\u200d🏫', status: 'online', isActive: true },
];

const TOP_LEARNERS: TopLearner[] = [
  { id: '1', name: 'Alex Johnson', avatar: '👨\u200d💻', rank: 1, points: 1250, studyTime: '4h 22m', pagesRead: 87 },
];

const Dashboard2: React.FC = () => {
  // Navigation
  const navigate = useNavigate();
  
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for AI popup
  const [showAiPopup, setShowAiPopup] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>('');
  const [aiPopupPosition, setAiPopupPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Document State
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  interface DocumentState {
    title: string;
    type: DocumentType;
    pages: number;
    currentPage: number;
  }
  const [currentDocument, setCurrentDocument] = useState<DocumentState>({
    title: 'Introduction to Quantum Physics',
    type: 'PDF' as DocumentType,
    pages: 24,
    currentPage: 1
  });
  
  // Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  
  // Refs
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const documentContentRef = useRef<HTMLDivElement>(null);
  
  // Memoized data to prevent recreation on re-render
  const studyRoomParticipants = useRef(STUDY_ROOM_PARTICIPANTS).current;
  const topLearners = useRef(TOP_LEARNERS).current;
  
  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  // Calculate progress percentage for timer
  const progress = useMemo((): number => {
    return Math.round(((25 * 60 - timeLeft) / (25 * 60)) * 100);
  }, [timeLeft]);
  
  // Handle timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev: number) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);
  
  // Handle zoom functionality
  const handleZoomIn = useCallback((): void => {
    setZoomLevel((prev: number) => Math.min(prev + 10, 200));
  }, []);
  
  const handleZoomOut = useCallback((): void => {
    setZoomLevel((prev: number) => Math.max(prev - 10, 50));
  }, []);
  
  // Toggle document flip
  const toggleDocumentFlip = useCallback((): void => {
    setCurrentDocument(prev => ({
      ...prev,
      currentPage: prev.pages - prev.currentPage + 1
    }));
  }, []);
  
  // Toggle timer
  const toggleTimer = useCallback((): void => {
    setIsTimerRunning(prev => !prev);
  }, []);
  
  // Reset timer
  const resetTimer = useCallback((): void => {
    setTimeLeft(25 * 60);
    setIsTimerRunning(false);
  }, []);
  
  // Go to next page
  const goToNextPage = useCallback((): void => {
    setCurrentDocument(prev => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, prev.pages)
    }));
  }, []);
  
  // Go to previous page
  const goToPrevPage = useCallback((): void => {
    setCurrentDocument(prev => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 1)
    }));
  }, []);
  
  // Handle window resize
  useEffect((): (() => void) => {
    const handleResize = (): void => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return (): void => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle click outside to close sidebar on mobile and handle text selection for AI popup
  useEffect((): (() => void) => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (isMobile && 
          isSidebarOpen && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target as Node) &&
          menuButtonRef.current && 
          !menuButtonRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };
    
    const handleTextSelection = (e: Event): void => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setSelectedText(selection.toString());
        setAiPopupPosition({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY - 60
        });
        setShowAiPopup(true);
        
        // Simulate AI response
        setIsAiTyping(true);
        setTimeout((): void => {
          setAiResponse('This is a simulated AI response about the selected text.');
          setIsAiTyping(false);
        }, 1500);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mouseup', handleTextSelection);
    
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mouseup', handleTextSelection);
    };
  }, [isMobile, isSidebarOpen]);

  // Timer effect
  useEffect((): (() => void) => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval((): void => {
        setTimeLeft((time: number): number => {
          if (time <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return (): void => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Format time as MM:SS (already defined above)

  return (
    <div className="h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile menu button */}
      <button 
        className={`fixed top-4 right-4 z-40 lg:hidden p-2 bg-white rounded-lg shadow-md ${isSidebarOpen ? 'hidden' : 'block'}`}
        onClick={() => setIsSidebarOpen(true)}
        ref={menuButtonRef}
      >
        <Menu className="w-5 h-5" />
      </button>
      
      {/* Main Content - Document Viewer */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900 hidden sm:inline">StudyFlow</span>
            </div>
            <span className="text-sm sm:text-base text-gray-600 truncate max-w-[150px] sm:max-w-md">
              Introduction to Quantum Physics
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32 md:w-48"
              />
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <button 
                className="p-1 hover:bg-gray-100 rounded"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
                aria-label="Zoom out"
              >
                <ZoomOut className={`w-4 h-4 ${zoomLevel <= 50 ? 'opacity-30' : ''}`} />
              </button>
              <span className="text-sm font-medium w-10 text-center">{zoomLevel}%</span>
              <button 
                className="p-1 hover:bg-gray-100 rounded"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
                aria-label="Zoom in"
              >
                <ZoomIn className={`w-4 h-4 ${zoomLevel >= 200 ? 'opacity-30' : ''}`} />
              </button>
              <button 
                className="p-1 hover:bg-gray-100 rounded hidden sm:block"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
            <button 
              className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block"
              onClick={() => navigate('/settings')}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <div 
              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => navigate('/profile')}
            >
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div 
          className="flex-1 overflow-auto bg-gray-50"
          style={{ transform: `scale(${zoomLevel/100})`, transformOrigin: 'top center', width: '100%', minHeight: '100%' }}
        >
          <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 transition-all duration-200">
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 min-h-full">
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
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <motion.div 
            ref={sidebarRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className={`fixed lg:relative inset-y-0 right-0 w-72 sm:w-80 bg-white border-l border-gray-200 flex flex-col z-30 shadow-lg lg:shadow-none`}
          >
            {/* Sidebar Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Study Dashboard</h2>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-gray-100 rounded-full"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Focus Timer */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Focus Timer</h3>
              
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-40 h-40">
                  {/* Timer Circle */}
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
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
                      stroke={isTimerRunning ? "#3b82f6" : "#9ca3af"}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 54}`}
                      strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${isTimerRunning ? 'text-gray-900' : 'text-gray-500'}`}>
                      {formatTime(timeLeft)}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      {isTimerRunning ? 'Focusing' : 'Paused'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`flex items-center justify-center w-14 h-14 ${
                      isTimerRunning 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white rounded-full transition-colors shadow-md`}
                    aria-label={isTimerRunning ? 'Pause timer' : 'Start timer'}
                  >
                    {isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setTimeLeft(25 * 60);
                      setIsTimerRunning(false);
                    }}
                    className="flex items-center justify-center w-11 h-11 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                    aria-label="Reset timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </motion.button>
                </div>
                
                <div className="flex items-center space-x-2">
                  {[15, 25, 50].map((minutes) => (
                    <motion.button
                      key={minutes}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setTimeLeft(minutes * 60);
                        setIsTimerRunning(false);
                      }}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        timeLeft === minutes * 60
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {minutes} min
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Study Room */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Study Room</h3>
                <button className="text-xs text-blue-600 hover:text-blue-800">View All</button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {studyRoomParticipants.map((participant) => (
                  <div key={participant.id} className="relative group">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                      {participant.avatar}
                    </div>
                    {participant.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {participant.name}
                      <div className="absolute bottom-0 left-1/2 w-2 h-2 -mb-1 -ml-1 transform rotate-45 bg-gray-900"></div>
                    </div>
                  </div>
                ))}
                <button className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors">
                  <span className="text-xl">+</span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{studyRoomParticipants.length} students</span> studying now
                </p>
                <button className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded">
                  Join Room
                </button>
              </div>
            </div>

            {/* Today's Top Learners */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Today's Top Learners</h3>
                <div className="flex items-center space-x-1 text-xs">
                  <button 
                    onClick={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2">Page {currentPage}</span>
                  <button 
                    onClick={() => setCurrentPage((prev: number) => prev + 1)}
                    className="p-1 rounded hover:bg-gray-100"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {topLearners.map((learner) => (
                  <motion.div 
                    key={learner.id} 
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                      {learner.rank === 1 && (
                        <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Trophy className="w-3 h-3 text-white" />
                        </div>
                      )}
                      {learner.rank === 2 && (
                        <div className="w-5 h-5 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-400">{learner.rank}</span>
                        </div>
                      )}
                      {learner.rank === 3 && (
                        <div className="w-5 h-5 flex items-center justify-center">
                          <span className="text-sm font-bold text-orange-400">{learner.rank}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">
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
                      <p className="text-sm font-bold text-blue-600 whitespace-nowrap">
                        {learner.points} pts
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  View full leaderboard
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}