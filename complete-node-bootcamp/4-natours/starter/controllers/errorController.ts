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
      json: { (arg0: { status: string; message: string }): void; new (): any };
    };
  },
  next: any,
) => {
  let error = err;

  if (error.name === 'CastError') {
    error = handleCastErrorDB(error);
  }

  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};
