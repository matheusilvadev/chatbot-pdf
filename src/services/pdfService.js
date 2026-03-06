const fs = require('fs/promises');
const pdfParse = require('pdf-parse');

async function extractTextFromPDF(filePath) {
  const buffer = await fs.readFile(filePath);
  const data = await pdfParse(buffer);
  return data.text;
}

module.exports = { extractTextFromPDF };
