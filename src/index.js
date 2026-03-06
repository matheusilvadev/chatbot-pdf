const express = require('express');
const { PORT } = require('./config/env');

const app = express();

app.use(express.json());

const chatRoutes = require('./routes/chat');
app.use('/api', chatRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
