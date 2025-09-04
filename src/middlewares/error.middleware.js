function notFound(req, res, next) {
  const err = new Error(`Not Found - ${req.originalUrl}`);
  err.status = 404;
  next(err);
}

function errorHandler(logger) {
  return (err, _req, res, _next) => {
    const status = err.status || 500;
    const message = err.message || 'Server Error';
    logger.error(message, { status, stack: err.stack });
    res.status(status).json({ success: false, message });
  };
}

module.exports = { notFound, errorHandler };
