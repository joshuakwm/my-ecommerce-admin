class NotFoundError extends Error {
  constructor(message = 'Resource Not Found') {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

class InternalServerError extends Error {
  constructor(message = 'Internal Server Error') {
    super(message);
    this.statusCode = 500;
    this.name = 'InternalServerError';
  }
}

class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export { ApiError, errorHandler, InternalServerError, NotFoundError };
