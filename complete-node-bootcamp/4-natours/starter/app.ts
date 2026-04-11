
const morgan = require('morgan');
const express = require('express');

const tourRouter = require('./routes/tourRoutes').default;
const userRouter = require('./routes/userRoutes').default;

const AppError = require('./utils/appError').default;
const globalErrorHandler = require('./controllers/errorController').default;

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
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // // @ts-ignore
  // err.statusCode = 404;
  // // @ts-ignore
  // err.status = 'fail';
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);


export default app;

