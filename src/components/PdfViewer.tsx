import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Use the exact version that matches react-pdf's bundled pdfjs-dist (4.8.69)
// Note: Version 4.8.69 uses .mjs files, not .js files
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;

console.log('PDF.js version:', pdfjs.version);
console.log('PDF.js worker URL:', pdfjs.GlobalWorkerOptions.workerSrc);
console.log('Using exact version match: pdfjs-dist@4.8.69 with .mjs extension');

interface PdfViewerProps {
  file: string | File | ArrayBuffer | null;
  scale?: number;
  className?: string;
  onLoadSuccess?: (numPages: number) => void;
  onLoadError?: (error: Error) => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({
  file,
  scale = 1.0,
  className = '',
  onLoadSuccess,
  onLoadError,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log(`PDF loaded successfully with ${numPages} pages`);
    setNumPages(numPages);
    setIsLoading(false);
    setError(null);
    if (onLoadSuccess) onLoadSuccess(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    console.error('PDF file details:', {
      type: typeof file,
      isFile: file instanceof File,
      isString: typeof file === 'string',
      size: file instanceof File ? file.size : 'N/A'
    });

    let errorMessage = error.message;

    // Provide more user-friendly error messages
    if (error.message.includes('API version') && error.message.includes('Worker version')) {
      errorMessage = 'PDF worker version mismatch detected. Trying to reload...';
      // Try to reload the page to clear any cached workers
      console.log('Version mismatch detected, suggesting page reload');
    } else if (error.message.includes('worker')) {
      errorMessage = 'PDF worker failed to load. Please refresh the page and try again.';
    } else if (error.message.includes('Invalid PDF')) {
      errorMessage = 'The selected file is not a valid PDF document.';
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Failed to load the PDF file. Please check your internet connection.';
    }

    setError(`Failed to load PDF: ${errorMessage}`);
    setIsLoading(false);
    if (onLoadError) onLoadError(error);
  };

  // Reset states when file changes
  useEffect(() => {
    if (!file) return;

    console.log('PDF file changed:', {
      type: typeof file,
      size: file instanceof File ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'N/A',
      url: typeof file === 'string' ? file : 'File object'
    });

    setError(null);
    setIsLoading(true);
    setNumPages(null);
  }, [file]);

  if (!file) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
        <p>No PDF file selected</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <p className="font-medium">Error loading PDF</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  const pageWidth = Math.min(containerWidth * 0.9, 1200);

  return (
    <div ref={containerRef} className={`pdf-viewer ${className}`}>
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Loading PDF document...</p>
        </div>
      )}
      
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p>Preparing document...</p>
          </div>
        }
        error={
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            <p className="font-medium">Failed to load PDF</p>
            <p className="text-sm mt-1">An error occurred while loading the PDF file.</p>
          </div>
        }
        options={{
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
          cMapPacked: true,
        }}
      >
        {numPages && Array.from(new Array(numPages), (_, index) => (
          <div key={`page_${index + 1}`} className="mb-4">
            <Page
              pageNumber={index + 1}
              width={pageWidth}
              scale={scale}
              className="border border-gray-200 shadow-sm bg-white"
              loading={
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              }
              onLoadError={(error) => {
                console.error(`Error loading page ${index + 1}:`, error);
              }}
            />
          </div>
        ))}
      </Document>
    </div>
  );
};

export default PdfViewer;
