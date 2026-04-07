const path = require('path');
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');
const { PORT, REDIS_URL, SESSION_SECRET } = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

const redisClient = redis.createClient({
  url: REDIS_URL
});

redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'chatbot:',
});

app.use(session({
  store: redisStore,
  resave: false,
  saveUninitialized: false,
  secret: SESSION_SECRET,
  cookie: { secure: false } // Para dev. Em prod seria ideal process.env.NODE_ENV === 'production'
}));

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
