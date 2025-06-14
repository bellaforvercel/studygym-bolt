import * as mammoth from 'mammoth';

export interface DocxParseResult {
  content: string;
  messages: string[];
}

export const parseDocx = async (file: File): Promise<DocxParseResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    return {
      content: result.value,
      messages: result.messages.map(msg => msg.message)
    };
  } catch (error) {
    console.error('Error parsing DOCX file:', error);
    throw new Error('Failed to parse DOCX file. Please make sure the file is not corrupted.');
  }
};

export const parseDocxToHtml = async (file: File): Promise<DocxParseResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    
    return {
      content: result.value,
      messages: result.messages.map(msg => msg.message)
    };
  } catch (error) {
    console.error('Error converting DOCX to HTML:', error);
    throw new Error('Failed to convert DOCX to HTML. The file might be corrupted or in an unsupported format.');
  }
};
