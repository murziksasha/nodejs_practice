
const morgan = require('morgan');
const express = require('express');

const tourRouter = require('./routes/tourRoutes').default;
const userRouter = require('./routes/userRoutes').default;

const app = express();

if(process.env.NODE_ENV === 'development') {
  console.log('Development mode');
  app.use(morgan('dev'));
}

app.use(morgan('dev')); // Logging middleware for development
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static(`${__dirname}/public`)); // Serve static files from the 'public' directory

app.use((req: any, res: { created_at: string; }, next: () => void) => {
  const currentTime = new Date().toISOString();
  res.created_at = currentTime; // Add createdAt property to the response
  // console.log(`[${currentTime}] Request received:`);
  // console.log(`${req.method} ${req.url}`);
  next(); // Call the next middleware or route handler
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req: { originalUrl: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { status: string; message: string; }): void; new(): any; }; }; }, next: any) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`
  // });
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // @ts-ignore
  err.statusCode = 404;
  // @ts-ignore
  err.status = 'fail';
  next(err);
});

app.use((err: any, req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { status: string; message: string; }): void; new(): any; }; }; }, next: any) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});


export default app;

