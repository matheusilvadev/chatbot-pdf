const fs = require('fs/promises');
const express = require('express');
const upload = require('../middlewares/upload');
const { extractTextFromPDF } = require('../services/pdfService');
const { askOpenAI } = require('../services/openaiService');

const router = express.Router();

let context = null;

router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error('Nenhum arquivo enviado');
      err.type = 'validation';
      return next(err);
    }

    const text = await extractTextFromPDF(req.file.path);

    if (!text || text.trim() === '') {
      const err = new Error('PDF não contém texto extraível');
      err.type = 'validation';
      return next(err);
    }

    context = text;
    res.json({ success: true, message: 'PDF processado' });
  } catch (err) {
    next(err);
  } finally {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
  }
});

router.post('/ask', async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      const err = new Error('O campo question é obrigatório');
      err.type = 'validation';
      return next(err);
    }

    if (!context) {
      const err = new Error('Nenhum PDF carregado. Faça upload antes de perguntar');
      err.type = 'validation';
      return next(err);
    }

    const answer = await askOpenAI(context, question);
    res.json({ answer });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
