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
