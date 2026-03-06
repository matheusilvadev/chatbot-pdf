const OpenAI = require('openai');

async function askOpenAI(context, question) {
  if (!context || !question) {
    throw new Error('Contexto e pergunta são obrigatórios');
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: `Contexto do documento:\n${context}\n\nPergunta: ${question}`,
      },
    ],
  });

  return response.choices[0].message.content;
}

module.exports = { askOpenAI };
