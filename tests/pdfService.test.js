jest.mock('../src/config/env', () => ({ PDF_MAX_CHARS: 100000 }));
jest.mock('pdf-parse', () => jest.fn());
jest.mock('fs/promises');

const { extractTextFromPDF } = require('../src/services/pdfService');

const pdfParse = require('pdf-parse');
const fs = require('fs/promises');

describe('extractTextFromPDF', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o texto extraído do PDF', async () => {
    fs.readFile.mockResolvedValue(Buffer.from('conteudo fake'));
    pdfParse.mockResolvedValue({ text: 'Texto extraído do PDF' });

    const result = await extractTextFromPDF('/caminho/arquivo.pdf');

    expect(result).toBe('Texto extraído do PDF');
  });

  it('deve retornar o texto como string', async () => {
    fs.readFile.mockResolvedValue(Buffer.from('conteudo fake'));
    pdfParse.mockResolvedValue({ text: 'Qualquer texto' });

    const result = await extractTextFromPDF('/caminho/arquivo.pdf');

    expect(typeof result).toBe('string');
  });

  it('deve lançar erro se o arquivo não existir', async () => {
    const erro = new Error('ENOENT: no such file or directory');
    erro.code = 'ENOENT';
    fs.readFile.mockRejectedValue(erro);

    await expect(extractTextFromPDF('/nao/existe.pdf')).rejects.toThrow('ENOENT');
  });

  it('deve lançar erro se o arquivo não for um PDF válido', async () => {
    fs.readFile.mockResolvedValue(Buffer.from('isso nao e um pdf'));
    pdfParse.mockRejectedValue(new Error('Invalid PDF structure'));

    await expect(extractTextFromPDF('/caminho/invalido.txt')).rejects.toThrow();
  });
});

describe('truncamento de texto', () => {
  it('retorna texto completo quando está abaixo do limite', async () => {
    fs.readFile.mockResolvedValue(Buffer.from('fake'));
    pdfParse.mockResolvedValue({ text: 'Texto curto' });

    const result = await extractTextFromPDF('/arquivo.pdf');

    expect(result).toBe('Texto curto');
  });

  it('trunca o texto quando excede o limite de 100.000 caracteres', async () => {
    const textoLongo = 'a'.repeat(150000);
    fs.readFile.mockResolvedValue(Buffer.from('fake'));
    pdfParse.mockResolvedValue({ text: textoLongo });

    const result = await extractTextFromPDF('/arquivo.pdf');

    expect(result.length).toBe(100000);
    expect(result).toBe(textoLongo.slice(0, 100000));
  });
});
