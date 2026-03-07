# Contrato do Projeto — Chatbot PDF

## Identidade do Projeto
Chatbot que recebe um documento PDF e responde perguntas sobre ele usando a API da OpenAI.

## Stack
- Backend: Node.js + Express
- IA: OpenAI API (gpt-4o-mini)
- PDF: pdf-parse
- Upload: multer
- Testes: Jest + Supertest
- Deploy: Railway

## Arquitetura
src/
  index.js          — servidor HTTP, ponto de entrada
  routes/chat.js    — rotas da API
  services/pdfService.js    — extração de texto do PDF
  services/openaiService.js — comunicação com OpenAI
  middlewares/upload.js     — configuração do multer
  config/env.js             — validação de variáveis de ambiente
tests/
  pdfService.test.js
  openaiService.test.js
uploads/ — PDFs temporários recebidos

## Regras inegociáveis
1. Nenhuma função nova sem testes escritos primeiro
2. Nenhum segredo hardcoded — tudo via variáveis de ambiente
3. Commits pequenos e descritivos — uma coisa por commit
4. Função com mais de 30 linhas precisa ser quebrada
5. Nenhuma dependência nova sem aprovação explícita

## Convenção de commits
feat: nova funcionalidade
fix: correção de bug
test: adição ou correção de testes
chore: configuração, estrutura, dependências
refactor: melhoria sem mudança de comportamento

## O que eu sei fazer
- Backend com Node/Express
- Frontend com React
- Java

## O que estou aprendendo
- Docker
- API da OpenAI
- TDD

## Instrução para o agente
Antes de qualquer implementação: explique o que vai fazer em português,
liste os arquivos que vai criar ou modificar, e só execute após minha confirmação.
Se sugerir uma função, escreva o teste antes do código.
Nunca instale dependências novas sem me perguntar antes.

## Lições aprendidas — erros já cometidos

### Mock de função direta com Jest (Dia 3)

**O erro:**
Ao mockar o módulo `pdf-parse`, o agente usou:
```js
jest.mock('pdf-parse');
```
Isso causou `TypeError: pdfParse.mockResolvedValue is not a function`
porque o Jest auto-mocka módulos de forma diferente dependendo
do que eles exportam.

**Por que aconteceu:**
- `pdf-parse` exporta uma **função direta** — `module.exports = function(...)`
- `jest.mock('modulo')` sem factory cria um auto-mock que não é um `jest.fn()`
- Só funciona automaticamente com classes e objetos, não com funções diretas

**A correção:**
```js
jest.mock('pdf-parse', () => jest.fn());
```
Passar uma factory explícita garante que o módulo vira um `jest.fn()`
com todos os métodos de mock disponíveis (`mockResolvedValue`, `mockRejectedValue`, etc.)

**Regra para o futuro:**
Sempre que mockar um módulo que exporta uma função direta,
usar a factory explícita `() => jest.fn()`.
Reservar `jest.mock('modulo')` sem factory apenas para classes e objetos.

### Versão do pdf-parse (Dia 4)
**O erro:** pdf-parse v2 tem campo exports restritivo que impede importar
caminhos internos como ./lib/pdf-parse.js — causa ERR_PACKAGE_PATH_NOT_EXPORTED.
**A correção:** usar pdf-parse@1.1.1 que não tem essa restrição.
**Regra:** verificar downloads semanais no npmjs.com antes de instalar.
Versões amplamente usadas são mais estáveis que versões recentes com poucos usuários.

### jest.doMock dentro de isolateModules vs jest.mock global (Dia 5)
**O problema:** tentar usar jest.doMock dentro de isolateModules para
sobrepor um jest.mock global do mesmo arquivo não funciona —
o mock global tem precedência sempre.
**O que foi tentado:**
jest.isolateModules(() => {
  jest.doMock('../src/config/env', () => ({ PDF_MAX_CHARS: 10 }));
  // não funciona se jest.mock global já existe no topo do arquivo
});
**A solução:** abandonar o isolamento de módulo e testar com o valor
real do limite (PDF_MAX_CHARS = 100.000 chars), que é o comportamento
que importa de verdade. Testes devem cobrir comportamento real,
não valores artificiais de teste.
**Regra:** jest.mock global no topo do arquivo sempre tem precedência
sobre jest.doMock dentro de isolateModules.

## Dívidas Técnicas Conhecidas

Dívidas identificadas e adiadas conscientemente. Resolver antes de escalar ou ir para produção real.

### DT-01 — `context` global entre usuários
**Arquivo:** `src/routes/chat.js:8`
Estado compartilhado entre todas as requisições — bug de concorrência se houver múltiplos usuários simultâneos. O PDF de um usuário pode vazar para outro.
**Solução:** sessões com `express-session` + Redis para isolar contexto por usuário.
**Quando resolver:** antes de expor a aplicação a mais de um usuário.

### DT-04 — `new OpenAI()` instanciado a cada chamada
**Arquivo:** `src/services/openaiService.js:8`
Cria um novo cliente a cada pergunta em vez de reutilizar uma instância singleton. Desperdício leve sem impacto funcional.
**Solução:** mover `const client = new OpenAI(...)` para o escopo do módulo.

### DT-06 — Sem verificação de `choices[0]` nulo
**Arquivo:** `src/services/openaiService.js:20`
`response.choices[0].message.content` lança `TypeError` se a API retornar `finish_reason: 'content_filter'` com `content: null`.
**Solução:** `response.choices[0]?.message?.content ?? 'Sem resposta disponível'`

### DT-08 — `OPENAI_API_KEY` exportada desnecessariamente
**Arquivo:** `src/config/env.js:15`
A chave é exportada mas nenhum módulo a importa de `env.js` — lida diretamente de `process.env`. Risco de vazamento se algo serializar o objeto de configuração em logs.
**Solução:** remover `OPENAI_API_KEY` do `module.exports`.

### DT-13 — `docker-compose.yml` monta o projeto inteiro como volume
**Arquivo:** `docker-compose.yml:6`
`volumes: - .:/app` é adequado para desenvolvimento (hot reload), mas perigoso em produção pois expõe arquivos do host ao container.
**Solução:** criar `docker-compose.prod.yml` sem o bind mount antes de qualquer deploy real.

### DT-16 — Sem campo `engines` no `package.json`
**Arquivo:** `package.json`
Sem `"engines": {"node": ">=20"}`, não há aviso se a aplicação for executada em versão incompatível do Node.
**Solução:** adicionar o campo `engines` ao `package.json`.

### DT-17 — Express 5 não documentado
**Arquivo:** `package.json:18`
O projeto usa Express 5 (`^5.2.1`), que trata async errors de forma diferente do Express 4. Copiar exemplos do Express 4 pode causar comportamento inesperado.
**Solução:** documentar no README que o projeto usa Express 5 e as principais diferenças relevantes.