
const morgan = require('morgan');
const express = require('express');

const tourRouter = require('./routes/tourRoutes').default;
const userRouter = require('./routes/userRoutes').default;

const app = express();

app.use(morgan('dev')); // Logging middleware for development
app.use(express.json()); // Middleware to parse JSON bodies

app.use((req, res, next) => {
  const currentTime = new Date().toISOString();
  res.created_at = currentTime; // Add createdAt property to the response
  // console.log(`[${currentTime}] Request received:`);
  // console.log(`${req.method} ${req.url}`);
  next(); // Call the next middleware or route handler
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


export default app;

