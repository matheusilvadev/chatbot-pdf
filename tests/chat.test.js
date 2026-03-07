const request = require('supertest');
const express = require('express');

jest.mock('../src/config/env', () => ({ PDF_MAX_CHARS: 100000, PORT: 3000, OPENAI_API_KEY: 'test-key' }));
jest.mock('../src/services/pdfService');
jest.mock('../src/services/openaiService');
jest.mock('../src/middlewares/upload', () => ({
  single: () => (req, _res, next) => {
    if (req.headers['x-has-file'] === 'true') {
      req.file = { path: '/fake/file.pdf' };
    }
    next();
  },
}));

// Cada teste recebe um app com módulo de rotas fresco (context = null)
// e referências às funções mockadas dessa instância isolada
function buildApp() {
  let app, extractTextFromPDF, askOpenAI;

  jest.isolateModules(() => {
    extractTextFromPDF = require('../src/services/pdfService').extractTextFromPDF;
    askOpenAI = require('../src/services/openaiService').askOpenAI;
    const errorHandler = require('../src/middlewares/errorHandler');
    const chatRoutes = require('../src/routes/chat');

    app = express();
    app.use(express.json());
    app.use('/api', chatRoutes);
    app.use(errorHandler);
  });

  return { app, extractTextFromPDF, askOpenAI };
}

describe('POST /api/upload', () => {
  it('retorna 400 quando nenhum arquivo é enviado', async () => {
    const { app } = buildApp();

    const res = await request(app).post('/api/upload');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Nenhum arquivo enviado');
  });

  it('retorna 400 quando PDF não contém texto extraível', async () => {
    const { app, extractTextFromPDF } = buildApp();
    extractTextFromPDF.mockResolvedValue('   ');

    const res = await request(app).post('/api/upload').set('x-has-file', 'true');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('PDF não contém texto extraível');
  });

  it('retorna 200 quando upload é bem-sucedido', async () => {
    const { app, extractTextFromPDF } = buildApp();
    extractTextFromPDF.mockResolvedValue('Conteúdo do PDF');

    const res = await request(app).post('/api/upload').set('x-has-file', 'true');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, message: 'PDF processado' });
  });

  it('retorna 500 quando pdfService lança erro', async () => {
    const { app, extractTextFromPDF } = buildApp();
    extractTextFromPDF.mockRejectedValue(new Error('Falha ao ler PDF'));

    const res = await request(app).post('/api/upload').set('x-has-file', 'true');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Falha ao ler PDF');
  });
});

describe('POST /api/ask', () => {
  it('retorna 400 quando question está ausente', async () => {
    const { app } = buildApp();

    const res = await request(app).post('/api/ask').send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('O campo question é obrigatório');
  });

  it('retorna 400 quando question é string vazia', async () => {
    const { app } = buildApp();

    const res = await request(app).post('/api/ask').send({ question: '   ' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('O campo question é obrigatório');
  });

  it('retorna 400 quando nenhum PDF foi carregado', async () => {
    const { app } = buildApp();

    const res = await request(app).post('/api/ask').send({ question: 'Qual o tema?' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Nenhum PDF carregado. Faça upload antes de perguntar');
  });

  it('retorna 500 quando openaiService lança erro', async () => {
    const { app, extractTextFromPDF, askOpenAI } = buildApp();
    extractTextFromPDF.mockResolvedValue('Conteúdo do PDF');
    askOpenAI.mockRejectedValue(new Error('Erro na API OpenAI'));

    await request(app).post('/api/upload').set('x-has-file', 'true');
    const res = await request(app).post('/api/ask').send({ question: 'Qual o tema?' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Erro na API OpenAI');
  });

  it('retorna 200 com resposta quando tudo está correto', async () => {
    const { app, extractTextFromPDF, askOpenAI } = buildApp();
    extractTextFromPDF.mockResolvedValue('Conteúdo do PDF');
    askOpenAI.mockResolvedValue('O tema é sustentabilidade');

    await request(app).post('/api/upload').set('x-has-file', 'true');
    const res = await request(app).post('/api/ask').send({ question: 'Qual o tema?' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ answer: 'O tema é sustentabilidade' });
  });
});
