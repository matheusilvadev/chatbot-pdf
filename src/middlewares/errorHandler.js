function resolveStatus(err) {
  if (err.type === 'validation') return 400;
  if (err.type === 'not_found' || err.code === 'ENOENT') return 404;
  return 500;
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = resolveStatus(err);
  const body = {
    error: err.message || 'Erro interno do servidor',
    status,
  };

  if (process.env.NODE_ENV === 'development') {
    body.stack = err.stack;
  }

  res.status(status).json(body);
}

module.exports = errorHandler;
