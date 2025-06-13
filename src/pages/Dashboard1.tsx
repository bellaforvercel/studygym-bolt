import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users,
  Lock,
  AlertTriangle,
  Info,
  Upload,
  FileText,
  X,
  ChevronDown,
  File,
  BookOpen,
  Calendar,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Document {
  id: string;
  title: string;
  type: 'PDF' | 'DOCX' | 'TXT';
  uploadDate: string;
  pages?: number;
  size: string;
}

interface DocumentSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDocumentSelect: (document: Document | null) => void;
  roomId: number;
}

// Document Selection Modal Component
const DocumentSelectionModal: React.FC<DocumentSelectionModalProps> = ({
  isVisible,
  onClose,
  onDocumentSelect,
  roomId
}) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Sample uploaded documents
  const uploadedDocuments: Document[] = [
    {
      id: '1',
      title: 'Introduction to Quantum Physics',
      type: 'PDF',
      uploadDate: '2024-01-15',
      pages: 24,
      size: '2.4 MB'
    },
    {
      id: '2',
      title: 'Machine Learning Fundamentals',
      type: 'PDF',
      uploadDate: '2024-01-10',
      pages: 156,
      size: '8.7 MB'
    },
    {
      id: '3',
      title: 'React Design Patterns',
      type: 'PDF',
      uploadDate: '2024-01-08',
      pages: 89,
      size: '4.2 MB'
    },
    {
      id: '4',
      title: 'Data Structures and Algorithms',
      type: 'DOCX',
      uploadDate: '2024-01-05',
      size: '1.8 MB'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Simulate upload process
      setTimeout(() => {
        const newDocument: Document = {
          id: Date.now().toString(),
          title: file.name.replace(/\.[^/.]+$/, ''),
          type: file.name.split('.').pop()?.toUpperCase() as 'PDF' | 'DOCX' | 'TXT',
          uploadDate: new Date().toISOString().split('T')[0],
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        };
        
        setSelectedDocument(newDocument);
        setIsUploading(false);
        setIsDropdownOpen(false);
      }, 2000);
    }
  };

  const handleContinue = () => {
    onDocumentSelect(selectedDocument);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'DOCX':
        return <File className="w-4 h-4 text-blue-500" />;
      case 'TXT':
        return <File className="w-4 h-4 text-gray-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Select Document</h3>
              <p className="text-sm text-gray-600">Choose what you'd like to study</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Document Selection */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose from your documents
            </label>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {selectedDocument ? (
                  <>
                    {getFileIcon(selectedDocument.type)}
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{selectedDocument.title}</p>
                      <p className="text-xs text-gray-500">
                        {selectedDocument.type} • {selectedDocument.size}
                        {selectedDocument.pages && ` • ${selectedDocument.pages} pages`}
                      </p>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-500">Select a document...</span>
                )}
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                >
                  {uploadedDocuments.length > 0 ? (
                    <div className="p-2">
                      {uploadedDocuments.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => {
                            setSelectedDocument(doc);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          {getFileIcon(doc.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>{doc.type}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                              {doc.pages && (
                                <>
                                  <span>•</span>
                                  <span>{doc.pages} pages</span>
                                </>
                              )}
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm">No documents uploaded yet</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Upload Section */}
          <div className="relative">
            <div className="flex items-center mb-2">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-xs text-gray-500 bg-white">or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
            
            <label className="block">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              <div className="w-full flex items-center justify-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                {isUploading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-blue-600">Uploading...</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Upload a new document</p>
                    <p className="text-xs text-gray-500">PDF, DOCX, or TXT files</p>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Selected Document Preview */}
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-3">
              {getFileIcon(selectedDocument.type)}
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">{selectedDocument.title}</p>
                <div className="flex items-center space-x-2 text-xs text-blue-700">
                  <span>{selectedDocument.type}</span>
                  <span>•</span>
                  <span>{selectedDocument.size}</span>
                  {selectedDocument.pages && (
                    <>
                      <span>•</span>
                      <span>{selectedDocument.pages} pages</span>
                    </>
                  )}
                </div>
              </div>
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedDocument || isUploading}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Continue to Study
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Dashboard1() {
  const navigate = useNavigate();
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

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
    setSelectedRoomId(roomId);
    setShowDocumentModal(true);
  };

  const handleDocumentSelect = (document: Document | null) => {
    if (document && selectedRoomId) {
      setShowDocumentModal(false);
      navigate('/dashboard-2', { 
        state: { 
          roomId: selectedRoomId,
          document: document
        } 
      });
    }
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

      {/* Document Selection Modal */}
      <DocumentSelectionModal
        isVisible={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        onDocumentSelect={handleDocumentSelect}
        roomId={selectedRoomId || 0}
      />
    </div>
  );
}