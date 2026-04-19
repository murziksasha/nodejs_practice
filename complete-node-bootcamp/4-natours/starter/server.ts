import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import app from './app';

process.on('uncaughtException', (err: any) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Connect to the database

const encodeMongoPassword = (password: string) =>
  encodeURIComponent(password).replace(/[!'()*]/g, (char) =>
    `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );

const DB = process.env.DATABASE!.replace(
  '<PASSWORD>',
  encodeMongoPassword(process.env.DATABASE_PASSWORD!),
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    // useUnifiedTopology: true,  // These options are no longer supported in Mongoose 6 and above
  })
  .then(() => console.log('DB connection successful!  '));

// Start the server

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});


