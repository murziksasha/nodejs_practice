import AppError from '../utils/appError';

const handleCastErrorDB = (err: any) =>
  new AppError(`Invalid ${err.path}: ${err.value}.`, 404);

export default (
  err: any,
  req: any,
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: {
        (arg0: { status: string; message: string; stack?: string }): void;
        new (): any;
      };
    };
  },
  next: any,
) => {
  let error = err;

  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stack: error.stack,
    });
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

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
  }
};
