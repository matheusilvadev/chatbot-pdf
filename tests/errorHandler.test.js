const request = require('supertest');
const express = require('express');
const errorHandler = require('../src/middlewares/errorHandler');

function buildApp(routeHandler) {
  const app = express();
  app.use(express.json());
  app.get('/test', routeHandler);
  app.use(errorHandler);
  return app;
}

describe('errorHandler middleware', () => {
  describe('tipos de erro', () => {
    it('retorna 400 para erro de validação', async () => {
      const app = buildApp((_req, _res, next) => {
        const err = new Error('Campo obrigatório ausente');
        err.type = 'validation';
        next(err);
      });

      const res = await request(app).get('/test');

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ error: 'Campo obrigatório ausente', status: 400 });
    });

    it('retorna 404 para erro de arquivo (type not_found)', async () => {
      const app = buildApp((_req, _res, next) => {
        const err = new Error('Arquivo não encontrado');
        err.type = 'not_found';
        next(err);
      });

      const res = await request(app).get('/test');

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ error: 'Arquivo não encontrado', status: 404 });
    });

    it('retorna 404 para erro de arquivo (code ENOENT)', async () => {
      const app = buildApp((_req, _res, next) => {
        const err = new Error('No such file or directory');
        err.code = 'ENOENT';
        next(err);
      });

      const res = await request(app).get('/test');

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ error: 'No such file or directory', status: 404 });
    });

    it('retorna 500 para erro genérico', async () => {
      const app = buildApp((_req, _res, next) => {
        next(new Error('Algo deu errado'));
      });

      const res = await request(app).get('/test');

      expect(res.status).toBe(500);
      expect(res.body).toMatchObject({ error: 'Algo deu errado', status: 500 });
    });
  });

  describe('stack trace', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('inclui stack trace em desenvolvimento', async () => {
      process.env.NODE_ENV = 'development';

      const app = buildApp((_req, _res, next) => {
        next(new Error('Erro de dev'));
      });

      const res = await request(app).get('/test');

      expect(res.body.stack).toBeDefined();
    });

    it('não inclui stack trace em produção', async () => {
      process.env.NODE_ENV = 'production';

      const app = buildApp((_req, _res, next) => {
        next(new Error('Erro de prod'));
      });

      const res = await request(app).get('/test');

      expect(res.body.stack).toBeUndefined();
    });
  });

  describe('formato da resposta', () => {
    it('retorna sempre Content-Type application/json', async () => {
      const app = buildApp((_req, _res, next) => {
        next(new Error('qualquer'));
      });

      const res = await request(app).get('/test');

      expect(res.headers['content-type']).toMatch(/application\/json/);
    });
  });
});
