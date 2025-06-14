import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Play, Pause, RotateCcw, Search, ZoomIn, ZoomOut, RotateCw, Settings,
  ChevronRight, ChevronLeft, Clock, Users, Trophy, BookOpen,
  X, Moon, Sun, Bell, MessageCircle, Bookmark, Share2,
  CheckCircle2, HelpCircle, Volume2, VolumeX, BookText, Minimize2, Maximize2,
  Sparkles, Brain, Target, Award, Star, FileText, Upload, ArrowLeft, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PdfViewer from '../components/PdfViewer';
import { parseDocx, parseDocxToHtml } from '../utils/docxParser';
import '../styles/pdf-viewer.css';

// Types
interface StudyParticipant {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'idle' | 'away';
  isActive: boolean;
}

interface TopLearner {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  points: number;
  studyTime: string;
  pagesRead: number;
}

interface Document {
  id: string;
  title: string;
  type: 'PDF' | 'DOCX' | 'TXT';
  uploadDate: string;
  pages?: number;
  size: string;
  content?: string;
  file?: File;
  rawContent?: any;
  [key: string]: any; // For any additional dynamic properties
}

interface AIPopupProps {
  isVisible: boolean;
  position: { x: number; y: number };
  selectedText: string;
  response: string;
  isTyping: boolean;
  onClose: () => void;
}

// AI Assistant Popup Component
const AIAssistantPopup: React.FC<AIPopupProps> = ({ 
  isVisible, 
  position, 
  selectedText, 
  response, 
  isTyping, 
  onClose 
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm"
      style={{
        left: Math.min(position.x, window.innerWidth - 400),
        top: Math.max(position.y, 60),
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-900">AI Assistant</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {selectedText && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
          <p className="text-xs text-blue-600 font-medium mb-1">Selected text:</p>
          <p className="text-xs text-blue-800 italic">"{selectedText.substring(0, 100)}..."</p>
        </div>
      )}

      <div className="space-y-3">
        {isTyping ? (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-gray-600">AI is thinking...</span>
          </div>
        ) : (
          <div className="text-sm text-gray-700 leading-relaxed">
            {response}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          <button className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs hover:bg-blue-100 transition-colors">
            Explain more
          </button>
          <button className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs hover:bg-blue-100 transition-colors">
            Give example
          </button>
          <button className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs hover:bg-blue-100 transition-colors">
            Quiz me
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Comprehension Check Modal Component
const ComprehensionCheckModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  onNeedHelp: () => void;
}> = ({ isVisible, onClose, onNeedHelp }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-lg"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Focus Session Complete!</h3>
          <p className="text-gray-600">Great work! Let's check your understanding.</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="font-medium text-gray-900 mb-3">
              What is the main principle behind quantum entanglement?
            </p>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="question1" className="text-blue-600" />
                <span className="text-sm text-gray-700">Particles can communicate faster than light</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="question1" className="text-blue-600" />
                <span className="text-sm text-gray-700">Quantum states remain correlated regardless of distance</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="radio" name="question1" className="text-blue-600" />
                <span className="text-sm text-gray-700">Energy cannot be created or destroyed</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onNeedHelp}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Need help understanding?</span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue studying
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Document Upload Modal Component
const DocumentUploadModal: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  onDocumentUpload: (document: Document) => void;
}> = ({ isVisible, onClose, onDocumentUpload }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const file = fileInput.files?.[0];
    
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('Processing file upload:', file.name);
    setIsUploading(true);
    
    try {
      // Get file extension and type
      const fileName = file.name.toLowerCase();
      const extension = fileName.split('.').pop() || '';
      let type: 'PDF' | 'DOCX' | 'TXT' = 'TXT';
      
      // Determine document type based on extension and mime type
      const isPdf = extension === 'pdf' || file.type === 'application/pdf';
      const isDocx = ['docx'].includes(extension) || 
                    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      const isDoc = ['doc'].includes(extension);
      
      if (isPdf) {
        type = 'PDF';
      } else if (isDocx) {
        type = 'DOCX';
      } else if (isDoc) {
        // Convert .doc to DOCX since we can't process .doc files directly
        alert('Please convert .doc files to .docx format for better compatibility.');
        return;
      } else if (extension !== 'txt' && file.type !== 'text/plain') {
        // Only allow PDF, DOCX, and TXT files
        alert('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
        return;
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('File size is too large. Maximum file size is 10MB.');
        return;
      }
      
      // Create the document object with file reference
      const newDocument: Document = {
        id: Date.now().toString(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        type,
        uploadDate: new Date().toISOString().split('T')[0],
        size: file.size < 1024 * 1024 
          ? `${Math.ceil(file.size / 1024)} KB` 
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        file: file
      };
      
      console.log('Created document object:', {
        ...newDocument,
        file: { name: file.name, size: file.size, type: file.type }
      });
      
      // Call the upload handler with the document
      await onDocumentUpload(newDocument);
      onClose();
    } catch (error) {
      console.error('Error processing file upload:', error);
      alert(`Failed to process the file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      // Reset the file input
      fileInput.value = '';
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
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <label className="block">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
          <div className="w-full flex items-center justify-center px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
            {isUploading ? (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-600">Uploading...</span>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="font-medium text-gray-700 mb-1">Upload a document</p>
                <p className="text-sm text-gray-500">PDF, DOCX, or TXT files</p>
              </div>
            )}
          </div>
        </label>
      </motion.div>
    </motion.div>
  );
};

// Main Dashboard2 Component
const Dashboard2: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get document from navigation state
  const [currentDocument, setCurrentDocument] = useState<Document | null>(
    location.state?.document || null
  );
  
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isZenMode, setIsZenMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3 * 60); // 3 minutes for demo
  const [timerDuration, setTimerDuration] = useState(25);
  
  // Document State
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // AI Assistant State
  const [showAiPopup, setShowAiPopup] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [aiPopupPosition, setAiPopupPosition] = useState({ x: 0, y: 0 });
  
  // Comprehension Check State
  const [showComprehensionCheck, setShowComprehensionCheck] = useState(false);
  
  // Refs
  const sidebarRef = useRef<HTMLDivElement>(null);
  const documentContentRef = useRef<HTMLDivElement>(null);
  
  // Sample data
  const studyRoomParticipants: StudyParticipant[] = [
    { id: '1', name: 'Alex Kim', avatar: '👨‍💻', status: 'online', isActive: true },
    { id: '2', name: 'Jamie Chen', avatar: '👩‍🎓', status: 'online', isActive: true },
    { id: '3', name: 'Taylor Swift', avatar: '👨‍🔬', status: 'idle', isActive: false },
    { id: '4', name: 'Casey Kim', avatar: '👩‍💼', status: 'away', isActive: false },
    { id: '5', name: 'Riley Chen', avatar: '👨‍🏫', status: 'online', isActive: true },
  ];

  const topLearners: TopLearner[] = [
    { id: '1', name: 'Alex Kim', avatar: '👨‍💻', rank: 1, points: 1250, studyTime: '4h 15m', pagesRead: 87 },
    { id: '2', name: 'Jamie Chen', avatar: '👩‍🎓', rank: 2, points: 880, studyTime: '3h 45m', pagesRead: 62 },
    { id: '3', name: 'Taylor Swift', avatar: '👨‍🔬', rank: 3, points: 840, studyTime: '3h 10m', pagesRead: 53 },
  ];
  
  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  // Calculate progress percentage for timer
  const progress = ((timerDuration * 60 - timeLeft) / (timerDuration * 60)) * 100;
  
  // Handle timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setShowComprehensionCheck(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile && !isZenMode) {
        setIsSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isZenMode]);
  
  // Handle text selection for AI popup
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 10) {
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
        setAiResponse('');
        setTimeout(() => {
          setAiResponse('This concept relates to quantum mechanics, where particles can exhibit wave-like properties. The uncertainty principle suggests that we cannot simultaneously know both the exact position and momentum of a particle.');
          setIsAiTyping(false);
        }, 2000);
      }
    };
    
    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, []);
  
  // Handle zoom
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 50));
  
  // Toggle timer
  const toggleTimer = () => setIsTimerRunning(prev => !prev);
  
  // Reset timer
  const resetTimer = () => {
    setTimeLeft(timerDuration * 60);
    setIsTimerRunning(false);
  };
  
  // Toggle Zen Mode
  const toggleZenMode = () => {
    setIsZenMode(prev => !prev);
    if (!isZenMode) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      // Cleanup any blob URLs when the component unmounts
      if (currentDocument?.rawContent && typeof currentDocument.rawContent === 'string') {
        try {
          URL.revokeObjectURL(currentDocument.rawContent);
        } catch (e) {
          console.warn('Failed to revoke object URL:', e);
        }
      }
    };
  }, [currentDocument]);

  // Handle document upload
  const handleDocumentUpload = async (document: Document) => {
    try {
      // Clean up previous blob URL if it exists
      if (currentDocument?.rawContent && typeof currentDocument.rawContent === 'string') {
        try {
          URL.revokeObjectURL(currentDocument.rawContent);
        } catch (e) {
          console.warn('Failed to revoke previous object URL:', e);
        }
      }

      setCurrentDocument({ ...document, rawContent: null });
      
      if (document.file) {
        console.log('Processing document:', {
          name: document.file.name,
          type: document.file.type,
          size: document.file.size,
          documentType: document.type
        });

        if (document.type === 'PDF') {
          try {
            console.log('Processing PDF file:', document.file.name);

            // Create a blob URL for the PDF file - let react-pdf handle validation
            const fileUrl = URL.createObjectURL(document.file);
            console.log('Created blob URL for PDF:', fileUrl);

            // Set the document immediately - react-pdf will handle errors
            setCurrentDocument({
              ...document,
              rawContent: fileUrl,
              content: undefined
            });

            console.log('PDF document set successfully');
          } catch (error) {
            console.error('Error processing PDF:', error);
            throw error; // Re-throw to be caught by the outer try-catch
          }
        } else if (document.type === 'DOCX') {
          console.log('Processing DOCX file');
          try {
            // For DOCX, parse to HTML for better formatting
            const result = await parseDocxToHtml(document.file);
            console.log('DOCX parsed to HTML successfully');
            setCurrentDocument({
              ...document,
              content: result.content,
              rawContent: result
            });
          } catch (error) {
            console.error('Error parsing DOCX:', error);
            // Fallback to plain text parsing
            try {
              console.log('Falling back to plain text parsing');
              const fallbackResult = await parseDocx(document.file);
              setCurrentDocument({
                ...document,
                content: fallbackResult.content,
                rawContent: fallbackResult
              });
            } catch (fallbackError) {
              console.error('Fallback parsing also failed:', fallbackError);
              throw error; // Re-throw original error
            }
          }
        } else if (document.type === 'TXT') {
          console.log('Processing TXT file');
          try {
            // For TXT, read as text
            const content = await document.file.text();
            console.log('TXT content loaded, length:', content.length);
            setCurrentDocument({
              ...document,
              content,
              rawContent: content
            });
          } catch (error) {
            console.error('Error reading TXT file:', error);
            throw error; // Re-throw to be caught by the outer try-catch
          }
        }
      } else {
        setCurrentDocument(document);
      }
    } catch (error) {
      console.error('Error processing document:', error);
      // Fallback to just setting the document without processing
      setCurrentDocument(document);
    }
  };

  // Render document content
  const renderDocumentContent = () => {
    if (!currentDocument) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <FileText className="w-16 h-16 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No document selected</h3>
          <p className="text-center mb-6">Upload a document to start studying</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      );
    }

    // Common document header
    const renderDocumentHeader = () => (
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center sm:text-left">
          {currentDocument.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span className="px-2 py-1 bg-gray-100 rounded-md">
            {currentDocument.type}
          </span>
          <span>•</span>
          <span>{currentDocument.size}</span>
          {currentDocument.pages && (
            <>
              <span>•</span>
              <span>{currentDocument.pages} pages</span>
            </>
          )}
        </div>
      </div>
    );

    // Loading state
    const renderLoadingState = (message = 'Loading document...') => (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Loader2 className="w-12 h-12 text-blue-500 mb-4 animate-spin" />
        <p className="text-gray-600">{message}</p>
      </div>
    );

    // For PDF files
    if (currentDocument.type === 'PDF') {
      return (
        <div className="w-full max-w-5xl mx-auto">
          <div className="bg-white rounded-lg p-4 sm:p-6 min-h-full">
            {renderDocumentHeader()}
            <div className="pdf-container border border-gray-200 rounded-lg overflow-hidden">
              {currentDocument.rawContent ? (
                <PdfViewer
                  file={currentDocument.rawContent}
                  scale={zoomLevel / 100}
                  className="w-full"
                  onLoadSuccess={(numPages) => {
                    console.log('PDF loaded successfully in Dashboard2');
                    setCurrentDocument(prev => ({
                      ...prev,
                      pages: numPages
                    }));
                  }}
                  onLoadError={(error) => {
                    console.error('PDF load error in Dashboard2:', error);
                  }}
                />
              ) : renderLoadingState('Preparing PDF viewer...')}
            </div>
          </div>
        </div>
      );
    }

    // For DOCX files
    if (currentDocument.type === 'DOCX') {
      if (!currentDocument.content) {
        return renderLoadingState('Processing Word document...');
      }

      return (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-4 sm:p-6 min-h-full">
            {renderDocumentHeader()}
            <div className="prose prose-lg max-w-none">
              {/* Check if content is HTML or plain text */}
              {currentDocument.content.includes('<') ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: currentDocument.content
                  }}
                />
              ) : (
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {currentDocument.content}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // For text files
    if (currentDocument.type === 'TXT' && currentDocument.content) {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-4 sm:p-6 min-h-full">
            {renderDocumentHeader()}
            <div className="prose prose-lg max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans bg-gray-50 p-4 rounded-lg">
                {currentDocument.content}
              </pre>
            </div>
          </div>
        </div>
      );
    }

    // Fallback for unsupported formats or missing content
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg p-6 min-h-full">
          {renderDocumentHeader()}
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Loading Document...
            </h3>
            <p className="text-gray-600">
              Please wait while we load your document.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Navigation */}
      {!isZenMode && (
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between relative z-20">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard-1')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Focus Rooms"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900 hidden sm:inline">StudyFlow</span>
            </div>
            <span className="text-gray-600 truncate max-w-[200px] sm:max-w-md">
              {currentDocument?.title || 'No document selected'}
            </span>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search documents..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              onClick={() => setShowUploadModal(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Upload Document"
            >
              <Upload className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={toggleZenMode}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Toggle Zen Mode"
            >
              {isZenMode ? <Maximize2 className="w-5 h-5 text-gray-600" /> : <Minimize2 className="w-5 h-5 text-gray-600" />}
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Document Viewer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Document Toolbar */}
          {!isZenMode && currentDocument && (
            <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>{currentDocument.type}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 50}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ZoomOut className="w-4 h-4 text-gray-600" />
                </button>
                <span className="text-sm text-gray-600 w-12 text-center">{zoomLevel}%</span>
                <button 
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 200}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ZoomIn className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <RotateCw className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}

          {/* Document Content */}
          <div 
            ref={documentContentRef}
            className="flex-1 overflow-auto bg-white"
            style={{ 
              transform: `scale(${zoomLevel/100})`, 
              transformOrigin: 'top center',
              padding: isZenMode ? '2rem' : '1rem'
            }}
          >
            <div className={`${isZenMode ? 'py-8' : 'py-4'}`}>
              {renderDocumentContent()}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Study Dashboard */}
        <AnimatePresence>
          {(isSidebarOpen && !isZenMode) && (
            <motion.div 
              ref={sidebarRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="w-80 bg-white border-l border-gray-200 flex flex-col relative z-10 h-full overflow-hidden"
            >
              {/* Scrollable Content */}
              <div className="flex-1 flex flex-col overflow-y-auto">
                {/* Sidebar Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Study Dashboard</h2>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Focus Timer */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Focus Timer</h3>
                  
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-40 h-40">
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
                          stroke="#2563eb"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 54}`}
                          strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900">
                          {formatTime(timeLeft)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleTimer}
                      className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                    >
                      {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={resetTimer}
                      className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Study Room */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Study Room</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {studyRoomParticipants.map((participant) => (
                      <div key={participant.id} className="relative group">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                          {participant.avatar}
                        </div>
                        {participant.isActive && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {participant.name}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{studyRoomParticipants.length} students</span> studying now
                  </p>
                </div>

                {/* Today's Top Learners */}
                <div className="p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">Today's Top Learners</h3>
                  
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
                          {learner.rank > 1 && (
                            <span className="text-sm font-bold text-gray-600">{learner.rank}</span>
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
                          <p className="text-sm font-bold text-blue-600">
                            {learner.points}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Toggle Button (when collapsed) */}
        {!isSidebarOpen && !isZenMode && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-20"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isVisible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onDocumentUpload={handleDocumentUpload}
      />

      {/* AI Assistant Popup */}
      <AIAssistantPopup
        isVisible={showAiPopup}
        position={aiPopupPosition}
        selectedText={selectedText}
        response={aiResponse}
        isTyping={isAiTyping}
        onClose={() => setShowAiPopup(false)}
      />

      {/* Comprehension Check Modal */}
      <ComprehensionCheckModal
        isVisible={showComprehensionCheck}
        onClose={() => setShowComprehensionCheck(false)}
        onNeedHelp={() => {
          setShowComprehensionCheck(false);
          setShowAiPopup(true);
          setSelectedText('quantum entanglement');
          setAiResponse('');
          setIsAiTyping(true);
          setTimeout(() => {
            setAiResponse('Quantum entanglement is when particles become connected and instantly affect each other, no matter how far apart they are. Think of it like having two magical coins that always land on opposite sides - when one shows heads, the other will always show tails, even if they\'re on different planets!');
            setIsAiTyping(false);
          }, 1500);
        }}
      />
    </div>
  );
};

export default Dashboard2;