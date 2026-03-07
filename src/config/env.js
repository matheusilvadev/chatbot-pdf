const required = ['OPENAI_API_KEY'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Variável de ambiente obrigatória não definida: ${key}`);
  }
}

const PDF_MAX_CHARS_RAW = parseInt(process.env.PDF_MAX_CHARS, 10);
const PDF_MAX_CHARS = Number.isFinite(PDF_MAX_CHARS_RAW) && PDF_MAX_CHARS_RAW > 0
  ? PDF_MAX_CHARS_RAW
  : 100000;

module.exports = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  PORT: process.env.PORT || 3000,
  PDF_MAX_CHARS,
};
