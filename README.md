# Chatbot PDF

Chatbot que extrai texto de um documento PDF e responde perguntas sobre ele usando a API da OpenAI (gpt-4o-mini). Projeto de portfólio desenvolvido com Node.js, Express 5, React e Redis.

## Funcionalidades

- Upload de PDF pelo navegador
- Extração automática do texto do documento
- Chat interativo com perguntas sobre o conteúdo do PDF
- Isolamento de contexto por sessão (Redis)
- Interface React responsiva

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Node.js + Express 5 |
| IA | OpenAI API (gpt-4o-mini) |
| PDF | pdf-parse 1.1.1 |
| Upload | Multer |
| Sessões | express-session + Redis |
| Frontend | React + Vite |
| Testes | Jest + Supertest |
| CI | GitHub Actions |
| Deploy | Docker / Railway |

## Arquitetura

```
src/
  index.js                    — servidor HTTP, ponto de entrada
  config/env.js               — validação de variáveis de ambiente
  routes/chat.js              — POST /api/upload e POST /api/ask
  services/pdfService.js      — extração de texto do PDF
  services/openaiService.js   — comunicação com a OpenAI
  middlewares/upload.js       — configuração do multer (10 MB, somente PDF)
  middlewares/errorHandler.js — tratamento centralizado de erros
tests/                        — testes unitários e de integração (Jest + Supertest)
frontend/                     — aplicação React (Vite)
```

**Fluxo:**
1. Usuário faz upload do PDF → `/api/upload` → texto extraído e salvo na sessão
2. Usuário envia pergunta → `/api/ask` → contexto + pergunta enviados à OpenAI
3. Resposta retorna ao cliente

## Pré-requisitos

- Node.js >= 20
- Redis rodando localmente **ou** Docker + Docker Compose
- Conta na [OpenAI](https://platform.openai.com/) com uma API key

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
OPENAI_API_KEY=sk-...
REDIS_URL=redis://localhost:6379
SESSION_SECRET=troque-por-um-segredo-forte
```

> Nunca commite o arquivo `.env`.

## Como rodar

### Com Docker Compose (recomendado)

```bash
docker compose up --build
```

A aplicação estará disponível em `http://localhost:3000`.

### Localmente

```bash
# Instalar dependências do backend
npm install

# Instalar dependências do frontend
cd frontend && npm install && npm run build && cd ..

# Iniciar o servidor
npm start
```

Para desenvolvimento com hot reload:

```bash
npm run dev
```

## API

### `POST /api/upload`

Faz upload de um PDF e extrai o texto para a sessão do usuário.

**Body:** `multipart/form-data` com campo `pdf` (arquivo `.pdf`, máx. 10 MB)

**Resposta:**
```json
{ "message": "PDF carregado com sucesso." }
```

---

### `POST /api/ask`

Envia uma pergunta sobre o PDF carregado na sessão atual.

**Body:**
```json
{ "question": "Qual é o tema principal do documento?" }
```

**Resposta:**
```json
{ "answer": "..." }
```

## Testes

```bash
npm test
```

Executa a suíte completa com relatório de cobertura (`coverage/`).

```bash
npm run lint
```

Valida o código com ESLint (flat config v9+).

## CI/CD

O pipeline no GitHub Actions (`.github/workflows/ci.yml`) executa em cada push para `main` e em pull requests:

1. Instala dependências
2. Roda os testes com cobertura
3. Roda o lint

## Notas sobre Express 5

Este projeto usa **Express 5**, que trata erros em rotas `async` de forma automática (sem necessidade de `try/catch` + `next(err)`). A sintaxe de wildcard também mudou: use `*splat` em vez de `*`.

Ao copiar exemplos do Express 4, verifique a compatibilidade antes de aplicar.

## Licença

MIT
