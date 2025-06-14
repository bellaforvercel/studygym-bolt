declare module 'pdfjs-dist/build/pdf.worker.entry' {
  // This is a workaround for the PDF.js worker entry point
  // The actual implementation is provided by pdfjs-dist
  const content: any;
  export default content;
}
