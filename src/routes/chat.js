const express = require('express');
const upload = require('../middlewares/upload');
const { extractTextFromPDF } = require('../services/pdfService');
const { askOpenAI } = require('../services/openaiService');

const router = express.Router();

let context = null;

router.post('/upload', upload.single('file'), async (req, res) => {
  const text = await extractTextFromPDF(req.file.path);
  context = text;
  res.json({ success: true, message: 'PDF processado' });
});

router.post('/ask', async (req, res) => {
  const { question } = req.body;
  const answer = await askOpenAI(context, question);
  res.json({ answer });
});

module.exports = router;
