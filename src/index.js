const express = require('express');
const { PORT } = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

const chatRoutes = require('./routes/chat');
app.use('/api', chatRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
