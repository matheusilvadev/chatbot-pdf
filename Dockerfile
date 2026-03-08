# --- Estágio 1: build do frontend ---
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# --- Estágio 2: imagem final de produção ---
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src/ ./src/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 3000

USER node

CMD ["node", "src/index.js"]
