const path = require('path');
const express = require('express');
const { PORT } = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

const chatRoutes = require('./routes/chat');
app.use('/api', chatRoutes);

const distPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(distPath));
app.get('*splat', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

module.exports = app;
