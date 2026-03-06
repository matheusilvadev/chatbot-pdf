const express = require('express');
const { PORT } = require('./config/env');

const app = express();

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
