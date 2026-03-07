const express = require('express');
const { PORT } = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

const chatRoutes = require('./routes/chat');
app.use('/api', chatRoutes);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

module.exports = app;
