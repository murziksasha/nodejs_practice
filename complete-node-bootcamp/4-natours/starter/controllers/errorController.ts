import AppError from '../utils/appError';

const handleCastErrorDB = (err: any) =>
  new AppError(`Invalid ${err.path}: ${err.value}.`, 404);

const handleDuplicateFieldsDB = (err: any) => {
  let value = '';

  if (err.keyValue) {
    const key = Object.keys(err.keyValue)[0];
    value = err.keyValue[key];
  } else if (err.errmsg) {
    const match = err.errmsg.match(/(["'])(\\?.)*?\1/);
    value = match ? match[0] : '';
  } else if (err.message) {
    const match = err.message.match(/(["'])(\\?.)*?\1/);
    value = match ? match[0] : '';
  }

  const message = value
    ? `Duplicate field value: ${value}. Please use another value!`
    : 'Duplicate field value. Please use another value!';

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (error: any, res: any) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error: any, res: any) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error('ERROR 💥', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

export default (err: any, req: any, res: any, next: any) => {
  let error = { ...err };
  error.name = err.name;
  error.message = err.message;
  error.code = err.code;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  if (error.name === 'CastError') {
    error = handleCastErrorDB(error);
  }

  if (error.code === 11000) {
    error = handleDuplicateFieldsDB(error);
  }

  if (error.name === 'ValidationError') {
    error = handleValidationErrorDB(error);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(error, res);
  }
};
