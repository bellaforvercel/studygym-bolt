# Test Document for StudyGym

This is a test document to verify that the PDF/DOCX viewing functionality is working correctly.

## Features to Test

1. **PDF Upload and Viewing**
   - Upload a PDF file
   - Verify that the PDF renders correctly
   - Check zoom functionality
   - Ensure proper error handling

2. **DOCX Upload and Viewing**
   - Upload a DOCX file
   - Verify that the content is displayed properly
   - Check HTML formatting if applicable
   - Test fallback to plain text if needed

3. **Error Handling**
   - Test with corrupted files
   - Verify loading states
   - Check error messages

## Expected Behavior

- PDFs should render using react-pdf with proper scaling
- DOCX files should display with HTML formatting when possible
- Loading states should be shown during processing
- Errors should be handled gracefully with user-friendly messages

## Technical Details

- PDF.js worker version: 4.8.69 (matching react-pdf v9.2.1)
- DOCX parsing: mammoth.js with HTML output preferred
- Scale handling: Proper decimal conversion (zoomLevel / 100)
- Blob URL management: Proper cleanup and error handling
