const fs = require('fs/promises');
const pdfParse = require('pdf-parse');
const { PDF_MAX_CHARS } = require('../config/env');

async function extractTextFromPDF(filePath) {
  const buffer = await fs.readFile(filePath);
  const data = await pdfParse(buffer);
  return data.text.slice(0, PDF_MAX_CHARS);
}

module.exports = { extractTextFromPDF };
