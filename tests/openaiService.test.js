const { askOpenAI } = require('../src/services/openaiService');

const mockCreate = jest.fn();

jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }));
});

describe('askOpenAI', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar a resposta da API como string', async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'Resposta da OpenAI' } }],
    });

    const result = await askOpenAI('contexto do documento', 'qual é o tema?');

    expect(result).toBe('Resposta da OpenAI');
  });

  it('deve retornar a resposta como string', async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'Qualquer resposta' } }],
    });

    const result = await askOpenAI('contexto do documento', 'qual é o tema?');

    expect(typeof result).toBe('string');
  });

  it('deve lançar erro se o contexto estiver vazio', async () => {
    await expect(askOpenAI('', 'qual é o tema?')).rejects.toThrow();

    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('deve lançar erro se o contexto for undefined', async () => {
    await expect(askOpenAI(undefined, 'qual é o tema?')).rejects.toThrow();

    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('deve lançar erro se a pergunta estiver vazia ou undefined', async () => {
    await expect(askOpenAI('contexto do documento', '')).rejects.toThrow();
    await expect(askOpenAI('contexto do documento', undefined)).rejects.toThrow();

    expect(mockCreate).not.toHaveBeenCalled();
  });
});
